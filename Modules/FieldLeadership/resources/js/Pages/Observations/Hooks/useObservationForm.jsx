import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export const PTO_QUESTIONS = [
    { key: 'q1', text: 'Apakah risiko yang ada di area Anda yang dapat membahayakan nyawa Anda?',                          has_answer: true  },
    { key: 'q2', text: 'Apakah tersedia pengendalian penting tersedia untuk melindungi Anda?',                             has_answer: true  },
    { key: 'q3', text: 'Bagaimana Anda mengetahui pengendalian penting tersebut efektif?',                                 has_answer: false },
    { key: 'q4', text: 'Apakah semua langkah kerja di dalam SOP/INK/JSA telah berkesesuaian dengan pekerjaan yang dilakukan?', has_answer: true  },
    { key: 'q5', text: 'Pekerja memahami SOP/INK/JSA tersebut?',                                                          has_answer: true  },
    { key: 'q6', text: 'Apakah ada opportunity untuk proses SOP/INK/JSA yang lebih efisien, produktif dan aman?',         has_answer: true  },
];

function blankRisk(categories = [], isHazardReport = false) {
    return {
        description:  '',
        category_id:  isHazardReport ? (categories.find(c => c.name === 'Kondisi Tidak Aman')?.id ?? '') : '',
        type_id:      '',
        potency_id:   '',
        due_date:     '',
        repaired:     false,
        repair_action: '',
        type_action:  '',
        supervisor:   '',
        files:        [],   // File[] — lampiran temuan risiko
        filesCA:      [],   // File[] — lampiran tindakan perbaikan
    };
}

/**
 * useObservationForm
 *
 * Handles master data loading, form state, cascading dropdowns,
 * create (POST) and edit (PUT) submission for Field Leadership observations.
 *
 * @param {string|null} editId  - UUID of the observation to edit, or null for create
 */
export default function useObservationForm(editId = null) {
    const isEdit = !!editId;

    // ── Master data ───────────────────────────────────────────────────────────
    const [masterLoading, setMasterLoading] = useState(true);
    const [limitParam,      setLimitParam]      = useState(null);
    const [ccows,           setCcows]           = useState([]);
    const [companies,       setCompanies]       = useState([]);
    const [categories,      setCategories]      = useState([]);
    const [typeKtaTta,      setTypeKtaTta]      = useState([]);
    const [potencies,       setPotencies]       = useState([]);
    const [memberInternals, setMemberInternals] = useState([]);
    const [memberExternals, setMemberExternals] = useState([]);

    // ── Cascading dropdowns ───────────────────────────────────────────────────
    const [departmentsList,   setDepartmentsList]   = useState([]);
    const [sectionsList,      setSectionsList]      = useState([]);
    const [areaLocationsList, setAreaLocationsList] = useState([]);
    const [pjaList,           setPjaList]           = useState([]);

    // ── Form fields ───────────────────────────────────────────────────────────
    const [date,                  setDate]                  = useState(new Date().toISOString().split('T')[0]);
    const [ccowId,                setCcowId]                = useState('');
    const [companyId,             setCompanyId]             = useState('');
    const [detailCompany,         setDetailCompany]         = useState('');
    const [departmentId,          setDepartmentId]          = useState('');
    const [sectionId,             setSectionId]             = useState('');
    const [areaLocationId,        setAreaLocationId]        = useState('');
    const [detailLocation,        setDetailLocation]        = useState('');
    const [pjaId,                 setPjaId]                 = useState('');
    const [pjoId,                 setPjoId]                 = useState('');
    const [isAreaSuitable,        setIsAreaSuitable]        = useState(false);
    const [type,                  setType]                  = useState('Planned Task Observation');
    const [job,                   setJob]                   = useState('');
    const [visitTime,             setVisitTime]             = useState('');
    const [personilOnReview,      setPersonilOnReview]      = useState('');
    const [personilOnReviewName,  setPersonilOnReviewName]  = useState('');

    // ── PTO Answers ───────────────────────────────────────────────────────────
    const [answers, setAnswers] = useState(
        PTO_QUESTIONS.reduce((acc, q) => ({ ...acc, [q.key]: { question: q.text, answer: '', description: '' } }), {})
    );

    // ── Dynamic lists ─────────────────────────────────────────────────────────
    const [members, setMembers] = useState([{ type: '', employee_id: '' }]);
    const [positiveConditions, setPositiveConditions] = useState([{ description: '' }]);
    const [riskConditions, setRiskConditions] = useState([blankRisk()]);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [submitting, setSubmitting] = useState(false);
    const [errors,     setErrors]     = useState({});

    const isHazardReport = type === 'Hazard Report';
    const isPTO          = type === 'Planned Task Observation';

    const limitMember   = limitParam?.max_item_member              ?? 5;
    const maxPositive   = limitParam?.max_item_positive_condition  ?? 5;
    const maxRisk       = limitParam?.max_item_risk_condition      ?? 0;

    // ── 1. Load all master data on mount via single endpoint ─────────────────
    useEffect(() => {
        setMasterLoading(true);

        // master-data returns ccows, companies, categories, kta_tta, potencies,
        // employees_internal, employees_external, params, questions, types
        Promise.all([
            axios.get('/api/field-leadership/master-data').catch(() => ({ data: { result: {} } })),
            axios.get('/api/field-leadership/masters/limit-parameters').catch(() => ({ data: { result: null } })),
        ]).then(([md, lim]) => {
            const r = md.data?.result ?? {};
            setCcows(r.ccows                    ?? []);
            setCompanies(r.companies            ?? []);
            setCategories(r.categories          ?? []);
            setTypeKtaTta(r.kta_tta             ?? []);
            setPotencies(r.potencies            ?? []);
            setMemberInternals(r.employees_internal ?? []);
            setMemberExternals(r.employees_external ?? []);
            setLimitParam(lim.data?.result      ?? null);
        }).finally(() => setMasterLoading(false));
    }, []);

    // ── 2. Load existing observation for edit ─────────────────────────────────
    useEffect(() => {
        if (!isEdit) return;

        axios.get(`/api/field-leadership/observations/${editId}`)
            .then(res => {
                const d = res.data?.result;
                if (!d) return;

                const obs = d.observation;

                // Populate header fields
                setDate(obs.date ?? '');
                setCcowId(obs.ccow_id ?? '');
                setCompanyId(obs.company_id ?? '');
                setDetailCompany(obs.detail_company ?? '');
                setDepartmentId(obs.department_id ?? '');
                setSectionId(obs.section_id ?? '');
                setAreaLocationId(obs.area_location_id ?? '');
                setDetailLocation(obs.detail_location ?? '');
                setPjaId(obs.pja_id ?? '');
                setPjoId(obs.pjo_id ?? '');
                setIsAreaSuitable(!!obs.is_area_suitable);
                setType(obs.type ?? 'Planned Task Observation');
                setJob(obs.job ?? '');
                setVisitTime(obs.visit_time ? String(obs.visit_time) : '');
                setPersonilOnReview(obs.personil_on_review ? String(obs.personil_on_review) : '');
                setPersonilOnReviewName(obs.personil_on_review_name ?? '');

                // Members
                if (d.members?.length) {
                    setMembers(d.members.map(m => ({ type: m.type, employee_id: m.employee_id })));
                }

                // Positives
                if (d.positives?.length) {
                    setPositiveConditions(d.positives.map(p => ({ description: p.description })));
                }

                // PTO Questions
                if (d.question_ptos?.length) {
                    const newAnswers = { ...answers };
                    d.question_ptos.forEach((q, idx) => {
                        const key = PTO_QUESTIONS[idx]?.key;
                        if (key) {
                            newAnswers[key] = {
                                question:    PTO_QUESTIONS[idx].text,
                                answer:      q.answer ?? '',
                                description: q.description ?? '',
                            };
                        }
                    });
                    setAnswers(newAnswers);
                }

                // Risks
                if (d.risks?.length) {
                    setRiskConditions(d.risks.map(r => ({
                        description:   r.risk_condition ?? '',
                        category_id:   r.category_id   ?? '',
                        type_id:       r.type_id        ?? '',
                        potency_id:    r.potency_id     ?? '',
                        due_date:      r.due_date        ?? '',
                        repaired:      !!(r.repair_action),
                        repair_action: r.repair_action  ?? '',
                        type_action:   r.type_action    ?? '',
                        supervisor:    r.supervisor     ?? '',
                    })));
                }
            })
            .catch(err => console.error('Load edit data failed', err));
    }, [editId, isEdit]);

    // ── 3. Departments — no company_id FK, load all once ───────────────────
    useEffect(() => {
        axios.get('/api/field-leadership/masters/departments')
            .then(res => setDepartmentsList(res.data?.result ?? []))
            .catch(() => setDepartmentsList([]));
    }, []);

    // ── 4. Sections — filter by department ───────────────────────────────────
    useEffect(() => {
        if (!departmentId) { setSectionsList([]); setSectionId(''); return; }
        axios.get('/api/field-leadership/masters/sections', { params: { department_id: departmentId } })
            .then(res => setSectionsList(res.data?.result ?? []))
            .catch(() => setSectionsList([]));
    }, [departmentId]);

    // ── 5. Locations + PJA — filtered by section via pivot tables ──────────────
    useEffect(() => {
        const params = sectionId ? { section_id: sectionId } : {};
        if (!sectionId) {
            setAreaLocationsList([]);
            setAreaLocationId('');
            setPjaList([]);
            setPjaId('');
            return;
        }
        Promise.all([
            axios.get('/api/field-leadership/masters/locations', { params }),
            axios.get('/api/field-leadership/masters/pja',       { params }),
        ]).then(([loc, pja]) => {
            setAreaLocationsList(loc.data?.result ?? []);
            setPjaList(pja.data?.result ?? []);
        }).catch(() => {});
    }, [sectionId]);

    // Auto-fill detailCompany when companyId changes
    useEffect(() => {
        if (!companyId) { setDetailCompany(''); return; }
        const comp = companies.find(c => String(c.id) === String(companyId));
        if (comp) setDetailCompany(comp.company_name ?? comp.name ?? '');
    }, [companyId, companies]);

    // ── 4. Member helpers ─────────────────────────────────────────────────────
    const addMember = () => {
        if (!limitMember || members.length < limitMember) {
            setMembers(prev => [...prev, { type: '', employee_id: '' }]);
        }
    };
    const removeMember = (idx) => {
        if (members.length > 1) setMembers(prev => prev.filter((_, i) => i !== idx));
    };
    const updateMember = (idx, field, value) => {
        setMembers(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            if (field === 'type') next[idx].employee_id = '';
            return next;
        });
    };

    // ── 5. Positive condition helpers ─────────────────────────────────────────
    const addPositiveCondition = () => {
        if (!maxPositive || positiveConditions.length < maxPositive) {
            setPositiveConditions(prev => [...prev, { description: '' }]);
        }
    };
    const removePositiveCondition = (idx) => {
        if (positiveConditions.length > 1) setPositiveConditions(prev => prev.filter((_, i) => i !== idx));
    };
    const updatePositiveCondition = (idx, value) => {
        setPositiveConditions(prev => {
            const next = [...prev];
            next[idx] = { description: value };
            return next;
        });
    };

    // ── 6. Risk condition helpers ─────────────────────────────────────────────
    const addRiskCondition = () => {
        if (!maxRisk || riskConditions.length < maxRisk) {
            setRiskConditions(prev => [...prev, blankRisk(categories, isHazardReport)]);
        }
    };
    const removeRiskCondition = (idx) => {
        if (riskConditions.length > 1) setRiskConditions(prev => prev.filter((_, i) => i !== idx));
    };
    const updateRiskCondition = (idx, field, value) => {
        setRiskConditions(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            return next;
        });
    };

    // ── 7. Submit ─────────────────────────────────────────────────────────────
    /**
     * @param {'Draft'|'Publish'} submitType
     */
    const handleSubmit = useCallback(async (submitType) => {
        setSubmitting(true);
        setErrors({});

        // Build questions array (only for PTO)
        const formattedQuestions = isPTO
            ? PTO_QUESTIONS.map(q => ({
                question:    q.text,
                answer:      answers[q.key]?.answer      ?? '',
                description: answers[q.key]?.description ?? '',
            }))
            : [];

        const validMembers   = members.filter(m => m.type && m.employee_id);
        const validPositives = !isHazardReport ? positiveConditions.filter(p => p.description.trim()) : [];
        const kta_uta_id     = categories.find(c => c.name === 'Kondisi Tidak Aman')?.id ?? null;

        const validRisks = riskConditions.filter(r => r.description.trim()).map(r => ({
            description:   r.description,
            category_id:   isHazardReport ? kta_uta_id : (r.category_id || null),
            type_id:       r.type_id    || null,
            potency_id:    r.potency_id || null,
            due_date:      r.due_date,
            repaired:      r.repaired,
            repair_action: r.repaired ? (r.repair_action || '') : '',
            type_action:   r.repaired ? (r.type_action   || null) : null,
            supervisor:    r.repaired ? (r.supervisor    || null) : null,
        }));

        // Build FormData to support file uploads
        const form = new FormData();
        const append = (key, val) => { if (val !== null && val !== undefined) form.append(key, val); };

        append('date',                    date);
        append('ccow_id',                 ccowId           || '');
        append('company_id',              companyId        || '');
        append('detail_company',          detailCompany);
        append('department_id',           departmentId     || '');
        append('section_id',              sectionId        || '');
        append('area_location_id',        areaLocationId   || '');
        append('detail_location',         detailLocation   || '');
        append('pja_id',                  pjaId);
        append('pjo_id',                  pjoId            || '');
        append('type',                    type);
        append('job',                     job              || '');
        append('visit_time',              visitTime ? parseInt(visitTime, 10) : '');
        append('is_area_suitable',        isAreaSuitable ? '1' : '0');
        append('personil_on_review',      personilOnReview     ? parseInt(personilOnReview, 10) : '');
        append('personil_on_review_name', personilOnReviewName || '');
        append('publish',                 submitType === 'Draft' ? 'Draft' : 'Publish');

        // Members
        validMembers.forEach((m, i) => {
            form.append(`members[${i}][type]`,        m.type);
            form.append(`members[${i}][employee_id]`, m.employee_id);
        });

        // Positives
        validPositives.forEach((p, i) => {
            form.append(`positives[${i}][description]`, p.description);
        });

        // Questions (PTO)
        formattedQuestions.forEach((q, i) => {
            form.append(`questions[${i}][question]`,    q.question);
            form.append(`questions[${i}][answer]`,      q.answer);
            form.append(`questions[${i}][description]`, q.description);
        });

        // Risks + file attachments
        validRisks.forEach((r, i) => {
            form.append(`risks[${i}][description]`,   r.description);
            form.append(`risks[${i}][category_id]`,   r.category_id   || '');
            form.append(`risks[${i}][type_id]`,       r.type_id       || '');
            form.append(`risks[${i}][potency_id]`,    r.potency_id    || '');
            form.append(`risks[${i}][due_date]`,      r.due_date      || '');
            form.append(`risks[${i}][repaired]`,      r.repaired ? '1' : '0');
            form.append(`risks[${i}][repair_action]`, r.repair_action || '');
            form.append(`risks[${i}][type_action]`,   r.type_action   || '');
            form.append(`risks[${i}][supervisor]`,    r.supervisor    || '');
            // Lampiran temuan risiko
            const src = riskConditions.find((rc, ri) => ri === i);
            (src?.files  ?? []).forEach(f => form.append(`risks[${i}][files][]`,   f));
            (src?.filesCA ?? []).forEach(f => form.append(`risks[${i}][filesCA][]`, f));
        });

        const headers = { 'Content-Type': 'multipart/form-data' };

        try {
            if (isEdit) {
                await axios.post(`/api/field-leadership/observations/${editId}?_method=PUT`, form, { headers });
            } else {
                await axios.post('/api/field-leadership/observations', form, { headers });
            }
            router.visit('/field-leadership/observations');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data?.errors ?? {});
                // Scroll to top so user sees the errors
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
            }
        } finally {
            setSubmitting(false);
        }
    }, [
        isEdit, editId, isPTO, isHazardReport,
        date, ccowId, companyId, detailCompany, departmentId, sectionId,
        areaLocationId, detailLocation, pjaId, pjoId, isAreaSuitable, type,
        job, visitTime, personilOnReview, personilOnReviewName,
        answers, members, positiveConditions, riskConditions, categories,
    ]);

    return {
        // Meta
        isEdit,
        masterLoading,
        submitting,
        errors,

        // Master data
        limitParam,
        limitMember,
        maxPositive,
        maxRisk,
        ccows,
        companies,
        categories,
        typeKtaTta,
        potencies,
        memberInternals,
        memberExternals,

        // Cascading lists
        departmentsList,
        sectionsList,
        areaLocationsList,
        pjaList,

        // Form fields
        date,           setDate,
        ccowId,         setCcowId,
        companyId,      setCompanyId,
        detailCompany,  setDetailCompany,
        departmentId,   setDepartmentId,
        sectionId,      setSectionId,
        areaLocationId, setAreaLocationId,
        detailLocation, setDetailLocation,
        pjaId,          setPjaId,
        pjoId,          setPjoId,
        isAreaSuitable, setIsAreaSuitable,
        type,           setType,
        job,            setJob,
        visitTime,      setVisitTime,
        personilOnReview,     setPersonilOnReview,
        personilOnReviewName, setPersonilOnReviewName,

        // PTO
        isPTO,
        PTO_QUESTIONS,
        answers,        setAnswers,

        // Lists
        isHazardReport,
        members,
        positiveConditions,
        riskConditions,

        // Member actions
        addMember, removeMember, updateMember,

        // Positive actions
        addPositiveCondition, removePositiveCondition, updatePositiveCondition,

        // Risk actions
        addRiskCondition, removeRiskCondition, updateRiskCondition,

        // Submit
        handleSubmit,
    };
}
