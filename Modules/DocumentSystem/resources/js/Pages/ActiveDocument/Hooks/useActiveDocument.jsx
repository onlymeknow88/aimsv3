import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useActiveDocument() {
    const [search, setSearch] = useState('');
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [previewDoc, setPreviewDoc] = useState(null);

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents?status=5,7')
            .then(res => {
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching documents", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const openPreview = useCallback((doc) => {
        setPreviewDoc(doc);
    }, []);

    const closePreview = useCallback(() => {
        setPreviewDoc(null);
    }, []);

    const downloadFile = useCallback(async (attachmentId, fileName) => {
        try {
            const response = await axios.get(`/api/document-system/attachments/${attachmentId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed', err);
        }
    }, []);

    const handleEdit = useCallback(() => {
        if (selectedIds.length === 1) {
            window.location.href = `/document-system/active/edit/${selectedIds[0]}`;
        }
    }, [selectedIds]);

    const handleDelete = useCallback(async () => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} dokumen terpilih?`)) {
            try {
                // Perform delete or bulk delete API call here if needed
                console.log("Delete documents:", selectedIds);
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    }, [selectedIds]);

    return { 
        search, 
        setSearch, 
        docs, 
        setDocs, 
        loading, 
        selectedIds, 
        setSelectedIds, 
        previewDoc, 
        openPreview, 
        closePreview, 
        downloadFile,
        handleEdit,
        handleDelete
    };
}
