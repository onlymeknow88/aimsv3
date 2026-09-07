import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useIssue() {
    const [issues, setIssues] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/ko/issues', { params: { limit, page } })
            .then(res => {
                const result = res.data?.result ?? {};
                setIssues(result?.data ?? []);
                setPagination({ current_page: result?.current_page ?? 1, last_page: result?.last_page ?? 1, total: result?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    const verify = useCallback((id, action, message = '', files = []) => {
        let req;
        if (files && files.length > 0) {
            const formData = new FormData();
            formData.append('action', action);
            if (message) formData.append('message', message);
            files.forEach(f => formData.append('files[]', f));
            req = axios.post(`/api/ko/issues/${id}/verify`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            req = axios.post(`/api/ko/issues/${id}/verify`, { action, message });
        }
        return req.then(() => doFetch());
    }, [doFetch]);

    const shown = issues.filter(i =>
        (!search || (i.note ?? '').toLowerCase().includes(search.toLowerCase())) &&
        (!status || i.status === status)
    );

    return { issues: shown, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh: doFetch, verify };
}
