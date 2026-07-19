import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useObsolete() {
    const [search, setSearch] = useState('');
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
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents?status=8', {
            params: {
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
            .catch(err => console.error("Error fetching obsolete documents", err))
            .finally(() => setLoading(false));
    }, [search, page, limit, columnFilters]);

    // reset page to 1 on search change
    useEffect(() => {
        setPage(1);
    }, [search]);

    // reset page to 1 on limit change
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
        handleDelete,
        pagination,
        setPagination,
        limit,
        setLimit,
        page,
        setPage,
        fetchDocuments,
        columnFilters,
        setColumnFilters,
    };
}
