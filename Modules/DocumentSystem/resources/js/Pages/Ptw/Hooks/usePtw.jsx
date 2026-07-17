import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function usePtw() {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPtw, setSelectedPtw] = useState(null);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState([]);
    const [fetching, setFetching] = useState(true);

    const openForm = useCallback(() => setFormModalOpen(true), []);
    const closeForm = useCallback(() => setFormModalOpen(false), []);

    const openDrawer = useCallback((ptw) => { setSelectedPtw(ptw); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedPtw(null); }, []);

    const fetchDocuments = useCallback(() => {
        setFetching(true);
        axios.get('/api/document-system/ptw')
            .then(res => {
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching PTW documents", err))
            .finally(() => setFetching(false));
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const createPtw = useCallback(async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/document-system/ptw', data);
            closeForm();
            fetchDocuments();
        } catch (err) {
            console.error('Create PTW failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeForm, fetchDocuments]);

    return {
        formModalOpen, drawerOpen, selectedPtw, loading, docs, fetching,
        openForm, closeForm, openDrawer, closeDrawer, createPtw,
    };
}
