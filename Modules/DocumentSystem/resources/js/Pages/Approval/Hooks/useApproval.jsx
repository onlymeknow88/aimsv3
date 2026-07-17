import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useApproval() {
    const [search, setSearch] = useState('');
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents?status=1,3,4')
            .then(res => {
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching approval documents", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const openDrawer = useCallback((doc) => { setSelectedDoc(doc); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedDoc(null); }, []);

    const openApprove = useCallback((doc) => { setSelectedDoc(doc); setApproveModalOpen(true); }, []);
    const closeApprove = useCallback(() => { setApproveModalOpen(false); setSelectedDoc(null); }, []);

    const openReject = useCallback((doc) => { setSelectedDoc(doc); setRejectModalOpen(true); }, []);
    const closeReject = useCallback(() => { setRejectModalOpen(false); setSelectedDoc(null); }, []);

    const approveDocument = useCallback(async (id, level, notes) => {
        setActionLoading(true);
        try {
            await axios.post(`/document-system/approval/${id}/approve`, { level, notes });
            closeApprove();
            fetchDocuments();
        } catch (err) {
            console.error('Approve failed', err);
        } finally {
            setActionLoading(false);
        }
    }, [closeApprove, fetchDocuments]);

    const rejectDocument = useCallback(async (id, reason) => {
        setActionLoading(true);
        try {
            await axios.post(`/document-system/approval/${id}/reject`, { reason });
            closeReject();
            fetchDocuments();
        } catch (err) {
            console.error('Reject failed', err);
        } finally {
            setActionLoading(false);
        }
    }, [closeReject, fetchDocuments]);

    return {
        search,
        setSearch,
        docs,
        loading,
        actionLoading,
        selectedIds,
        setSelectedIds,
        drawerOpen,
        approveModalOpen,
        rejectModalOpen,
        selectedDoc,
        openDrawer,
        closeDrawer,
        openApprove,
        closeApprove,
        openReject,
        closeReject,
        approveDocument,
        rejectDocument,
    };
}
