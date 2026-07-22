import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

export default function useObservations(defaultType = '') {
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [limit, setLimit]           = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [docs, setDocs]             = useState([]);
    const [loading, setLoading]       = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [columnFilters, setColumnFilters] = useState({
        type:       defaultType,
        status:     '',
        company:    '',
        department: '',
        date_from:  '',
        date_to:    '',
    });

    const fetchDocs = useCallback(() => {
        setLoading(true);
        axios.get('/api/field-leadership', {
            params: {
                search,
                page,
                limit,
                type:        columnFilters.type,
                status:      columnFilters.status,
                company_id:  columnFilters.company,
                date_from:   columnFilters.date_from,
                date_to:     columnFilters.date_to,
            },
        })
            .then(res => {
                const result = res.data?.result;
                if (result?.data) {
                    setDocs(result.data);
                    setPagination({
                        current_page: result.current_page || 1,
                        last_page:    result.last_page    || 1,
                        total:        result.total        || 0,
                    });
                } else {
                    setDocs([]);
                    setPagination({ current_page: 1, last_page: 1, total: 0 });
                }
            })
            .catch(err => console.error('Fetch observations failed', err))
            .finally(() => setLoading(false));
    }, [search, page, limit, columnFilters]);

    useEffect(() => { setPage(1); }, [search]);
    useEffect(() => { setPage(1); }, [limit]);
    useEffect(() => { setPage(1); }, [columnFilters]);
    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleting, setDeleting]                     = useState(false);

    const requestDelete = useCallback(() => {
        if (selectedIds.length === 0) return;
        setDeleteConfirmOpen(true);
    }, [selectedIds]);

    const confirmDelete = useCallback(async () => {
        setDeleting(true);
        try {
            await axios.delete('/api/field-leadership', { data: { ids: selectedIds } });
            setSelectedIds([]);
            setDeleteConfirmOpen(false);
            fetchDocs();
        } catch (err) {
            console.error('Delete failed', err);
        } finally {
            setDeleting(false);
        }
    }, [selectedIds, fetchDocs]);

    const cancelDelete = useCallback(() => setDeleteConfirmOpen(false), []);

    const openDrawer = useCallback((item) => {
        setSelectedItem(item);
        setDrawerOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
        setSelectedItem(null);
    }, []);

    return {
        docs, loading,
        search, setSearch,
        page, setPage,
        limit, setLimit,
        pagination,
        selectedIds, setSelectedIds,
        columnFilters, setColumnFilters,
        fetchDocs,
        requestDelete, confirmDelete, cancelDelete,
        deleteConfirmOpen, deleting,
        drawerOpen, openDrawer, closeDrawer,
        selectedItem,
    };
}
