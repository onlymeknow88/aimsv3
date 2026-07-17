import React, { useState } from 'react';
import { X } from 'lucide-react';
import PermitTypeBadge from './Components/PermitTypeBadge';

const PERMIT_TYPES = ['Hot Work', 'Working at Height', 'Confined Space', 'Electrical', 'General'];

export default function PtwFormModal({ open, onClose, onSubmit, loading }) {
    const [title, setTitle] = useState('');
    const [permitType, setPermitType] = useState('General');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, permit_type: permitType, location, start_date: startDate, end_date: endDate });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '100%', maxWidth: '520px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Ajukan Permit to Work</h3>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>JUDUL</label><input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                    <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>JENIS IZIN</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {PERMIT_TYPES.map(t => (
                                <button key={t} type="button" onClick={() => setPermitType(t)} style={{ border: `1px solid ${permitType === t ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', backgroundColor: permitType === t ? 'rgba(0,80,198,0.06)' : '#fafbfc', fontSize: '10px', fontWeight: permitType === t ? 700 : 500, color: permitType === t ? 'var(--primary)' : 'var(--text-secondary)' }}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>LOKASI</label><input value={location} onChange={e => setLocation(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>TANGGAL MULAI</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                        <div><label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>TANGGAL SELESAI</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} /></div>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Menyimpan...' : 'Simpan PTW'}
                    </button>
                </form>
            </div>
        </div>
    );
}
