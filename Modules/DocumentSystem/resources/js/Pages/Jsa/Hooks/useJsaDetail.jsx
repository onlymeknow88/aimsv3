import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useJsaDetail(id) {
    const [document, setDocument] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    const fetchJsaDetails = useCallback(() => {
        setLoadingData(true);
        axios.get(`/api/document-system/jsa/${id}`)
            .then(res => {
                const data = res.data?.result;
                if (data) {
                    setDocument(data.document);
                }
            })
            .catch(err => console.error("Error loading JSA details", err))
            .finally(() => setLoadingData(false));
    }, [id]);

    useEffect(() => {
        fetchJsaDetails();
    }, [fetchJsaDetails]);

    const submitForReview = useCallback(async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            await axios.post(`/api/document-system/jsa/${id}/submit-review`);
            fetchJsaDetails();
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal mengirim untuk review.';
            setActionError(msg);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [id, fetchJsaDetails]);

    const approveDocument = useCallback(async (notes = '') => {
        setActionLoading(true);
        setActionError(null);
        try {
            await axios.post(`/api/document-system/jsa/${id}/approve`, { notes });
            fetchJsaDetails();
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menyetujui dokumen.';
            setActionError(msg);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [id, fetchJsaDetails]);

    const rejectDocument = useCallback(async (notes) => {
        setActionLoading(true);
        setActionError(null);
        try {
            await axios.post(`/api/document-system/jsa/${id}/reject`, { description: notes });
            fetchJsaDetails();
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menolak dokumen.';
            setActionError(msg);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [id, fetchJsaDetails]);

    return {
        document,
        loadingData,
        actionLoading,
        actionError,
        submitForReview,
        approveDocument,
        rejectDocument,
        refresh: fetchJsaDetails,
    };
}
