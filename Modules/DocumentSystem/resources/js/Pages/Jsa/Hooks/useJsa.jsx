import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useJsa(isObsolete = false, isDraft = false) {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJsa, setSelectedJsa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState([]);
    const [fetching, setFetching] = useState(true);

    const openForm = useCallback(() => setFormModalOpen(true), []);
    const closeForm = useCallback(() => setFormModalOpen(false), []);

    const openDrawer = useCallback((jsa) => { setSelectedJsa(jsa); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedJsa(null); }, []);

    const fetchDocuments = useCallback(() => {
        setFetching(true);
        axios.get(`/api/document-system/jsa?is_obsolete=${isObsolete}&is_draft=${isDraft}`)
            .then(res => {
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching JSA documents", err))
            .finally(() => setFetching(false));
    }, [isObsolete, isDraft]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const createJsa = useCallback(async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/document-system/jsa', data);
            closeForm();
            fetchDocuments();
        } catch (err) {
            console.error('Create JSA failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeForm, fetchDocuments]);

    const deleteJsa = useCallback(async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus dokumen JSA ini?')) return;
        try {
            await axios.delete(`/api/document-system/jsa/${id}`);
            fetchDocuments();
        } catch (err) {
            console.error('Delete JSA failed', err);
            alert('Gagal menghapus dokumen JSA.');
        }
    }, [fetchDocuments]);

    return {
        formModalOpen, drawerOpen, selectedJsa, loading, docs, fetching,
        openForm, closeForm, openDrawer, closeDrawer, createJsa, deleteJsa,
    };
}
