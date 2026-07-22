import { useCallback, useEffect, useState } from 'react';

export default function useBidding(defaultCriteria = 'Bidding') {
    const [biddings, setBiddings]     = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [status, setStatus]         = useState('');
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ search, status, limit, page, criteria: defaultCriteria });
        fetch(`/api/csms/biddings?${params}`)
            .then(r => r.json())
            .then(d => {
                setBiddings(d?.data?.data ?? []);
                setPagination({
                    current_page: d?.data?.current_page ?? 1,
                    last_page:    d?.data?.last_page    ?? 1,
                    total:        d?.data?.total        ?? 0,
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, status, limit, page, defaultCriteria]);

    useEffect(() => { doFetch(); }, [doFetch]);

    const deleteBidding = (id) =>
        fetch(`/api/csms/biddings/${id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content },
        })
        .then(r => r.json())
        .then(() => doFetch());

    const submitApproval = (id, action, comment = '') =>
        fetch(`/api/csms/approval/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content,
            },
            body: JSON.stringify({ action, comment }),
        }).then(r => r.json()).then(() => doFetch());

    return {
        biddings, pagination, loading,
        search, setSearch,
        status, setStatus,
        limit, setLimit,
        page, setPage,
        refresh: doFetch,
        deleteBidding,
        submitApproval,
    };
}

