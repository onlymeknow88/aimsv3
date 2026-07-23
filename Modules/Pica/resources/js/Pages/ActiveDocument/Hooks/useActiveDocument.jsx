import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/pica/documents';

const DEFAULT_PARAMS = {
    published: 'Publish',
    status: 'Open,On Review PJA,On Review CRS,Overdue,Closed',
};

export default function useActiveDocument() {
    const [documents, setDocuments]   = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);

    const [search, setSearch]               = useState('');
    const [status, setStatus]               = useState('');
    const [source, setSource]               = useState('');
    const [dateFrom, setDateFrom]           = useState('');
    const [dateTo, setDateTo]               = useState('');
    const [targetFrom, setTargetFrom]       = useState('');
    const [targetTo, setTargetTo]           = useState('');
    const [settlementFrom, setSettlementFrom] = useState('');
    const [settlementTo, setSettlementTo]   = useState('');
    const [limit, setLimit]                 = useState(10);
    const [page, setPage]                   = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        setError(null);
        axios.get(BASE_URL, {
            params: {
                ...DEFAULT_PARAMS,
                search:          search  || undefined,
                status:          status  || DEFAULT_PARAMS.status,
                source:          source  || undefined,
                date_from:       dateFrom || undefined,
                date_to:         dateTo   || undefined,
                target_from:     targetFrom || undefined,
                target_to:       targetTo   || undefined,
                settlement_from: settlementFrom || undefined,
                settlement_to:   settlementTo   || undefined,
                limit,
                page,
            },
        })
        .then(res => {
            const result = res.data?.result;
            setDocuments(result?.data ?? []);
            setPagination({
                current_page: result?.current_page ?? 1,
                last_page:    result?.last_page    ?? 1,
                total:        result?.total        ?? 0,
            });
        })
        .catch(() => setError('Gagal memuat data.'))
        .finally(() => setLoading(false));
    }, [search, status, source, dateFrom, dateTo, targetFrom, targetTo, settlementFrom, settlementTo, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return {
        documents, pagination, loading, error,
        search, setSearch,
        status, setStatus,
        source, setSource,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        targetFrom, setTargetFrom,
        targetTo, setTargetTo,
        settlementFrom, setSettlementFrom,
        settlementTo, setSettlementTo,
        limit, setLimit,
        page, setPage,
        refresh: doFetch,
    };
}