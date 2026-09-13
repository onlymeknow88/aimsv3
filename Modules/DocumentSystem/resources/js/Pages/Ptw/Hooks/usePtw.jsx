import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function usePtw() {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPtw, setSelectedPtw] = useState(null);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [exporting, setExporting] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [columnFilters, setColumnFilters] = useState({
        company: '',
        department: '',
        pic: '',
        title: '',
        document_number: '',
        detail_location: '',
        status: '',
        start_date: '',
        end_date: '',
        inactive_start: '',
        inactive_end: '',
    });

    const openForm = useCallback(() => setFormModalOpen(true), []);
    const closeForm = useCallback(() => setFormModalOpen(false), []);

    const openDrawer = useCallback((ptw) => { setSelectedPtw(ptw); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedPtw(null); }, []);

    const fetchDocuments = useCallback(() => {
        setFetching(true);
        axios.get('/api/document-system/ptw', {
            params: {
                search,
                page,
                limit,
                filter_company: columnFilters.company,
                filter_department: columnFilters.department,
                filter_pic: columnFilters.pic,
                filter_title: columnFilters.title,
                filter_document_number: columnFilters.document_number,
                filter_detail_location: columnFilters.detail_location,
                filter_status: columnFilters.status,
                filter_start_date: columnFilters.start_date,
                filter_end_date: columnFilters.end_date,
                filter_inactive_start: columnFilters.inactive_start,
                filter_inactive_end: columnFilters.inactive_end,
            }
        })
            .then(res => {
                setDocs(res.data?.result?.data || res.data?.result || []);
                if (res.data?.result?.current_page) {
                    setPagination({
                        current_page: res.data?.result?.current_page || 1,
                        last_page: res.data?.result?.last_page || 1,
                        total: res.data?.result?.total || 0,
                    });
                } else {
                    setPagination({
                        current_page: 1,
                        last_page: 1,
                        total: Array.isArray(res.data?.result) ? res.data?.result.length : 0,
                    });
                }
            })
            .catch(err => console.error("Error fetching PTW documents", err))
            .finally(() => setFetching(false));
    }, [search, page, limit, columnFilters]);

    // Reset page to 1 on search change
    useEffect(() => {
        setPage(1);
    }, [search]);

    // Reset page to 1 on limit change
    useEffect(() => {
        setPage(1);
    }, [limit]);

    // Reset page to 1 on columnFilters change
    useEffect(() => {
        setPage(1);
    }, [columnFilters]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const createPtw = useCallback(async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/document-system/ptw', data);
            closeForm();
            fetchDocuments();
        } catch (err) {
            console.error('Create PTW failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeForm, fetchDocuments]);

    const buildFilterParams = useCallback((ids = []) => ({
        ids: ids.join(','),
        search,
        filter_company: columnFilters.company,
        filter_department: columnFilters.department,
        filter_pic: columnFilters.pic,
        filter_title: columnFilters.title,
        filter_document_number: columnFilters.document_number,
        filter_detail_location: columnFilters.detail_location,
        filter_status: columnFilters.status,
        filter_start_date: columnFilters.start_date,
        filter_end_date: columnFilters.end_date,
        filter_inactive_start: columnFilters.inactive_start,
        filter_inactive_end: columnFilters.inactive_end,
    }), [search, columnFilters]);

    const exportPtw = useCallback(async (ids = []) => {
        setExporting(true);
        try {
            const response = await axios.get('/api/document-system/ptw/export', {
                params: buildFilterParams(ids),
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `PTW_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export PTW failed', err);
            alert('Gagal mengekspor PTW.');
        } finally {
            setExporting(false);
        }
    }, [buildFilterParams]);

    const bulkDeletePtw = useCallback(async (ids = []) => {
        if (ids.length === 0) return false;
        setBulkDeleting(true);
        try {
            await axios.post('/api/document-system/ptw/destroy', { ids });
            fetchDocuments();
            return true;
        } catch (err) {
            console.error('Bulk delete PTW failed', err);
            alert('Gagal menghapus PTW terpilih.');
            return false;
        } finally {
            setBulkDeleting(false);
        }
    }, [fetchDocuments]);

    return {
        formModalOpen, drawerOpen, selectedPtw, loading, docs, fetching,
        openForm, closeForm, openDrawer, closeDrawer, createPtw,
        exportPtw, exporting, bulkDeletePtw, bulkDeleting,
        search, setSearch, page, setPage, limit, setLimit, pagination, setPagination,
        columnFilters, setColumnFilters, fetchDocuments
    };
}
