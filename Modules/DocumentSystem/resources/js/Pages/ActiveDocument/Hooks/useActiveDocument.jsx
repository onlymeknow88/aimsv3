import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useActiveDocument() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [columnFilters, setColumnFilters] = useState({
        company: '',
        department: '',
        pic: '',
        module: '',
        category: '',
        document_level: '',
        mapping: '',
        document_number: '',
        title: '',
    });

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents', {
            params: {
                status: '5,7',
                search,
                page,
                limit,
                filter_company: columnFilters.company,
                filter_department: columnFilters.department,
                filter_pic: columnFilters.pic,
                filter_module: columnFilters.module,
                filter_category: columnFilters.category,
                filter_document_level: columnFilters.document_level,
                filter_mapping: columnFilters.mapping,
                filter_document_number: columnFilters.document_number,
                filter_title: columnFilters.title,
            }
        })
            .then(res => {
                setDocs(res.data?.result?.data || []);
                setPagination({
                    current_page: res.data?.result?.current_page || 1,
                    last_page: res.data?.result?.last_page || 1,
                    total: res.data?.result?.total || 0,
                });
            })
            .catch(err => console.error("Error fetching documents", err))
            .finally(() => setLoading(false));
    }, [search, page, limit, columnFilters]);

    // Reset page to 1 on search change
    useEffect(() => {
        setPage(1);
    }, [search]);

    // Reset page to 1 on limit change
    useEffect(() => {
        setPage(1);
    }, [limit]);

    // reset page to 1 on columnFilters change
    useEffect(() => {
        setPage(1);
    }, [columnFilters]);

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
        if (selectedIds.length === 0) return;
        if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} dokumen terpilih? Tindakan ini tidak dapat dibatalkan.`)) return;

        try {
            await axios.delete('/api/document-system/documents', {
                data: { ids: selectedIds }
            });
            setSelectedIds([]);
            fetchDocuments();
        } catch (err) {
            console.error('Delete failed', err);
            alert('Gagal menghapus dokumen. Silakan coba lagi.');
        }
    }, [selectedIds, fetchDocuments]);

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
        handleDelete,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        columnFilters,
        setColumnFilters,
    };
}
