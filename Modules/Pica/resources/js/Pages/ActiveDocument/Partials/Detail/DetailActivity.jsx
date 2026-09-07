import React, { useState } from 'react';
import axios from 'axios';
import { Clock, Send, Upload } from 'lucide-react';

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
};
const sectionTitle = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)', paddingBottom: '8px',
    marginBottom: '12px', textTransform: 'uppercase',
};

export default function DetailActivity({ doc, onRefresh }) {
    const [description, setDescription] = useState('');
    const [files, setFiles]             = useState([]);
    const [submitting, setSubmitting]   = useState(false);
    const [error, setError]             = useState(null);

    if (!doc) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return;
        setSubmitting(true);
        setError(null);
        const fd = new FormData();
        fd.append('description', description);
        files.forEach(f => fd.append('files[]', f));
        try {
            await axios.post(`/api/pica/documents/${doc.id}/activities`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDescription('');
            setFiles([]);
            onRefresh && onRefresh();
        } catch {
            setError('Gagal menyimpan aktivitas.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={card}>
            <h4 style={sectionTitle}>Timeline Aktivitas</h4>

            {/* Activity list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {(!doc.activities || doc.activities.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '11px' }}>Belum ada aktivitas.</div>
                ) : (
                    [...doc.activities].reverse().map(act => (
                        <div key={act.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '10px', fontSize: '11px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                                {act.user?.name ?? 'User'}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                <Clock size={9} />
                                {act.created_at ? new Date(act.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : ''}
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                                {act.description}
                            </p>
                            {act.files?.length > 0 && (
                                <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {act.files.map(f => (
                                        <a
                                            key={f.id}
                                            href={`/api/pica/activity-files/${f.id}/download`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '11px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                                        >
                                            {f.file ? f.file.split('/').pop() : f.id}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add activity form */}
            {!['Closed'].includes(doc.status) && (
                <form onSubmit={handleSubmit}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Tambah Aktivitas</p>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Tulis catatan tindak lanjut..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', minHeight: '72px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '8px' }}
                    />

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '8px' }}>
                        <Upload size={12} />
                        <span>Upload file lampiran</span>
                        <input type="file" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
                    </label>
                    {files.length > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            {files.map((f, i) => <div key={i}>{f.name}</div>)}
                        </div>
                    )}

                    {error && (
                        <div style={{ fontSize: '11px', color: 'var(--danger)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px', marginBottom: '8px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || !description.trim()}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: submitting || !description.trim() ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, width: '100%' }}
                    >
                        <Send size={12} />
                        {submitting ? 'Menyimpan...' : 'Kirim Aktivitas'}
                    </button>
                </form>
            )}
        </div>
    );
}