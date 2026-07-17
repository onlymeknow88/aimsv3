import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useOnGoing() {
    const [search, setSearch] = useState('');
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents?status=1,3,4,6')
            .then(res => {
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching ongoing documents", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const openDrawer = useCallback((doc) => { setSelectedDoc(doc); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedDoc(null); }, []);

    return { 
        search,
        setSearch,
        docs,
        loading,
        selectedIds,
        setSelectedIds,
        drawerOpen, 
        selectedDoc, 
        openDrawer, 
        closeDrawer 
    };
}
