import { useState, useCallback } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function useApproval() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [loading, setLoading] = useState(false);

    const openDrawer = useCallback((doc) => { setSelectedDoc(doc); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedDoc(null); }, []);

    const openApprove = useCallback((doc) => { setSelectedDoc(doc); setApproveModalOpen(true); }, []);
    const closeApprove = useCallback(() => { setApproveModalOpen(false); setSelectedDoc(null); }, []);

    const openReject = useCallback((doc) => { setSelectedDoc(doc); setRejectModalOpen(true); }, []);
    const closeReject = useCallback(() => { setRejectModalOpen(false); setSelectedDoc(null); }, []);

    const approveDocument = useCallback(async (id, level, notes) => {
        setLoading(true);
        try {
            await axios.post(`/document-system/approval/${id}/approve`, { level, notes });
            closeApprove();
            router.reload();
        } catch (err) {
            console.error('Approve failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeApprove]);

    const rejectDocument = useCallback(async (id, reason) => {
        setLoading(true);
        try {
            await axios.post(`/document-system/approval/${id}/reject`, { reason });
            closeReject();
            router.reload();
        } catch (err) {
            console.error('Reject failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeReject]);

    return {
        drawerOpen, approveModalOpen, rejectModalOpen, selectedDoc, loading,
        openDrawer, closeDrawer, openApprove, closeApprove, openReject, closeReject,
        approveDocument, rejectDocument,
    };
}
