import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

/**
 * useCsmsWidget
 *
 * Fetch summary stats CSMS untuk widget di main dashboard.
 * Endpoint reuse dari /api/csms/dashboard-stats yang sudah ada.
 *
 * @param {Object} filters - { years } dari global dashboard filter
 * @returns {{ stats, loading, error, refetch }}
 */
export default function useCsmsWidget(filters = {}) {
    const [stats,   setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    const buildParams = useCallback((f) => {
        const params = {};
        if (f.years) {
            params.year = Array.isArray(f.years) ? f.years.join(',') : f.years;
        }
        return params;
    }, []);

    const fetchStats = useCallback(async (currentFilters) => {
        setLoading(true);
        setError(false);
        try {
            const params = buildParams(currentFilters);
            const res = await axios.get('/api/csms/dashboard-stats', { params });
            const result = res.data?.result ?? null;
            if (result) {
                setStats(result);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [buildParams]);

    useEffect(() => {
        fetchStats(filters);
    }, [filters?.years, fetchStats]);

    const refetch = useCallback(() => {
        fetchStats(filters);
    }, [fetchStats, filters]);

    return { stats, loading, error, refetch };
}