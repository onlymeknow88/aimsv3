import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function usePica() {
    const [picas, setPicas]           = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [status, setStatus]         = useState('');
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/csms/picas', {
            params: { search, status, limit, page }
        })
        .then(res => {
            const result = res.data?.result || res.data?.data || res.data;
            setPicas(result?.data ?? (Array.isArray(result) ? result : []));
            setPagination({
                current_page: result?.current_page ?? 1,
                last_page:    result?.last_page    ?? 1,
                total:        result?.total        ?? 0
            });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [search, status, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return {
        picas, pagination, loading,
        search, setSearch,
        status, setStatus,
        limit, setLimit,
        page, setPage,
        refresh: doFetch
    };
}
