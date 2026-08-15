import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

/**
 * useProductionWidget
 * Fetch production stats for the main dashboard widget.
 * Endpoint: /api/dashboard/production/stats
 */
export default function useProductionWidget(filters = {}) {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    const yearsKey = Array.isArray(filters.years)
        ? filters.years.join(',')
        : (filters.years ?? '');

    const fetchStats = useCallback(async (yearsParam) => {
        setLoading(true);
        setError(false);
        try {
            const params = {};
            if (yearsParam) params.year = yearsParam;

            const res    = await axios.get('/api/dashboard/production/stats', { params });
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
    }, []);

    useEffect(() => {
        fetchStats(yearsKey);
    }, [yearsKey, fetchStats]);

    const refetch = useCallback(() => {
        fetchStats(yearsKey);
    }, [fetchStats, yearsKey]);

    return { stats, loading, error, refetch };
}
