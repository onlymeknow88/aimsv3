import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useDraft() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
     const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
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
        axios.get('/api/document-system/documents?status=2',{
             params: {
                page: page,
                limit: limit,
                search: search,
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
                setDocs(res.data?.result || []);
            })
            .catch(err => console.error("Error fetching draft documents", err))
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

    const handleEdit = useCallback(() => {
        if (selectedIds.length === 1) {
            window.location.href = `/document-system/active/edit/${selectedIds[0]}`;
        }
    }, [selectedIds]);

    const handleDelete = useCallback(async () => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} draf terpilih?`)) {
            try {
                console.log("Delete drafts:", selectedIds);
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
        handleDelete,
        limit,
        setLimit,
        page,
        setPage,
        pagination,
        setPagination,
        columnFilters,
        setColumnFilters,
    };
}
