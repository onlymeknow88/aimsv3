import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function usePtwDetail(id) {
    const [document, setDocument] = useState(null);
    const [canApprove, setCanApprove] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    const fetchPtwDetails = useCallback(() => {
        setLoadingData(true);
        axios.get(`/api/document-system/ptw/${id}`)
            .then(res => {
                const data = res.data?.result;
                if (data) {
                    setDocument(data.document);
                    setCanApprove(Boolean(data.canApprove));
                }
            })
            .catch(err => console.error("Error loading PTW details", err))
            .finally(() => setLoadingData(false));
    }, [id]);

    useEffect(() => {
        fetchPtwDetails();
    }, [fetchPtwDetails]);

    const submitForReview = useCallback(async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            await axios.post(`/api/document-system/ptw/${id}/submit-review`);
            fetchPtwDetails();
            return true;
        } catch (err) {
            const data = err.response?.data;
            let msg = 'Gagal mengirim untuk review.';
            if (data?.errors) {
                msg = Object.values(data.errors).flat().join(' ');
            } else if (data?.message) {
                msg = data.message;
            }
            setActionError(msg);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [id, fetchPtwDetails]);

    const approveDocument = useCallback(async (notes = '') => {
        setActionLoading(true);
        setActionError(null);
        try {
            await axios.post(`/api/document-system/ptw/${id}/approve`, { notes });
            fetchPtwDetails();
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menyetujui dokumen.';
            setActionError(msg);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [id, fetchPtwDetails]);

    const rejectDocument = useCallback(async (notes) => {
        setActionLoading(true);
        setActionError(null);
        try {
            await axios.post(`/api/document-system/ptw/${id}/reject`, {
                description: notes
            });
            fetchPtwDetails();
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menolak dokumen.';
            setActionError(msg);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [id, fetchPtwDetails]);

    return {
        document,
        canApprove,
        loadingData,
        actionLoading,
        actionError,
        submitForReview,
        approveDocument,
        rejectDocument,
        refresh: fetchPtwDetails,
    };
}
