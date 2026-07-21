import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * useApproval
 *
 * Handles the approval routing flow for a single observation:
 *   Open → On Review PICA → On Review PJA → On Review Approval → Closed
 *
 * Also handles "Return with Comment" which rolls back one step.
 */
export default function useApproval(id, { onSuccess } = {}) {
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState(null);
    const [status, setStatus]             = useState(null);
    // pendingApproval: { action: 'submit'|'approve', currentStatus }
    const [pendingApproval, setPendingApproval] = useState(null);

    // ── Request Submit (shows modal) ──────────────────────────────────────────
    const requestSubmit = useCallback(() => {
        setPendingApproval({ action: 'submit', currentStatus: 'Open' });
    }, []);

    // ── Request Approve (shows modal) ─────────────────────────────────────────
    const requestApprove = useCallback((currentStatus) => {
        setPendingApproval({ action: 'approve', currentStatus });
    }, []);

    // ── Cancel approval modal ─────────────────────────────────────────────────
    const cancelApproval = useCallback(() => setPendingApproval(null), []);

    // ── Confirm: actually execute submit or approve ───────────────────────────
    const confirmApproval = useCallback(async () => {
        if (!pendingApproval) return;
        setLoading(true);
        setError(null);
        try {
            const endpoint = pendingApproval.action === 'submit'
                ? `/api/field-leadership/observations/${id}/submit`
                : `/api/field-leadership/observations/${id}/approve`;
            const res = await axios.post(endpoint);
            const newStatus = res.data?.result?.status;
            setStatus(newStatus);
            setPendingApproval(null);
            if (onSuccess) onSuccess(newStatus);
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal memproses aksi.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [id, pendingApproval, onSuccess]);

    // ── Legacy aliases (keep for backward compat) ────────────────────────────
    const submit  = requestSubmit;
    const approve = requestApprove;

    // ── Return with Comment (rollback one step) ───────────────────────────────
    // comment: string (required), files: File[] (optional)
    const returnWithComment = useCallback(async (currentStatus, comment, files = []) => {
        if (!comment || !comment.trim()) return;
        setLoading(true);
        setError(null);
        try {
            let res;
            if (files && files.length > 0) {
                const form = new FormData();
                form.append('comment', comment.trim());
                files.forEach(f => form.append('files[]', f));
                res = await axios.post(
                    `/api/field-leadership/observations/${id}/return`,
                    form,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            } else {
                res = await axios.post(
                    `/api/field-leadership/observations/${id}/return`,
                    { comment: comment.trim() }
                );
            }
            const newStatus = res.data?.result?.status;
            setStatus(newStatus);
            if (onSuccess) onSuccess(newStatus);
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal mengembalikan dokumen.';
            setError(msg);
            alert(msg);
        } finally {
            setLoading(false);
        }
    }, [id, onSuccess]);

    return {
        loading,
        error,
        status,
        // modal-based
        pendingApproval,
        requestSubmit,
        requestApprove,
        confirmApproval,
        cancelApproval,
        // aliases
        submit,
        approve,
        returnWithComment,
    };
}

// ── Label helpers ─────────────────────────────────────────────────────────────

/**
 * Returns a human-readable confirm label for the approve button
 * based on the current status.
 */
export function approveLabel(currentStatus) {
    switch (currentStatus) {
        case 'Open':                return 'Submit untuk Review';
        case 'On Review PICA':      return 'Setujui & Teruskan ke PJA';
        case 'On Review PJA':       return 'Setujui & Teruskan ke Approval';
        case 'On Review Approval':  return 'Approve & Case Closed';
        default:                    return 'Approve';
    }
}

/**
 * Returns true if the current status can still be advanced.
 */
export function canApprove(currentStatus) {
    return ['Open', 'On Review PICA', 'On Review PJA', 'On Review Approval'].includes(currentStatus);
}

/**
 * Returns true if the current status can be returned/rolled back.
 */
export function canReturn(currentStatus) {
    return ['On Review PICA', 'On Review PJA', 'On Review Approval', 'Closed'].includes(currentStatus);
}
