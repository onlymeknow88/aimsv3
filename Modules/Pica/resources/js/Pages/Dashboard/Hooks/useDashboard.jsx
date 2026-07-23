import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useDashboard() {
    const [summary, setSummary] = useState(null);
    const [charts, setCharts]   = useState({});
    const [loading, setLoading] = useState(true);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/pica/dashboard-stats')
            .then(res => {
                const result = res.data?.result ?? {};
                setSummary(result.summary ?? null);
                setCharts(result.charts ?? {});
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { doFetch(); }, [doFetch]);

    return { summary, charts, loading, refresh: doFetch };
}