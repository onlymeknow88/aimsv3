import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/pica/documents';

export default function useReviewCrs() {
    const [documents, setDocuments]   = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);

    const [search, setSearch] = useState('');
    const [source, setSource] = useState('');
    const [limit, setLimit]   = useState(10);
    const [page, setPage]     = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        setError(null);
        axios.get(BASE_URL, {
            params: {
                published: 'Publish',
                requested: 'Requested CRS',
                search:    search || undefined,
                source:    source || undefined,
                limit,
                page,
            },
        })
        .then(res => {
            const result = res.data?.result;
            setDocuments(result?.data ?? []);
            setPagination({
                current_page: result?.current_page ?? 1,
                last_page:    result?.last_page    ?? 1,
                total:        result?.total        ?? 0,
            });
        })
        .catch(() => setError('Gagal memuat data.'))
        .finally(() => setLoading(false));
    }, [search, source, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    const submitApproval = (id, action) => {
        return axios.post(`${BASE_URL}/${id}/approval`, { action }).then(() => doFetch());
    };

    return {
        documents, pagination, loading, error,
        search, setSearch,
        source, setSource,
        limit, setLimit,
        page, setPage,
        refresh: doFetch,
        submitApproval,
    };
}