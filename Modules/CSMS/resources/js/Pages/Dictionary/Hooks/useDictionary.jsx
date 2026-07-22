import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useDictionary() {
    const [items, setItems]           = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/csms/dictionaries', {
            params: { search, limit, page }
        })
        .then(res => {
            const result = res.data?.result || res.data?.data || res.data;
            setItems(result?.data ?? (Array.isArray(result) ? result : []));
            setPagination({
                current_page: result?.current_page ?? 1,
                last_page:    result?.last_page    ?? 1,
                total:        result?.total        ?? 0
            });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [search, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return {
        items, pagination, loading,
        search, setSearch,
        limit, setLimit,
        page, setPage,
        refresh: doFetch
    };
}
