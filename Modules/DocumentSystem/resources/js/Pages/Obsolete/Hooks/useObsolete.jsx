import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useObsolete() {
    const [search, setSearch] = useState('');
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents?status=8')
            .then(res => {
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching obsolete documents", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleEdit = useCallback(() => {
        if (selectedIds.length === 1) {
            window.location.href = `/document-system/active/edit/${selectedIds[0]}`;
        }
    }, [selectedIds]);

    const handleDelete = useCallback(async () => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} dokumen usang terpilih?`)) {
            try {
                console.log("Delete obsolete documents:", selectedIds);
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    }, [selectedIds]);

    return { 
        search, 
        setSearch, 
        docs, 
        loading, 
        selectedIds, 
        setSelectedIds, 
        handleEdit, 
        handleDelete 
    };
}
