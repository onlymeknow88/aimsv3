import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function useUnit() {
    const [units, setUnits] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [master, setMaster] = useState({ categories: [], types: [], spipUnits: [], brands: [] });

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get('/api/ko/units', { params: { search: search || undefined, limit, page } })
            .then(res => {
                const result = res.data?.result ?? {};
                setUnits(result?.data ?? []);
                setPagination({ current_page: result?.current_page ?? 1, last_page: result?.last_page ?? 1, total: result?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);
    useEffect(() => {
        axios.get('/api/ko/master-data')
            .then(res => {
                const result = res.data?.result ?? {};
                setMaster({
                    categories: result.categories ?? [],
                    types: result.types ?? [],
                    spipUnits: result.spip_units ?? [],
                    brands: result.brands ?? [],
                });
            })
            .catch(() => {});
    }, []);

    return { units, pagination, loading, search, setSearch, limit, setLimit, page, setPage, refresh: doFetch, master };
}
