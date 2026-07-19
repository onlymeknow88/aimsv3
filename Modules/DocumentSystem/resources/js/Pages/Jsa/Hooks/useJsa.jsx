import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useJsa(isObsolete = false, isDraft = false) {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJsa, setSelectedJsa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [columnFilters, setColumnFilters] = useState({
        company: '',
        department: '',
        pic: '',
        title: '',
        document_number: '',
        detail_location: '',
        status: '',
    });

    const openForm = useCallback(() => setFormModalOpen(true), []);
    const closeForm = useCallback(() => setFormModalOpen(false), []);

    const openDrawer = useCallback((jsa) => { setSelectedJsa(jsa); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedJsa(null); }, []);

    const fetchDocuments = useCallback(() => {
        setFetching(true);
        axios.get(`/api/document-system/jsa`, {
            params: {
                is_obsolete: isObsolete,
                is_draft: isDraft,
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
            .catch(err => console.error("Error fetching JSA documents", err))
            .finally(() => setFetching(false));
    }, [isObsolete, isDraft, search, page, limit, columnFilters]);

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

    const createJsa = useCallback(async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/document-system/jsa', data);
            closeForm();
            fetchDocuments();
        } catch (err) {
            console.error('Create JSA failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeForm, fetchDocuments]);

    const deleteJsa = useCallback(async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus dokumen JSA ini?')) return;
        try {
            await axios.delete(`/api/document-system/jsa/${id}`);
            fetchDocuments();
        } catch (err) {
            console.error('Delete JSA failed', err);
            alert('Gagal menghapus dokumen JSA.');
        }
    }, [fetchDocuments]);

    return {
        formModalOpen, drawerOpen, selectedJsa, loading, docs, fetching,
        openForm, closeForm, openDrawer, closeDrawer, createJsa, deleteJsa,
        search, setSearch, page, setPage, limit, setLimit, pagination, setPagination,
        columnFilters, setColumnFilters, fetchDocuments
    };
}
