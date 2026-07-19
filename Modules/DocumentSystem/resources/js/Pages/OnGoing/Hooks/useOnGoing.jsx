import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useOnGoing() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [columnFilters, setColumnFilters] = useState({
        company: '',
        department: '',
        pic: '',
        module: '',
        category: '',
        document_level: '',
        mapping: '',
        document_number: '',
        title: '',
    });
    

    const fetchDocuments = useCallback(() => {
        setLoading(true);
        axios.get('/api/document-system/documents', {
            params: {
                status: '1,3,4,6',
                search,
                page,
                limit,
                filter_company: columnFilters.company,
                filter_department: columnFilters.department,
                filter_pic: columnFilters.pic,
                filter_module: columnFilters.module,
                filter_category: columnFilters.category,
                filter_document_level: columnFilters.document_level,
                filter_mapping: columnFilters.mapping,
                filter_document_number: columnFilters.document_number,
                filter_title: columnFilters.title,
            }
        })
            .then(res => {
                setDocs(res.data?.result?.data || []);
                setPagination({
                    current_page: res.data?.result?.current_page || 1,
                    last_page: res.data?.result?.last_page || 1,
                    total: res.data?.result?.total || 0,
                });
            })
            .catch(err => console.error("Error fetching ongoing documents", err))
            .finally(() => setLoading(false));
    }, [search, page, limit, columnFilters]);

    // Reset page to 1 on search change
    useEffect(() => {
        setPage(1);
    }, [search]);

    // Reset page to 1 on limit change
    useEffect(() => {
        setPage(1);
    }, [limit]);

     // reset page to 1 on columnFilters change
    useEffect(() => {
        setPage(1);
    }, [columnFilters]);


    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const openDrawer = useCallback((doc) => { setSelectedDoc(doc); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedDoc(null); }, []);

    return { 
        search,
        setSearch,
        docs,
        loading,
        selectedIds,
        setSelectedIds,
        drawerOpen, 
        selectedDoc, 
        openDrawer, 
        closeDrawer,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        fetchDocuments,
        columnFilters,
        setColumnFilters,
    };
}
