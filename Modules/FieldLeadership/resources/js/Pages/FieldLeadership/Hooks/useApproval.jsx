import { useCallback, useState } from 'react';

import axios from 'axios';

/**
 * useApproval — Workflow Baru Field Leadership
 *
 * Open
 *   → submit()
 *     is_immediate_action=true  + area sesuai    → On Review CRS
 *     is_immediate_action=true  + area tdk sesuai → Pending CRS
 *     is_immediate_action=false                  → On Review PJA
 *
 * On Review PJA → pjaReview(is_area_suitable)
 *   true  → On Review CRS
 *   false → Pending CRS
 *
 * Pending CRS → crsAction('approve'|'reject', pja_id_new?)
 *   approve → On Review CRS
 *   reject  → Not Followed Up
 *
 * On Review CRS → crsVerify('approve'|'reject')
 *   approve → Closed
 *   reject  → On Review PJA
 *
 * Any → returnWithComment() → rollback 1 step
 */
export default function useApproval(id, { onSuccess } = {}) {
    const [loading, setLoading]                 = useState(false);
    const [error,   setError]                   = useState(null);
    const [status,  setStatus]                  = useState(null);
    const [pendingApproval, setPendingApproval] = useState(null);
    const [pjaReviewModal, setPjaReviewModal]   = useState(false);
    const [crsActionModal, setCrsActionModal]   = useState(false);
    const [crsVerifyModal, setCrsVerifyModal]   = useState(false);

    const handleSuccess = useCallback((newStatus) => {
        setStatus(newStatus);
        if (onSuccess) onSuccess(newStatus);
    }, [onSuccess]);

    const handleError = useCallback((err, fallback = 'Gagal memproses aksi.') => {
        const msg = err.response?.data?.message || fallback;
        setError(msg);
        alert(msg);
    }, []);

    // ── Submit (Open → ...) ───────────────────────────────────────────────────
    const requestSubmit = useCallback(() => {
        setPendingApproval({ action: 'submit', currentStatus: 'Open' });
    }, []);

    const confirmApproval = useCallback(async () => {
        if (!pendingApproval || pendingApproval.action !== 'submit') return;
        setLoading(true); setError(null);
        try {
            const res = await axios.post(`/api/field-leadership/${id}/submit`);
            setPendingApproval(null);
            handleSuccess(res.data?.result?.status);
        } catch (err) { handleError(err); }
        finally { setLoading(false); }
    }, [id, pendingApproval, handleSuccess, handleError]);

    const cancelApproval = useCallback(() => setPendingApproval(null), []);

    // ── PJA Review (On Review PJA → ...) ────────────────────────────────────
    const requestPjaReview = useCallback(() => setPjaReviewModal(true), []);

    const confirmPjaReview = useCallback(async (isAreaSuitable, reason = '') => {
        setLoading(true); setError(null);
        try {
            const res = await axios.post(`/api/field-leadership/${id}/pja-review`, {
                is_area_suitable:  isAreaSuitable ? 1 : 0,
                pja_change_reason: reason || null,
            });
            setPjaReviewModal(false);
            handleSuccess(res.data?.result?.status);
        } catch (err) { handleError(err); }
        finally { setLoading(false); }
    }, [id, handleSuccess, handleError]);

    // ── CRS Action (Pending CRS → ...) ───────────────────────────────────────
    const requestCrsAction = useCallback(() => setCrsActionModal(true), []);

    const confirmCrsAction = useCallback(async (action, pjaIdNew = null, reason = '') => {
        setLoading(true); setError(null);
        try {
            const res = await axios.post(`/api/field-leadership/${id}/crs-action`, {
                action,
                pja_id_new: pjaIdNew || null,
                reason:     reason  || null,
            });
            setCrsActionModal(false);
            handleSuccess(res.data?.result?.status);
        } catch (err) { handleError(err); }
        finally { setLoading(false); }
    }, [id, handleSuccess, handleError]);

    // ── CRS Verify (On Review CRS → ...) ────────────────────────────────────
    const requestCrsVerify = useCallback(() => setCrsVerifyModal(true), []);

    const confirmCrsVerify = useCallback(async (action, reason = '') => {
        setLoading(true); setError(null);
        try {
            const res = await axios.post(`/api/field-leadership/${id}/crs-verify`, {
                action,
                reason: reason || null,
            });
            setCrsVerifyModal(false);
            handleSuccess(res.data?.result?.status);
        } catch (err) { handleError(err); }
        finally { setLoading(false); }
    }, [id, handleSuccess, handleError]);

    // ── Return with Comment (rollback 1 step) ────────────────────────────────
    const returnWithComment = useCallback(async (currentStatus, comment, files = []) => {
        if (!comment?.trim()) return;
        setLoading(true); setError(null);
        try {
            let res;
            if (files?.length > 0) {
                const form = new FormData();
                form.append('comment', comment.trim());
                files.forEach(f => form.append('files[]', f));
                res = await axios.post(`/api/field-leadership/${id}/return`, form,
                    { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                res = await axios.post(`/api/field-leadership/${id}/return`, { comment: comment.trim() });
            }
            handleSuccess(res.data?.result?.status);
        } catch (err) { handleError(err, 'Gagal mengembalikan dokumen.'); }
        finally { setLoading(false); }
    }, [id, handleSuccess, handleError]);

    return {
        loading, error, status,
        // Submit
        pendingApproval, requestSubmit, confirmApproval, cancelApproval,
        // PJA Review
        pjaReviewModal, requestPjaReview, confirmPjaReview,
        cancelPjaReview: () => setPjaReviewModal(false),
        // CRS Action
        crsActionModal, requestCrsAction, confirmCrsAction,
        cancelCrsAction: () => setCrsActionModal(false),
        // CRS Verify
        crsVerifyModal, requestCrsVerify, confirmCrsVerify,
        cancelCrsVerify: () => setCrsVerifyModal(false),
        // Return
        returnWithComment,
    };
}

// ── Helper functions for UI ───────────────────────────────────────────────────

export function getActionButton(currentStatus) {
    switch (currentStatus) {
        case 'Open':            return { label: 'Submit untuk Review', action: 'submit' };
        case 'On Review PJA':   return { label: 'Review PJA', action: 'pja-review' };
        case 'Pending CRS':     return { label: 'Aksi CRS', action: 'crs-action' };
        case 'On Review CRS':   return { label: 'Verifikasi CRS', action: 'crs-verify' };
        default:                return null;
    }
}

export function canReturn(currentStatus) {
    return ['On Review PJA', 'Pending CRS', 'On Review CRS'].includes(currentStatus);
}
