import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

export default function useRisks() {
    const [docs, setDocs]             = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [limit, setLimit]           = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [selectedIds, setSelectedIds] = useState([]);
    const [columnFilters, setColumnFilters] = useState({
        status:    '',
        date_from: '',
        date_to:   '',
    });

    const fetchDocs = useCallback(() => {
        setLoading(true);
        axios.get('/api/field-leadership/risks', {
            params: {
                search,
                page,
                limit,
                status:    columnFilters.status,
                date_from: columnFilters.date_from,
                date_to:   columnFilters.date_to,
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
            .catch(err => console.error('Fetch risks failed', err))
            .finally(() => setLoading(false));
    }, [search, page, limit, columnFilters]);

    useEffect(() => { setPage(1); }, [search]);
    useEffect(() => { setPage(1); }, [limit]);
    useEffect(() => { setPage(1); }, [columnFilters]);
    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    return {
        docs, loading,
        search, setSearch,
        page, setPage,
        limit, setLimit,
        pagination,
        selectedIds, setSelectedIds,
        columnFilters, setColumnFilters,
        fetchDocs,
    };
}
