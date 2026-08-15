import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

/**
 * useCsmsWidget
 *
 * Fetch summary stats CSMS untuk widget di main dashboard.
 * Endpoint: /api/csms/dashboard-stats
 *
 * @param {Object} filters - { years } dari global dashboard filter
 * @returns {{ stats, loading, error, refetch }}
 */
export default function useCsmsWidget(filters = {}) {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    // Serialize years ke string agar bisa dipakai sebagai useEffect dependency
    // tanpa risiko infinite loop dari object reference baru setiap render.
    const yearsKey = Array.isArray(filters.years)
        ? filters.years.join(',')
        : (filters.years ?? '');
    const monthsKey = Array.isArray(filters.months)
        ? filters.months.join(',')
        : (filters.months ?? '');

    const fetchStats = useCallback(async (yr, mn) => {
        setLoading(true);
        setError(false);
        try {
            const params = {};
            if (yr) params.year = yr;
            if (mn) params.month = mn;

            const res    = await axios.get('/api/csms/main-dashboard-stats', { params });
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
        fetchStats(yearsKey, monthsKey);
    }, [yearsKey, monthsKey, fetchStats]);

    const refetch = useCallback(() => {
        fetchStats(yearsKey, monthsKey);
    }, [fetchStats, yearsKey, monthsKey]);

    return { stats, loading, error, refetch };
}
