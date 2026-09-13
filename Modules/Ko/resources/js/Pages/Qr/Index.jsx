import { Printer, QrCode, RefreshCw, Search, Upload, X } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import FileDropzone from '@/Components/FileDropzone';
import React, { useCallback, useEffect, useState } from 'react';
import KoLayout from '../../Layouts/KoLayout';
import TablePagination from '@/Components/TablePagination';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };

// Parity newaims Request QR: tab Request (Completed) + Verifikasi Koordinator
// + Approved/Print. Cetak memakai GET /api/ko/proposals/:id/qr-code.
const TABS = [
    { key: 'request', label: 'Request QR', status: 'Completed', temporary_qr_status: undefined },
    { key: 'verify', label: 'Verifikasi Koordinator', status: undefined, temporary_qr_status: 'Coordinator Verification' },
    { key: 'approved', label: 'Approved / Print', status: undefined, temporary_qr_status: 'Approved' },
];
export default function QrIndex() {
    const [tab, setTab] = useState(() => {
        const q = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') : null;
        return ['request', 'verify', 'approved'].includes(q) ? q : 'request';
    });
    const pickTab = (t) => {
        setTab(t); setPage(1);
        if (typeof window !== 'undefined') window.history.replaceState(null, '', `/ko/qr-requests?tab=${t}`);
    };
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [uploadFor, setUploadFor] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [requestFor, setRequestFor] = useState(null);
    const [validity, setValidity] = useState('');
    const [requesting, setRequesting] = useState(false);

    const doFetch = useCallback(() => {
        const cfg = TABS.find(t => t.key === tab) ?? TABS[0];
        setLoading(true);
        axios.get('/api/ko/proposals', { params: { search: search || undefined, status: cfg.status, temporary_qr_status: cfg.temporary_qr_status, limit, page } })
            .then(res => {
                const result = res.data?.result ?? {};
                setItems(result?.data ?? []);
                setPagination({ current_page: result?.current_page ?? 1, last_page: result?.last_page ?? 1, total: result?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, limit, page, tab]);

    useEffect(() => { doFetch(); }, [doFetch]);

    const openUpload = (proposal) => {
        setUploadFor(proposal);
        setFiles([]);
    };
    const closeUpload = () => {
        setUploadFor(null);
        setFiles([]);
    };
    const handleUpload = async () => {
        if (!uploadFor || !files.length) return;
        setUploading(true);
        try {
            const fd = new FormData();
            files.forEach(f => fd.append('files[]', f));
            await axios.post(`/api/ko/proposals/${uploadFor.id}/qr-files`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            closeUpload();
            doFetch();
        } catch {}
        finally { setUploading(false); }
    };

    const openRequest = (proposal) => {
        setRequestFor(proposal);
        setValidity(proposal.temporary_validity_period ? String(proposal.temporary_validity_period).slice(0, 10) : '');
    };
    const closeRequest = () => {
        setRequestFor(null);
        setValidity('');
    };
    const handleRequest = async () => {
        if (!requestFor || !validity) return;
        setRequesting(true);
        try {
            await axios.post(`/api/ko/proposals/${requestFor.id}/temporary-qr-request`, { temporary_validity_period: validity });
            closeRequest();
            doFetch();
        } catch {}
        finally { setRequesting(false); }
    };

    // Parity newaims CoordinatorVerification: approve / reject QR sementara.
    const handleVerifyQr = async (proposal, action) => {
        const note = action === 'return' ? (window.prompt('Catatan penolakan QR sementara:') ?? '') : undefined;
        if (action === 'return' && !String(note).trim()) return;
        try {
            await axios.post(`/api/ko/proposals/${proposal.id}/temporary-qr`, { action: action === 'approve' ? 'approve' : 'return', note });
            doFetch();
        } catch {}
    };

    // Parity newaims generateQR (PDF qr-export): cetak SVG + payload teks.
    const handlePrintQr = async (proposal) => {
        try {
            const res = await axios.get(`/api/ko/proposals/${proposal.id}/qr-code`);
            const { text = '', svg_base64 = '' } = res.data?.result ?? {};
            const esc = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const w = window.open('', '_blank');
            if (!w) return;
            w.document.write(`<html><head><title>QR ${proposal.number}</title></head><body style="font-family:monospace;text-align:center">`
                + `<h3>${proposal.number}</h3><img src="${svg_base64}" style="width:320px;height:320px" /><pre style="text-align:left;display:inline-block">${esc}</pre>`
                + `<script>window.onload=()=>window.print()</script></body></html>`);
            w.document.close();
        } catch {}
    };

    return (
        <KoLayout>
            <Head title="Request QR KO" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <QrCode size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Request QR</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>QR sementara: request, verifikasi koordinator, print</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => pickTab(t.key)}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: tab === t.key ? 'none' : '1px solid var(--border-color)', backgroundColor: tab === t.key ? 'var(--primary)' : '#fff', color: tab === t.key ? '#fff' : 'var(--text-secondary)' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nomor proposal..."
                        style={{ width: '260px', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={doFetch} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            <TableHead style={thStyle}>Number</TableHead>
                            <TableHead style={thStyle}>CCOW</TableHead>
                            <TableHead style={thStyle}>Area</TableHead>
                            <TableHead style={thStyle}>SPIP Desc</TableHead>
                            <TableHead style={thStyle}>Call Sign</TableHead>
                            <TableHead style={thStyle}>Status KO</TableHead>
                            <TableHead style={thStyle}>Status QR Sementara</TableHead>
                            <TableHead style={{ ...thStyle, textAlign: 'right' }}>{tab === 'verify' ? 'Verifikasi' : 'Berkas'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                        ) : !items.length ? (
                            <TableRow><TableCell colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada data pada tab ini.</TableCell></TableRow>
                        ) : (
                            items.map(p => (
                                <TableRow key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <TableCell style={{ ...tdStyle, fontWeight: 700 }}>
                                        <a href={`/ko/proposals/${p.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{p.number}</a>
                                    </TableCell>
                                    <TableCell style={tdStyle}>{p.ccow?.company_name ?? '-'}</TableCell>
                                    <TableCell style={tdStyle}>{p.area ?? '-'}</TableCell>
                                    <TableCell style={tdStyle}>{p.ko_unit?.ko_spip_unit?.name ?? '-'}</TableCell>
                                    <TableCell style={tdStyle}>{p.ko_unit?.call_sign ?? '-'}</TableCell>
                                    <TableCell style={tdStyle}>{p.status}</TableCell>
                                    <TableCell style={tdStyle}>{p.temporary_qr_status ?? '-'}</TableCell>
                                    <TableCell style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        {tab === 'verify' ? (
                                        <>
                                        <button onClick={() => handleVerifyQr(p, 'approve')} title="Approve QR sementara"
                                            style={{ background: '#16a34a', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                                            Approve
                                        </button>{' '}
                                        <button onClick={() => handleVerifyQr(p, 'return')} title="Reject QR sementara"
                                            style={{ background: '#fff', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: '#ef4444' }}>
                                            Reject
                                        </button>
                                        </>
                                        ) : (
                                        <>
                                        <button onClick={() => openUpload(p)} title="Upload berkas QR"
                                            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Upload size={12} /> Upload
                                        </button>{' '}
                                        {tab === 'request' ? (
                                        <button onClick={() => openRequest(p)} title="Request QR sementara"
                                            style={{ background: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                                            Request
                                        </button>
                                        ) : (
                                        <button onClick={() => handlePrintQr(p)} title="Print QR"
                                            style={{ background: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Printer size={12} /> Print
                                        </button>
                                        )}
                                        </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>

            {uploadFor && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Upload Berkas QR — {uploadFor.number}</h3>
                            <button onClick={closeUpload} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <FileDropzone onFileDrop={(dropped) => setFiles(prev => [...prev, ...dropped])} accept=".pdf,.png,.jpg,.jpeg" />
                            {files.length > 0 && (
                                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                    {files.map((f, i) => <div key={i}>{f.name}</div>)}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={closeUpload} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button onClick={handleUpload} disabled={uploading || !files.length}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: uploading || !files.length ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                                {uploading ? 'Mengupload...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {requestFor && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Request QR Sementara — {requestFor.number}</h3>
                            <button onClick={closeRequest} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Masa Berlaku Sementara *</label>
                            <input type="date" value={validity} onChange={e => setValidity(e.target.value)} style={{ width: '100%', maxWidth: '280px', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={closeRequest} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button onClick={handleRequest} disabled={requesting || !validity}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: requesting || !validity ? 'not-allowed' : 'pointer', opacity: requesting ? 0.7 : 1 }}>
                                {requesting ? 'Memproses...' : 'Kirim Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </KoLayout>
    );
}
