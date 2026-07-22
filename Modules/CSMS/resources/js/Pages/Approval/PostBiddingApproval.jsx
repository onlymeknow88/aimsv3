import React from 'react';
import BiddingApproval from './BiddingApproval';
import useBidding from '../Bidding/Hooks/useBidding';
import CSMSLayout from '../../Layouts/CSMSLayout';
import StatusBadge from '../Bidding/Partials/Components/StatusBadge';
import TablePagination from '@/Components/TablePagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Search, RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useState } from 'react';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function PostBiddingApproval() {
    const { biddings, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh, submitApproval } = useBidding('PostBidding');
    const [modal, setModal]           = useState({ open: false, id: null, action: null, company: '' });
    const [processing, setProcessing] = useState(false);
    const [comment, setComment]       = useState('');

    const openModal = (id, action, company) => { setModal({ open: true, id, action, company }); setComment(''); };
    const confirmAction = () => {
        setProcessing(true);
        submitApproval(modal.id, modal.action, comment)
            .then(() => setModal({ open: false, id: null, action: null, company: '' }))
            .finally(() => setProcessing(false));
    };

    return (
        <CSMSLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Approval Post-Bidding CSMS</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Panel review persetujuan bertingkat untuk penerbitan sertifikat CSMS</p>
                </div>

                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari perusahaan..."
                                    style={{ height: '36px', padding: '0 12px 0 36px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', outline: 'none', width: '220px' }} />
                            </div>
                            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                                style={{ height: '36px', padding: '0 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', outline: 'none' }}>
                                <option value="">Semua Status</option>
                                <option value="On Review OHS">On Review OHS</option>
                                <option value="On Review D/H OHS">On Review D/H OHS</option>
                                <option value="On Review KTT">On Review KTT</option>
                            </select>
                        </div>
                        <button onClick={refresh} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex' }}>
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</div>
                    ) : biddings.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Tidak ada data post-bidding yang perlu disetujui.</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                        <TableHead style={thStyle}>No</TableHead>
                                        <TableHead style={thStyle}>Nama Perusahaan</TableHead>
                                        <TableHead style={thStyle}>No. Dokumen CSMS</TableHead>
                                        <TableHead style={thStyle}>Kriteria Layanan</TableHead>
                                        <TableHead style={thStyle}>Kategori Risiko</TableHead>
                                        <TableHead style={thStyle}>Status Review</TableHead>
                                        <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {biddings.map((b, i) => (
                                        <TableRow key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <TableCell style={tdStyle}>{i + 1}</TableCell>
                                            <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{b.company_name}</TableCell>
                                            <TableCell style={tdStyle}>{b.csms_doc_number ?? '-'}</TableCell>
                                            <TableCell style={tdStyle}>{b.service_criteria}</TableCell>
                                            <TableCell style={tdStyle}>{b.risk_category ?? '-'}</TableCell>
                                            <TableCell style={{ padding: '10px 12px' }}><StatusBadge status={b.status} /></TableCell>
                                            <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                    <a href={`/csms/post-bidding/detail/${b.id}`}
                                                        style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(21,59,115,0.08)', display: 'inline-flex', color: 'var(--primary)', textDecoration: 'none' }}
                                                        title="Detail">
                                                        <Eye size={13} />
                                                    </a>
                                                    {['On Review OHS','On Review D/H OHS','On Review KTT'].includes(b.status) && (
                                                        <>
                                                            <button onClick={() => openModal(b.id, 'approve', b.company_name)}
                                                                style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(47,191,113,0.1)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#2FBF71' }}
                                                                title="Setujui">
                                                                <CheckCircle size={13} />
                                                            </button>
                                                            <button onClick={() => openModal(b.id, 'reject', b.company_name)}
                                                                style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#ef4444' }}
                                                                title="Tolak">
                                                                <XCircle size={13} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
                </div>
            </div>

            {modal.open && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                {modal.action === 'approve' ? 'Setujui Post-Bidding' : 'Tolak Post-Bidding'}
                            </h4>
                            <button onClick={() => setModal({ open: false, id: null, action: null, company: '' })} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}>✕</button>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            {modal.action === 'approve'
                                ? `Konfirmasi persetujuan post-bidding ${modal.company}. Jika ini tahap KTT, sertifikat CSMS akan diterbitkan.`
                                : `Konfirmasi penolakan post-bidding ${modal.company}. Dokumen akan dikembalikan ke status Draft.`}
                        </p>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>Catatan (opsional)</label>
                            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                                style={{ width: '100%', padding: '10px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                                placeholder="Tambahkan catatan atau alasan..." />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={() => setModal({ open: false, id: null, action: null, company: '' })}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fff', cursor: 'pointer' }}>Batal</button>
                            <button onClick={confirmAction} disabled={processing}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: modal.action === 'approve' ? 'var(--success)' : '#ef4444', color: '#fff', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}>
                                {processing ? 'Memproses...' : modal.action === 'approve' ? 'Setujui' : 'Tolak'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CSMSLayout>
    );
}