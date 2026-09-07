import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useDashboard(year) {
    const [stats, setStats]   = useState({ total: 0, by_status: {}, monthly: [] });
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/ko/dashboard-stats', { params: { year: year ?? new Date().getFullYear() } })
            .then(res => setStats(res.data?.result ?? { total: 0, by_status: {}, monthly: [] }))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [year]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return { stats, loading, refresh: doFetch };
}
