import React from 'react';

export default function ModuleTable({ taxonomy = [] }) {
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>Modul</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                        {['Index', 'Nama Modul', 'Jumlah Kategori'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {taxonomy.map(mod => (
                        <tr key={mod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{mod.index}</td>
                            <td style={{ padding: '14px 16px', fontWeight: 600 }}>{mod.name}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{mod.categories?.length || 0} kategori</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
