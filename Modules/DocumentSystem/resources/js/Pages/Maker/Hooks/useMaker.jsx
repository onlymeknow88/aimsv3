import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export default function useMaker(document = null) {
    const [loading, setLoading] = useState(false);
    // Use a ref for tracking initial load to avoid stale closures and race conditions
    const isFirstLoad = useRef(true);
    const isCategoryFirstLoad = useRef(true);

    // Master data lists from API
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [pjs, setPjs] = useState([]);
    const [modules, setModules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [mappings, setMappings] = useState([]);

    // Form States
    const [company, setCompany] = useState(document?.company_id || '');
    const [department, setDepartment] = useState(document?.department_id || '');
    const [pj, setPj] = useState(document?.area_manager_id || '');
    const [module, setModule] = useState(document?.module_id || '');
    const [category, setCategory] = useState(document?.category_id || '');
    const [mapping, setMapping] = useState(document?.mapping_id || '');

    const [uploadType, setUploadType] = useState(document?.upload_type || '');
    const [documentLevel, setDocumentLevel] = useState(document?.document_level || '');
    const [sopNumber, setSopNumber] = useState(document?.sop_number || '');
    const [winNumber, setWinNumber] = useState(document?.sop_add_win || '');
    const [formNumber, setFormNumber] = useState('');
    const [title, setTitle] = useState(document?.title || '');
    const [description, setDescription] = useState(document?.description || '');
    const [invitedEmails, setInvitedEmails] = useState(
        document?.invited_people?.map(p => p.email) || 
        document?.people?.map(p => p.email) || 
        []
    );
    const [files, setFiles] = useState([]);
    const [activeSops, setActiveSops] = useState([]);
    const [parentDocumentId, setParentDocumentId] = useState(document?.parent_document || '');
    const [docCreated, setDocCreated] = useState(document?.doc_created ? document.doc_created.split('T')[0] : new Date().toISOString().split('T')[0]);

    // Fetch initial companies, departments, modules, and pjs (global fetch)
    useEffect(() => {
        axios.get('/api/document-system/companies').then(res => {
            const list = res.data?.result || [];
            const data = list.map(c => ({ id: c.id, name: c.company_name, code: c.document_code }));
            setCompanies(data);
        });
        axios.get('/api/document-system/departments').then(res => {
            const list = res.data?.result || [];
            const data = list.map(d => ({ id: d.id, name: d.name, document_code: d.document_code }));
            setDepartments(data);
        });
        axios.get('/api/document-system/modules').then(res => {
            const list = res.data?.result || [];
            const data = list.map(m => ({ id: m.id, name: m.index ? `${m.index}. ${m.name}` : m.name }));
            setModules(data);
        });
        axios.get('/api/document-system/pjs').then(res => {
            setPjs(res.data?.result || []);
        });
    }, []);

    // Cascade: Module -> Categories
    useEffect(() => {
        if (module) {
            axios.get(`/api/document-system/categories?module_id=${module}`).then(res => {
                const list = res.data?.result || [];
                const data = list.map(c => ({ id: c.id, name: c.index ? `${c.index}. ${c.name}` : c.name }));
                setCategories(data);
                // On first load when editing, restore the saved category; otherwise reset
                if (isFirstLoad.current && document?.category_id) {
                    setCategory(document.category_id);
                } else if (!isFirstLoad.current) {
                    setCategory('');
                    setMapping('');
                }
            });
        } else {
            setCategories([]);
            if (!isFirstLoad.current) {
                setCategory('');
                setMapping('');
            }
        }
    }, [module]);

    // Cascade: Category -> Mappings
    useEffect(() => {
        if (category) {
            axios.get(`/api/document-system/mappings?category_id=${category}`).then(res => {
                const list = res.data?.result || [];
                const data = list.map(m => ({ id: m.id, name: m.index ? `${m.index}. ${m.name}` : m.name }));
                setMappings(data);
                // On first load when editing, restore the saved mapping; otherwise reset
                if (isCategoryFirstLoad.current && document?.mapping_id) {
                    setMapping(document.mapping_id);
                } else if (!isCategoryFirstLoad.current) {
                    setMapping('');
                }
                // Mark first loads complete
                isFirstLoad.current = false;
                isCategoryFirstLoad.current = false;
            });
        } else {
            setMappings([]);
            // Mark first load complete even if no category (user cleared it)
            if (!isCategoryFirstLoad.current) {
                setMapping('');
            }
            isFirstLoad.current = false;
            isCategoryFirstLoad.current = false;
        }
    }, [category]);

    // Fetch active SOPs whenever company or department changes
    useEffect(() => {
        if (company && department) {
            axios.get(`/api/document-system/active-sops?company_id=${company}&department_id=${department}`).then(res => {
                setActiveSops(res.data?.result || []);
            });
        } else {
            setActiveSops([]);
        }
    }, [company, department]);

    // Fetch autonumber suggestion whenever Company, Department, or Document Level changes (only if creating a new one)
    useEffect(() => {
        if (!document && company && department && documentLevel) {
            axios.get(`/api/document-system/generate-number?company_id=${company}&department_id=${department}&level=${documentLevel}`)
                .then(res => {
                    const data = res.data?.result;
                    if (data && data.next_code) {
                        if (documentLevel === 'WIN') {
                            setWinNumber(data.next_code);
                            setSopNumber('');
                        } else {
                            setSopNumber(data.next_code);
                        }
                    }
                })
                .catch(err => console.error("Error generating next number", err));
        }
    }, [company, department, documentLevel, document]);

    const handleSave = useCallback(async (statusType) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('company_id', company);
            formData.append('department_id', department);
            formData.append('area_manager_id', pj);
            formData.append('module_id', module);
            formData.append('category_id', category);
            formData.append('mapping_id', mapping);
            formData.append('upload_type', uploadType);
            formData.append('document_level', documentLevel);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('doc_created', docCreated);
            formData.append('status', statusType === 'draft' ? '2' : '1'); // 2 = Draft, 1 = Waiting Review

            if (documentLevel === 'SOP') {
                formData.append('sop_number', sopNumber);
            } else if (documentLevel === 'WIN') {
                formData.append('sop_number', sopNumber);
                formData.append('sop_add_win', winNumber);
                formData.append('parent_document', parentDocumentId);
            }

            invitedEmails.forEach((email, index) => {
                formData.append(`invited_emails[${index}]`, email);
            });

            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const url = document?.id 
                ? `/api/document-system/documents/${document.id}` 
                : '/api/document-system/documents';

            await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            window.location.href = '/document-system/active';
        } catch (err) {
            console.error('Submit document failed', err);
        } finally {
            setLoading(false);
        }
    }, [company, department, pj, module, category, mapping, uploadType, documentLevel, title, description, docCreated, sopNumber, winNumber, parentDocumentId, invitedEmails, files, document]);

    return {
        loading,
        companies, departments, pjs, modules, categories, mappings, activeSops,
        company, setCompany,
        department, setDepartment,
        pj, setPj,
        module, setModule,
        category, setCategory,
        mapping, setMapping,
        uploadType, setUploadType,
        documentLevel, setDocumentLevel,
        sopNumber, setSopNumber,
        winNumber, setWinNumber,
        formNumber, setFormNumber,
        title, setTitle,
        description, setDescription,
        invitedEmails, setInvitedEmails,
        files, setFiles,
        parentDocumentId, setParentDocumentId,
        docCreated, setDocCreated,
        handleSave
    };
}
