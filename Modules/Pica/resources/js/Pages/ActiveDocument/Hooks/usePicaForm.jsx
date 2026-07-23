import { useState, useEffect } from 'react';
import axios from 'axios';

const emptyForm = {
    source: '',
    source_id: '',
    type: '',
    date: '',
    ccow_id: '',
    company_id: '',
    section_id: '',
    location_id: '',
    location_detail: '',
    company_detail: '',
    pja_id: '',
    pjo_id: '',
    auditor: '',
    non_compliance: '',
    non_compliance_root_cause: '',
    corrective_action: '',
    target_settlement_date: '',
    remarks: '',
};

export default function usePicaForm(docId = null) {
    const [form, setFormState]         = useState(emptyForm);
    const [newFiles, setNewFiles]      = useState([]);
    const [existingFiles, setExisting] = useState([]);
    const [errors, setErrors]          = useState({});
    const [submitting, setSubmitting]  = useState(false);
    const [masterData, setMasterData]  = useState({ companies: [], sections: [], locations: [], users: [], managers: [] });
    const [loadingDoc, setLoadingDoc]  = useState(false);
    const [isLocked, setIsLocked]      = useState(false);

    // Load master data
    useEffect(() => {
        axios.get('/api/pica/master-data')
            .then(res => setMasterData(res.data?.result ?? {}))
            .catch(() => {});
    }, []);

    // Load existing document for Edit
    useEffect(() => {
        if (!docId) return;
        setLoadingDoc(true);
        axios.get(`/api/pica/documents/${docId}`)
            .then(res => {
                const doc = res.data?.result;
                if (!doc) return;
                if (doc.status !== 'Draft') {
                    setIsLocked(true);
                    return;
                }
                setFormState({
                    source:                    doc.source              ?? '',
                    source_id:                 doc.source_id           ?? '',
                    type:                      doc.type                ?? '',
                    date:                      doc.date                ?? '',
                    ccow_id:                   doc.ccow_id             ?? '',
                    company_id:                doc.company_id          ?? '',
                    section_id:                doc.section_id          ?? '',
                    location_id:               doc.location_id         ?? '',
                    location_detail:           doc.location_detail     ?? '',
                    company_detail:            doc.company_detail      ?? '',
                    pja_id:                    doc.pja_id              ?? '',
                    pjo_id:                    doc.pjo_id              ?? '',
                    auditor:                   doc.auditor             ?? '',
                    non_compliance:            doc.non_compliance      ?? '',
                    non_compliance_root_cause: doc.non_compliance_root_cause ?? '',
                    corrective_action:         doc.corrective_action   ?? '',
                    target_settlement_date:    doc.target_settlement_date ?? '',
                    remarks:                   doc.remarks             ?? '',
                });
                setExisting(doc.pica_files ?? []);
            })
            .catch(() => {})
            .finally(() => setLoadingDoc(false));
    }, [docId]);

    const setField = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: null }));
    };

    const addFiles = (files) => {
        setNewFiles(prev => [...prev, ...Array.from(files)]);
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingFile = (fileId) => {
        setExisting(prev => prev.filter(f => f.id !== fileId));
    };

    const validate = () => {
        const e = {};
        if (!form.source)                 e.source = 'Source wajib diisi.';
        if (!form.non_compliance)         e.non_compliance = 'Deskripsi non-compliance wajib diisi.';
        if (!form.corrective_action)      e.corrective_action = 'Corrective action wajib diisi.';
        if (!form.target_settlement_date) e.target_settlement_date = 'Target tanggal selesai wajib diisi.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        if (!validate()) return false;

        setSubmitting(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
        newFiles.forEach(f => fd.append('files[]', f));

        try {
            if (docId) {
                fd.append('_method', 'PUT');
                await axios.post(`/api/pica/documents/${docId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await axios.post('/api/pica/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            return true;
        } catch (err) {
            const serverErrors = err.response?.data?.errors ?? {};
            setErrors(serverErrors);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        form, setField,
        newFiles, addFiles, removeNewFile,
        existingFiles, removeExistingFile,
        errors, submitting, handleSubmit,
        masterData, loadingDoc, isLocked,
    };
}