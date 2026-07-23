import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useBidding(defaultCriteria = 'Bidding', defaultStatus = '') {
    const [biddings, setBiddings]     = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [status, setStatus]         = useState(defaultStatus);
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/csms/biddings', {
            params: { search, status, limit, page, criteria: defaultCriteria }
        })
        .then(res => {
            const result = res.data?.result || res.data?.data || res.data;
            setBiddings(result?.data ?? (Array.isArray(result) ? result : []));
            setPagination({
                current_page: result?.current_page ?? 1,
                last_page:    result?.last_page    ?? 1,
                total:        result?.total        ?? 0,
            });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [search, status, limit, page, defaultCriteria]);

    useEffect(() => { doFetch(); }, [doFetch]);

    const deleteBidding = (id) =>
        axios.delete(`/api/csms/biddings/${id}`)
        .then(() => doFetch());

    const bulkDeleteBidding = (ids) =>
        axios.post('/api/csms/biddings/bulk-delete', { ids })
        .then(() => doFetch());

    const submitApproval = (id, action, comment = '') =>
        axios.post(`/api/csms/approval/${id}`, { action, comment })
        .then(() => doFetch());

    return {
        biddings, pagination, loading,
        search, setSearch,
        status, setStatus,
        limit, setLimit,
        page, setPage,
        refresh: doFetch,
        deleteBidding, bulkDeleteBidding, submitApproval,
    };
}
