import React from 'react';

export default function CategoryTable({ taxonomy = [] }) {
    const categories = taxonomy.flatMap(mod => (mod.categories || []).map(cat => ({ ...cat, moduleName: mod.name })));

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>Category</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                        {['Index', 'Nama Kategori', 'Modul Induk', 'Jumlah Mapping'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{cat.index}</td>
                            <td style={{ padding: '14px 16px', fontWeight: 600 }}>{cat.name}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{cat.moduleName}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{cat.mappings?.length || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
