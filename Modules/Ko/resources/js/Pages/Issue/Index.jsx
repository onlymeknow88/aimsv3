import { AlertTriangle, CheckCircle, Download, FileText, Paperclip, Plus, RefreshCw, Search, Send, Trash2, Undo2, Upload, X } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import KoLayout from '../../Layouts/KoLayout';
import TablePagination from '@/Components/TablePagination';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import useIssue from './Hooks/useIssue';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };
const miniBtn = { background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const labelSm = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };

const STATUSES = ['Open', 'Under Admin Verification', 'Under Coordinator Verification', 'Solved', 'Returned'];

const ACTIONS_BY_STATUS = {
    'Open': ['submit'],
    'Under Admin Verification': ['approve', 'return'],
    'Under Coordinator Verification': ['solve', 'return'],
    'Returned': ['submit'],
    'Solved': [],
};

const ACTION_CONFIG = {
    submit: {
        label: 'Submit',
        title: 'Submit Issue ke Verifikasi Admin',
        desc: 'Ajukan temuan issue ini untuk diverifikasi oleh Admin. Anda dapat melampirkan berkas bukti temuan atau foto unit.',
        btnColor: 'var(--primary)',
        icon: Send,
    },
    return: {
        label: 'Return',
        title: 'Kembalikan Issue (Return)',
        desc: 'Kembalikan temuan issue untuk diperbaiki atau dilengkapi dengan menyertakan alasan pengembalian.',
        btnColor: 'var(--danger, #ef4444)',
        icon: Undo2,
    },
    approve: {
        label: 'Approve',
        title: 'Approve Issue ke Koordinator',
        desc: 'Verifikasi dan setujui issue ini untuk diteruskan ke tahap Koordinator.',
        btnColor: 'var(--success, #2FBF71)',
        icon: CheckCircle,
    },
    solve: {
        label: 'Solve',
        title: 'Selesaikan Issue (Solve)',
        desc: 'Tandai temuan issue ini telah selesai ditindaklanjuti (Solved).',
        btnColor: 'var(--success, #2FBF71)',
        icon: CheckCircle,
    },
};

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' B';
}

export default function IssueIndex() {
    const { issues, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh, verify } = useIssue();
    const [acting, setActing] = useState(null);
    const [selected, setSelected] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ ko_unit_id: '', note: '', hazard_code: '' });
    const [units, setUnits] = useState([]);
    const [creating, setCreating] = useState(false);

    // Modal per-baris state (Submit / Return / Approve / Solve + upload file)
    const [actionModal, setActionModal] = useState({ open: false, issue: null, action: null });
    const [modalMessage, setModalMessage] = useState('');
    const [modalFiles, setModalFiles] = useState([]);
    const [modalSubmitting, setModalSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    // Modal Blob Preview State (parity FieldLeadership)
    const [previewFile, setPreviewFile] = useState(null);

    const handlePreview = (f) => {
        setPreviewFile({
            id: f.id,
            file_name: f.name || (f.attachment ? f.attachment.split('/').pop() : 'Lampiran'),
            name: f.name,
            type: 'ko_issue',
            path: f.attachment,
        });
    };

    const openActionModal = (issue, action) => {
        setActionModal({ open: true, issue, action });
        setModalMessage('');
        setModalFiles([]);
    };

    const closeActionModal = () => {
        setActionModal({ open: false, issue: null, action: null });
        setModalMessage('');
        setModalFiles([]);
        setModalSubmitting(false);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const added = Array.from(e.target.files);
            setModalFiles(prev => [...prev, ...added]);
            e.target.value = '';
        }
    };

    const removeModalFile = (index) => {
        setModalFiles(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleConfirmAction = async () => {
        if (!actionModal.issue || !actionModal.action) return;
        if (actionModal.action === 'return' && !modalMessage.trim()) return;

        setModalSubmitting(true);
        try {
            await verify(actionModal.issue.id, actionModal.action, modalMessage, modalFiles);
            setSelected(prev => prev.filter(x => x !== actionModal.issue.id));
            closeActionModal();
        } catch (err) {
            console.error('Gagal menjalankan aksi:', err);
        } finally {
            setModalSubmitting(false);
        }
    };

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        const eligible = issues.filter(i => i.status === 'Open').map(i => i.id);
        const allIn = eligible.length > 0 && eligible.every(id => selected.includes(id));
        setSelected(prev => allIn ? prev.filter(id => !eligible.includes(id)) : [...new Set([...prev, ...eligible])]);
    };

    const bulkSubmit = async () => {
        if (!selected.length) return;
        setActing('bulk');
        try {
            await Promise.all(selected.map(id => axios.post(`/api/ko/issues/${id}/verify`, { action: 'submit' })));
            setSelected([]);
            refresh();
        } catch {}
        finally { setActing(null); }
    };

    const openCreate = () => {
        setCreateForm({ ko_unit_id: '', note: '', hazard_code: '' });
        setShowCreate(true);
        axios.get('/api/ko/master-data').then(res => setUnits(res.data?.result?.units ?? [])).catch(() => {});
    };

    const handleCreate = () => {
        setCreating(true);
        axios.post('/api/ko/issues', createForm)
            .then(() => { setShowCreate(false); refresh(); })
            .finally(() => setCreating(false));
    };

    const handleExport = () => {
        const rows = [['Tanggal', 'Call Sign', 'Merk', 'Serial', 'Identity', 'Desc Temuan', 'Kode Bahaya', 'Status'],
            ...issues.map(i => [
                i.created_at ? new Date(i.created_at).toLocaleDateString('id-ID') : '',
                i.ko_unit?.call_sign ?? '', i.ko_unit?.ko_brand?.name ?? '',
                i.ko_unit?.serial_number ?? '', i.ko_unit?.identity_number ?? '',
                i.note ?? '', i.hazard_code ?? '', i.status ?? '',
            ])];
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `issue-report-ko-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const currentConfig = actionModal.action ? ACTION_CONFIG[actionModal.action] : null;

    return (
        <KoLayout>
            <Head title="Issue Report KO" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Berita Acara — Issue Report</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Temuan masalah unit & tindak lanjut</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari catatan..."
                            style={{ width: '260px', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <select value={status} onChange={e => { setStatus(e.target.value); setSelected([]); }} style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px' }}>
                        <option value="">Semua Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={handleExport} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><Download size={14} /> Export</button>
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}><Plus size={14} /> Add New</button>
                </div>
            </div>

            {selected.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '10px 16px', backgroundColor: 'rgba(21,59,115,0.06)', border: '1px solid rgba(21,59,115,0.15)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>{selected.length} issue dipilih</span>
                    <button onClick={bulkSubmit} disabled={acting === 'bulk'}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '7px 14px', fontSize: '11px', fontWeight: 700, color: '#fff', cursor: 'pointer', opacity: acting === 'bulk' ? 0.7 : 1 }}>
                        <Send size={12} /> Submit to Admin
                    </button>
                </div>
            )}

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            <TableHead style={{ ...thStyle, width: '36px' }}>
                                <input type="checkbox" checked={issues.some(i => i.status === 'Open') && issues.filter(i => i.status === 'Open').every(i => selected.includes(i.id))} onChange={toggleAll} />
                            </TableHead>
                            <TableHead style={thStyle}>Tanggal</TableHead>
                            <TableHead style={thStyle}>Call Sign</TableHead>
                            <TableHead style={thStyle}>Merk</TableHead>
                            <TableHead style={thStyle}>Serial Number</TableHead>
                            <TableHead style={thStyle}>Identity Number</TableHead>
                            <TableHead style={thStyle}>Desc Temuan</TableHead>
                            <TableHead style={thStyle}>Kode Bahaya</TableHead>
                            <TableHead style={thStyle}>Attachment</TableHead>
                            <TableHead style={thStyle}>Status</TableHead>
                            <TableHead style={{ ...thStyle, textAlign: 'right' }}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={11} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                        ) : !issues.length ? (
                            <TableRow><TableCell colSpan={11} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada issue.</TableCell></TableRow>
                        ) : (
                            issues.map(i => {
                                const actions = ACTIONS_BY_STATUS[i.status] ?? [];
                                return (
                                    <TableRow key={i.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <TableCell style={tdStyle}>
                                            {i.status === 'Open' && (
                                                <input type="checkbox" checked={selected.includes(i.id)} onChange={() => toggleSelect(i.id)} />
                                            )}
                                        </TableCell>
                                        <TableCell style={tdStyle}>{i.created_at ? new Date(i.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell style={{ ...tdStyle, fontWeight: 700, color: 'var(--text-primary)' }}>{i.ko_unit?.call_sign ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{i.ko_unit?.ko_brand?.name ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{i.ko_unit?.serial_number ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{i.ko_unit?.identity_number ?? '-'}</TableCell>
                                        <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{i.note ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>
                                            {i.hazard_code ? (
                                                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569' }}>
                                                    {i.hazard_code}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell style={{ ...tdStyle, whiteSpace: 'normal', minWidth: '130px' }}>
                                            {(i.attachments ?? []).length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                    {(i.attachments ?? []).map(f => (
                                                        <button
                                                            key={f.id}
                                                            type="button"
                                                            onClick={() => handlePreview(f)}
                                                            title={`Pratinjau ${f.name ?? 'Lampiran'}`}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                color: 'var(--primary)',
                                                                fontWeight: 600,
                                                                fontSize: '11px',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: '2px 4px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                textAlign: 'left',
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(21,59,115,0.08)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            <Paperclip size={11} style={{ flexShrink: 0 }} />
                                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                                                                {f.name ?? f.attachment?.split('/').pop() ?? 'Lampiran'}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                                            )}
                                        </TableCell>
                                        <TableCell style={tdStyle}>
                                            <span style={{
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                backgroundColor: i.status === 'Solved' ? 'rgba(47,191,113,0.1)' : i.status === 'Returned' ? 'rgba(239,68,68,0.1)' : 'rgba(255,140,36,0.1)',
                                                color: i.status === 'Solved' ? '#2FBF71' : i.status === 'Returned' ? '#ef4444' : '#FF8C24'
                                            }}>
                                                {i.status}
                                            </span>
                                            {i.status === 'Returned' && i.returned_message && (
                                                <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '4px', maxWidth: '140px', lineHeight: 1.2 }}>
                                                    Note: {i.returned_message}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            {actions.map(a => {
                                                const conf = ACTION_CONFIG[a];
                                                const Icon = conf?.icon ?? null;
                                                return (
                                                    <button
                                                        key={a}
                                                        onClick={() => openActionModal(i, a)}
                                                        disabled={modalSubmitting || acting === 'bulk'}
                                                        title={conf?.label ?? a}
                                                        style={{
                                                            ...miniBtn,
                                                            marginLeft: '4px',
                                                            color: a === 'return' ? 'var(--danger, #ef4444)' : a === 'submit' ? 'var(--primary)' : 'var(--success, #2FBF71)',
                                                            borderColor: a === 'return' ? 'rgba(239,68,68,0.2)' : a === 'submit' ? 'rgba(21,59,115,0.2)' : 'rgba(47,191,113,0.2)'
                                                        }}
                                                    >
                                                        {Icon && <Icon size={12} />}
                                                        {conf?.label ?? a}
                                                    </button>
                                                );
                                            })}
                                            {actions.length === 0 && <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>

            {/* Modal Per-Baris: Submit / Return / Approve / Solve + File Upload */}
            {actionModal.open && actionModal.issue && currentConfig && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {currentConfig.icon && <currentConfig.icon size={18} style={{ color: currentConfig.btnColor }} />}
                                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                                    {currentConfig.title}
                                </h3>
                            </div>
                            <button onClick={closeActionModal} disabled={modalSubmitting} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                {currentConfig.desc}
                            </p>

                            {/* Ringkasan Issue */}
                            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 14px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: '6px', fontSize: '12px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Call Sign:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{actionModal.issue.ko_unit?.call_sign ?? '-'}</span>

                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Merk / Serial:</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{actionModal.issue.ko_unit?.ko_brand?.name ?? '-'} ({actionModal.issue.ko_unit?.serial_number ?? '-'})</span>

                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Deskripsi Temuan:</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{actionModal.issue.note ?? '-'}</span>

                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Kode Bahaya:</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{actionModal.issue.hazard_code ?? '-'}</span>

                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Status Saat Ini:</span>
                                    <span>
                                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(255,140,36,0.1)', color: '#FF8C24' }}>
                                            {actionModal.issue.status}
                                        </span>
                                    </span>
                                </div>

                                {actionModal.issue.returned_message && (
                                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#b91c1c' }}>
                                        <strong>Catatan Pengembalian Sebelumnya:</strong> {actionModal.issue.returned_message}
                                    </div>
                                )}
                            </div>

                            {/* Input Alasan Return (Khusus aksi return) */}
                            {actionModal.action === 'return' && (
                                <div>
                                    <label style={labelSm}>
                                        Alasan Pengembalian <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        value={modalMessage}
                                        onChange={e => setModalMessage(e.target.value)}
                                        rows={3}
                                        placeholder="Tuliskan alasan pengembalian dan instruksi perbaikan..."
                                        style={{ ...inputSm, resize: 'vertical' }}
                                    />
                                    {!modalMessage.trim() && (
                                        <span style={{ fontSize: '10px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                                            * Alasan pengembalian wajib diisi.
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Area Upload File Lampiran */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ ...labelSm, margin: 0 }}>
                                        Lampiran Dokumen / Foto ({modalFiles.length} file)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        <Upload size={12} /> Pilih Berkas
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />

                                {/* Dropzone clickable area */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '1.5px dashed var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#fafafa',
                                        transition: 'background-color 0.2s',
                                    }}
                                >
                                    <Upload size={20} style={{ color: '#94a3b8', margin: '0 auto 6px' }} />
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                                        Klik untuk memilih berkas lampiran
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                                        Mendukung foto temuan (JPG, PNG) atau dokumen pendukung (PDF, maks 20MB)
                                    </p>
                                </div>

                                {/* Daftar Berkas yang Akan Diunggah */}
                                {modalFiles.length > 0 && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                                        {modalFiles.map((file, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '6px 10px',
                                                    backgroundColor: '#f1f5f9',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                                                    <FileText size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                                                        {file.name}
                                                    </span>
                                                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                                                        ({formatBytes(file.size)})
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeModalFile(idx); }}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                                    title="Hapus berkas"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Lampiran Lama yang Sudah Terpasang */}
                                {(actionModal.issue.attachments ?? []).length > 0 && (
                                    <div style={{ marginTop: '12px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                            Lampiran Tersimpan Sebelumnya:
                                        </span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {(actionModal.issue.attachments ?? []).map(att => (
                                                <button
                                                    key={att.id}
                                                    type="button"
                                                    onClick={() => handlePreview(att)}
                                                    title={`Pratinjau ${att.name ?? 'Lampiran'}`}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#e2e8f0',
                                                        border: 'none',
                                                        fontSize: '11px',
                                                        color: 'var(--text-primary)',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cbd5e1'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                                                >
                                                    <Paperclip size={11} />
                                                    {att.name ?? att.attachment?.split('/').pop() ?? 'Lampiran'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}>
                            <button
                                type="button"
                                onClick={closeActionModal}
                                disabled={modalSubmitting}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff', fontWeight: 600 }}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAction}
                                disabled={modalSubmitting || (actionModal.action === 'return' && !modalMessage.trim())}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 18px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    backgroundColor: currentConfig.btnColor,
                                    color: '#fff',
                                    cursor: modalSubmitting || (actionModal.action === 'return' && !modalMessage.trim()) ? 'not-allowed' : 'pointer',
                                    opacity: modalSubmitting || (actionModal.action === 'return' && !modalMessage.trim()) ? 0.6 : 1,
                                }}
                            >
                                {currentConfig.icon && <currentConfig.icon size={13} />}
                                {modalSubmitting ? 'Memproses...' : `Konfirmasi ${currentConfig.label}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah Issue Baru */}
            {showCreate && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Add New Issue</h3>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelSm}>Unit <span style={{ color: '#ef4444' }}>*</span></label>
                                <select value={createForm.ko_unit_id} onChange={e => setCreateForm(f => ({ ...f, ko_unit_id: e.target.value }))} style={inputSm}>
                                    <option value="">-- Pilih Unit --</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.call_sign} ({u.identity_number ?? '-'})</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelSm}>Desc Temuan <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea value={createForm.note} onChange={e => setCreateForm(f => ({ ...f, note: e.target.value }))} rows={3} placeholder="Jelaskan temuan..." style={{ ...inputSm, resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={labelSm}>Kode Bahaya</label>
                                <select value={createForm.hazard_code} onChange={e => setCreateForm(f => ({ ...f, hazard_code: e.target.value }))} style={inputSm}>
                                    <option value="">-- Pilih --</option>
                                    {['A', 'AA', 'B', 'C'].map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button disabled={creating || !createForm.ko_unit_id || !createForm.note.trim()} onClick={handleCreate}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}>
                                {creating ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Blob Preview */}
            {previewFile && (
                <BlobPreviewModal
                    attachment={previewFile}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </KoLayout>
    );
}
