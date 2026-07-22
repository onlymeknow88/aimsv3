import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSettings(serverParams = null) {
    const [form, setForm] = useState({
        max_item_member:             0,
        max_item_positive_condition: 0,
        max_item_risk_condition:     0,
        max_item_corrective_action:  0,
    });
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (serverParams) {
            setForm({
                max_item_member:             serverParams.max_item_member             ?? 0,
                max_item_positive_condition: serverParams.max_item_positive_condition ?? 0,
                max_item_risk_condition:     serverParams.max_item_risk_condition     ?? 0,
                max_item_corrective_action:  serverParams.max_item_corrective_action  ?? 0,
            });
            setFetching(false);
            return;
        }

        axios.get('/api/field-leadership/masters/limit-parameters')
            .then(res => {
                const p = res.data?.result || (Array.isArray(res.data) ? res.data[0] : res.data);
                if (p) {
                    setForm({
                        max_item_member:             p.max_member                     ?? p.max_item_member             ?? 0,
                        max_item_positive_condition: p.max_item_positive_condition   ?? 0,
                        max_item_risk_condition:     p.max_item_risk_condition       ?? 0,
                        max_item_corrective_action:  p.max_item_corrective_action    ?? 0,
                    });
                }
            })
            .catch(err => console.error('Fetch params failed', err))
            .finally(() => setFetching(false));
    }, [serverParams]);

    const setFieldValue = (field, val) => setForm(prev => ({ ...prev, [field]: Number(val) }));

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setSaved(false);
        setErrors({});

        try {
            await axios.put('/api/field-leadership/masters/limit-parameters', form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Save params failed', err);
            if (err.response?.status === 422) {
                setErrors(err.response.data?.errors || {});
            } else {
                alert('Gagal menyimpan parameter. Coba lagi.');
            }
        } finally {
            setSaving(false);
        }
    };

    return {
        form,
        setFieldValue,
        saving,
        fetching,
        saved,
        errors,
        handleSubmit,
    };
}
