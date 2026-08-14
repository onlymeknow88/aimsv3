import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useAimsLegacy() {
    const [docs, setDocs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [columnFilters, setColumnFilters] = useState({});
    
    // Pagination states
    const [page, setPage]       = useState(1);
    const [limit, setLimit]     = useState(10);
    const [pagination, setPagination] = useState(null);

    const fetchAimsLegacy = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page,
                limit,
            };
            Object.keys(columnFilters).forEach(key => {
                if (columnFilters[key]) {
                    params[key] = columnFilters[key];
                }
            });

            const response = await axios.get('/api/document-system/aims-legacy', { params });
            const metaStatus = response.data?.meta?.status;
            if (metaStatus === 'success' || response.data?.success) {
                const paginatedData = response.data?.result;
                setDocs(paginatedData?.data ?? []);
                setPagination({
                    current_page: paginatedData?.current_page ?? 1,
                    last_page: paginatedData?.last_page ?? 1,
                    total: paginatedData?.total ?? 0,
                });
            } else {
                setError(response.data?.meta?.message ?? 'Gagal mengambil data.');
            }
        } catch (err) {
            console.error('Fetch AIMS legacy failed', err);
            setError(err.response?.data?.meta?.message ?? 'Terjadi kesalahan sistem.');
        } finally {
            setLoading(false);
        }
    }, [columnFilters, page, limit]);

    useEffect(() => {
        fetchAimsLegacy();
    }, [fetchAimsLegacy]);

    return {
        docs,
        loading,
        error,
        columnFilters,
        setColumnFilters,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        refresh: fetchAimsLegacy,
    };
}
