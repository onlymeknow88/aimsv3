import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useCommissioning() {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(() => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('status') ?? '' : ''));
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        // ?status= memfilter status *proposal* induk (parity newaims
        // In Progress/Returned/Daftar) via ?proposal_status= API.
        axios.get('/api/ko/commissionings', { params: { limit, page, proposal_status: status || undefined } })
            .then(res => {
                const result = res.data?.result ?? {};
                setItems(result?.data ?? []);
                setPagination({ current_page: result?.current_page ?? 1, last_page: result?.last_page ?? 1, total: result?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [limit, page, status]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return { items, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh: doFetch };
}
