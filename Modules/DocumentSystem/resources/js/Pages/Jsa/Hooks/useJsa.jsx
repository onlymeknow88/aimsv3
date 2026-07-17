import { useState, useCallback } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function useJsa() {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJsa, setSelectedJsa] = useState(null);
    const [loading, setLoading] = useState(false);

    const openForm = useCallback(() => setFormModalOpen(true), []);
    const closeForm = useCallback(() => setFormModalOpen(false), []);

    const openDrawer = useCallback((jsa) => { setSelectedJsa(jsa); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedJsa(null); }, []);

    const createJsa = useCallback(async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/document-system/jsa', data);
            closeForm();
            router.reload();
        } catch (err) {
            console.error('Create JSA failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeForm]);

    return {
        formModalOpen, drawerOpen, selectedJsa, loading,
        openForm, closeForm, openDrawer, closeDrawer, createJsa,
    };
}
