import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useLoginLog() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        success_today: 0,
        failed_today: 0,
        active_users_24h: 0,
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState(null);

    // Filter states
    const [search, setSearch] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/login-logs', {
                params: {
                    page,
                    limit,
                    search,
                    event: eventFilter,
                    date_from: dateFrom,
                    date_to: dateTo,
                }
            });
            if (res.data?.meta?.status === 'success') {
                setLogs(res.data.result.data || []);
                setPagination({
                    current_page: res.data.result.current_page,
                    last_page: res.data.result.last_page,
                    total: res.data.result.total,
                });
            }
        } catch (e) {
            console.error('Failed to fetch login logs', e);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, eventFilter, dateFrom, dateTo]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/login-logs/stats');
            if (res.data?.meta?.status === 'success') {
                setStats(res.data.result);
            }
        } catch (e) {
            console.error('Failed to fetch login logs stats', e);
        }
    }, []);

    const handleExport = () => {
        const queryParams = new URLSearchParams({
            export: 'csv',
            search,
            event: eventFilter,
            date_from: dateFrom,
            date_to: dateTo,
        }).toString();

        window.location.href = `/api/admin/login-logs?${queryParams}`;
    };

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [search, eventFilter, dateFrom, dateTo]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        logs,
        stats,
        loading,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        search,
        setSearch,
        eventFilter,
        setEventFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        fetchLogs,
        fetchStats,
        handleExport,
    };
}
