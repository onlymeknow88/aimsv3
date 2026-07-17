import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useMaker() {
    const [loading, setLoading] = useState(false);

    // Master data lists from API
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [pjs, setPjs] = useState([]);
    const [modules, setModules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [mappings, setMappings] = useState([]);

    // Form States
    const [company, setCompany] = useState('');
    const [department, setDepartment] = useState('');
    const [pj, setPj] = useState('');
    const [module, setModule] = useState('');
    const [category, setCategory] = useState('');
    const [mapping, setMapping] = useState('');

    const [uploadType, setUploadType] = useState('');
    const [documentLevel, setDocumentLevel] = useState('');
    const [sopNumber, setSopNumber] = useState('');
    const [winNumber, setWinNumber] = useState('');
    const [formNumber, setFormNumber] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [invitedEmails, setInvitedEmails] = useState([]);
    const [files, setFiles] = useState([]);
    const [activeSops, setActiveSops] = useState([]);
    const [parentDocumentId, setParentDocumentId] = useState('');
    const [docCreated, setDocCreated] = useState(new Date().toISOString().split('T')[0]);

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
                setCategory('');
                setMapping('');
            });
        } else {
            setCategories([]);
        }
    }, [module]);

    // Cascade: Category -> Mappings
    useEffect(() => {
        if (category) {
            axios.get(`/api/document-system/mappings?category_id=${category}`).then(res => {
                const list = res.data?.result || [];
                const data = list.map(m => ({ id: m.id, name: m.index ? `${m.index}. ${m.name}` : m.name }));
                setMappings(data);
                setMapping('');
            });
        } else {
            setMappings([]);
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

    // Fetch autonumber suggestion whenever Company, Department, or Document Level changes
    useEffect(() => {
        if (company && department && documentLevel) {
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
    }, [company, department, documentLevel]);

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
            formData.append('status', statusType === 'draft' ? '1' : '2'); // 1 = Draft, 2 = Waiting Review

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

            await axios.post('/api/document-system/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            window.location.href = '/document-system/maker';
        } catch (err) {
            console.error('Submit document failed', err);
        } finally {
            setLoading(false);
        }
    }, [company, department, pj, module, category, mapping, uploadType, documentLevel, title, description, docCreated, sopNumber, winNumber, parentDocumentId, invitedEmails, files]);

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
