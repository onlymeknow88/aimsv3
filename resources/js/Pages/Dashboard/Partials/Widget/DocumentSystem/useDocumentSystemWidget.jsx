import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

/**
 * useDocumentSystemWidget
 *
 * Custom hook untuk DocumentSystemWidget.
 * Mengelola fetch stats, loading, error, dan re-fetch saat filter berubah.
 *
 * @param {Object} filters - { years, months, companies }
 *   Setiap field bisa berupa string (comma-separated) atau array.
 *   Default: tahun berjalan (dihandle di backend).
 *
 * @returns {{ stats, loading, error, refetch }}
 */
export default function useDocumentSystemWidget(filters = {}) {
    const [stats,   setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    /**
     * Normalise filter values — array → comma-separated string
     * agar bisa dikirim sebagai query param.
     */
    const buildParams = useCallback((currentFilters) => {
        const params = {};
        if (currentFilters.years) {
            params.years = Array.isArray(currentFilters.years)
                ? currentFilters.years.join(',')
                : currentFilters.years;
        }
        if (currentFilters.months) {
            params.months = Array.isArray(currentFilters.months)
                ? currentFilters.months.join(',')
                : currentFilters.months;
        }
        if (currentFilters.companies) {
            params.companies = Array.isArray(currentFilters.companies)
                ? currentFilters.companies.join(',')
                : currentFilters.companies;
        }
        return params;
    }, []);

    const fetchStats = useCallback(async (currentFilters) => {
        setLoading(true);
        setError(false);
        try {
            const params = buildParams(currentFilters);
            const res = await axios.get('/api/portal/document-system/stats', { params });
            if (res.data?.meta?.code === 200) {
                setStats(res.data.result);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [buildParams]);

    // Re-fetch setiap kali filter berubah
    useEffect(() => {
        fetchStats(filters);
    }, [
        filters?.years,
        filters?.months,
        filters?.companies,
        fetchStats,
    ]);

    /** Expose refetch agar bisa dipanggil manual (e.g. dari tombol retry) */
    const refetch = useCallback(() => {
        fetchStats(filters);
    }, [fetchStats, filters]);

    return { stats, loading, error, refetch };
}