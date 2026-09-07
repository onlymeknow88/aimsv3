import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

/**
 * useWidgetStats
 *
 * Hook generik untuk fetch stats widget main dashboard.
 * - Mengirim param kanonik `years` & `months` (comma-separated).
 * - AbortController: request lama dibatalkan saat filter berubah/unmount
 *   sehingga tidak ada race condition antar response.
 *
 * @param {string} endpoint - URL API stats
 * @param {Object} filters  - { years, months } dari global dashboard filter
 * @returns {{ stats, loading, error, refetch }}
 */
export default function useWidgetStats(endpoint, filters = {}) {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    // Serialize ke string agar aman sebagai dependency useEffect
    // tanpa risiko infinite loop dari object reference baru setiap render.
    const yearsKey  = Array.isArray(filters.years)  ? filters.years.join(',')  : (filters.years ?? '');
    const monthsKey = Array.isArray(filters.months) ? filters.months.join(',') : (filters.months ?? '');

    const fetchData = useCallback(async (signal) => {
        setLoading(true);
        setError(false);
        try {
            const params = {};
            if (yearsKey)  params.years  = yearsKey;
            if (monthsKey) params.months = monthsKey;

            const res = await axios.get(endpoint, { params, signal });
            if (res.data?.result) {
                setStats(res.data.result);
            } else {
                setError(true);
            }
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error(`Failed to fetch ${endpoint}:`, err);
            setError(true);
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    }, [endpoint, yearsKey, monthsKey]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData(new AbortController().signal);
    }, [fetchData]);

    return { stats, loading, error, refetch };
}
