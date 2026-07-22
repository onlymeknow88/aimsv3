import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import TablePagination from '@/Components/TablePagination';

const STATUS_CONFIG = {
    'Open':               { color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review PICA':     { color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'On Review PJA':      { color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'On Review Approval': { color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'Overdue':            { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'   },
    'Closed':             { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)'   },
    'Draft':              { color: '#64748b',        bg: '#f1f5f9'               },
};

export default function PjaTable({
    documents = [],
    selectedIds = [],
    onSelectionChange,
    visibleColumns = {},
    loading = false,
    pagination = {},
    onPageChange,
    limit = 10,
    onLimitChange,
    onView,
}) {
    const allSelected = documents.length > 0 && selectedIds.length === documents.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            onSelectionChange([]);
        } else {
            onSelectionChange(documents.map(d => d.id));
        }
    };

    const toggleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    return (
        <div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '12px 16px', width: '40px', textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                            {visibleColumns['Tanggal'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Tanggal</th>}
                            {visibleColumns['Tipe'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Tipe</th>}
                            {visibleColumns['Company'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Company</th>}
                            {visibleColumns['Departemen'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Departemen</th>}
                            {visibleColumns['Pekerjaan'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Pekerjaan</th>}
                            {visibleColumns['Dibuat Oleh'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Dibuat Oleh</th>}
                            {visibleColumns['Status'] && <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>}
                            {visibleColumns['Aksi'] && <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-secondary)' }}>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Memuat data...
                                </td>
                            </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Belum ada data.
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc, idx) => {
                                const st = STATUS_CONFIG[doc.status] || { color: '#64748b', bg: '#f1f5f9' };
                                const isSelected = selectedIds.includes(doc.id);

                                return (
                                    <tr key={doc.id || idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isSelected ? 'rgba(21,59,115,0.03)' : 'transparent' }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelectOne(doc.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                        {visibleColumns['Tanggal'] && (
                                            <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>
                                                {doc.date ? new Date(doc.date).toLocaleDateString('id-ID') : '—'}
                                            </td>
                                        )}
                                        {visibleColumns['Tipe'] && (
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--primary)' }}>
                                                {doc.type}
                                            </td>
                                        )}
                                        {visibleColumns['Company'] && <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{doc.company_name || '—'}</td>}
                                        {visibleColumns['Departemen'] && <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{doc.department_name || '—'}</td>}
                                        {visibleColumns['Pekerjaan'] && <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{doc.job || '—'}</td>}
                                        {visibleColumns['Dibuat Oleh'] && <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{doc.created_by_name || '—'}</td>}
                                        {visibleColumns['Status'] && (
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ fontSize: '10px', fontWeight: 700, color: st.color, backgroundColor: st.bg, padding: '3px 8px', borderRadius: '10px' }}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns['Aksi'] && (
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => onView && onView(doc)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', fontSize: '11px', cursor: 'pointer' }}
                                                >
                                                    <Eye size={12} /> Detail
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                limit={limit}
                onLimitChange={onLimitChange}
            />
        </div>
    );
}
