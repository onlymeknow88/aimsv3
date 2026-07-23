import React, { useState } from 'react';
import axios from 'axios';
import { Send, Upload } from 'lucide-react';

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
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', height: 'fit-content' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px 0', textTransform: 'uppercase' }}>Timeline Aktivitas</p>

            {/* Activity list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {(!doc.activities || doc.activities.length === 0) ? (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>Belum ada aktivitas.</p>
                ) : (
                    [...doc.activities].reverse().map(act => (
                        <div key={act.id} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {act.user?.name ?? 'User'}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                    {new Date(act.created_at).toLocaleString('id-ID')}
                                </span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                                {act.description}
                            </p>
                            {act.files?.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

                    {error && <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '8px' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting || !description.trim()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', width: '100%', justifyContent: 'center' }}
                    >
                        <Send size={12} />
                        {submitting ? 'Menyimpan...' : 'Kirim Aktivitas'}
                    </button>
                </form>
            )}
        </div>
    );
}