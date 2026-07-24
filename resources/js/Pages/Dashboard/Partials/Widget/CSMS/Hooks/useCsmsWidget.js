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

    const fetchStats = useCallback(async (yearsParam) => {
        setLoading(true);
        setError(false);
        try {
            const params = {};
            if (yearsParam) params.year = yearsParam;

            const res    = await axios.get('/api/csms/dashboard-stats', { params });
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
