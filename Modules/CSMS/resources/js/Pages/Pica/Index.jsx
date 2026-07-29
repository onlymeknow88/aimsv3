import { AlertTriangle, RefreshCw, Search } from 'lucide-react';
import React, { useState } from 'react';

import CSMSLayout from '../../Layouts/CSMSLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

import usePica from './Hooks/usePica';
import PicaTable from './Partials/PicaTable';

const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: '#fff', border: '1px solid var(--border-color)',
    borderRadius: '6px', padding: '8px 12px', fontSize: '11px',
    fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
};

export default function PicaIndex() {
    const {
        picas, pagination, loading,
        search, setSearch,
        status, setStatus,
        limit, setLimit,
        page, setPage,
        refresh,
        updatePica,
    } = usePica();

    const [confirmPica, setConfirmPica] = useState(null);
    const [updating, setUpdating]       = useState(false);

    const handleCloseConfirm = (pica) => {
        setConfirmPica(pica);
    };

    const handleCloseSubmit = () => {
        if (!confirmPica) return;
        setUpdating(true);
        updatePica(confirmPica.id, { status: 'Closed' })
            .catch(() => {})
            .finally(() => {
                setUpdating(false);
                setConfirmPica(null);
            });
    };

    return (
        <CSMSLayout>
            <Head title="PICA CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                        PICA — Tindak Lanjut Temuan
                    </h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                    Monitoring tindakan perbaikan atas temuan CSMS
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari temuan atau perusahaan..."
                        style={{ width: '100%', paddingLeft: '36px', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                        value={status}
                        onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">Semua Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <button onClick={refresh} style={btnStyle}><RefreshCw size={14} /></button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <PicaTable picas={picas} loading={loading} onUpdate={handleCloseConfirm} />
                <TablePagination
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={v => { setLimit(v); setPage(1); }}
                />
            </div>

            <ConfirmationModal
                isOpen={!!confirmPica}
                type="generic"
                title="Tutup PICA?"
                description={`Tandai temuan "${confirmPica?.description ?? ''}" sebagai Closed. Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Tutup"
                cancelText="Batal"
                loading={updating}
                onConfirm={handleCloseSubmit}
                onCancel={() => setConfirmPica(null)}
            />
        </CSMSLayout>
    );
}
