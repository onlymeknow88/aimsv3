import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import HazardRow from './Components/HazardRow';
import PpeSelector from './Components/PpeSelector';

const emptyStep = { step: '', hazard: '', control: '', ppe: [] };

export default function JsaFormModal({ open, onClose, onSubmit, loading }) {
    const [title, setTitle] = useState('');
    const [workType, setWorkType] = useState('');
    const [location, setLocation] = useState('');
    const [steps, setSteps] = useState([{ ...emptyStep }]);
    const [selectedPpe, setSelectedPpe] = useState([]);

    if (!open) return null;

    const addStep = () => setSteps(prev => [...prev, { ...emptyStep }]);
    const removeStep = (i) => setSteps(prev => prev.filter((_, idx) => idx !== i));
    const updateStep = (i, field, val) => setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, work_type: workType, location, steps, ppe: selectedPpe });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '90%', maxWidth: '720px', maxHeight: '90vh', overflow: 'auto', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Buat Job Safety Analysis</h3>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>JUDUL</label><input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                        <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>JENIS PEKERJAAN</label><input value={workType} onChange={e => setWorkType(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                        <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>LOKASI</label><input value={location} onChange={e => setLocation(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                    </div>

                    <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>ALAT PELINDUNG DIRI (APD)</label>
                        <PpeSelector selected={selectedPpe} onChange={setSelectedPpe} />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>MATRIKS LANGKAH KERJA & BAHAYA</label>
                            <button type="button" onClick={addStep} style={{ fontSize: '10px', fontWeight: 700, border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={12} /> Tambah Baris</button>
                        </div>
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border-color)' }}>
                                        {['Langkah Kerja', 'Potensi Bahaya', 'Pengendalian', 'APD', ''].map(h => (
                                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {steps.map((s, i) => (
                                        <HazardRow key={i} {...s} onChange={(f, v) => updateStep(i, f, v)} onDelete={() => removeStep(i)} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Menyimpan...' : 'Simpan JSA'}
                    </button>
                </form>
            </div>
        </div>
    );
}
