import React from 'react';

export default function MappingTable({ taxonomy = [] }) {
    const mappings = taxonomy.flatMap(mod =>
        (mod.categories || []).flatMap(cat =>
            (cat.mappings || []).map(map => ({ ...map, categoryName: cat.name, moduleName: mod.name }))
        )
    );

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>Mapping</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                        {['Index', 'Nama Mapping', 'Kategori', 'Modul'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {mappings.map(map => (
                        <tr key={map.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{map.index}</td>
                            <td style={{ padding: '14px 16px', fontWeight: 600 }}>{map.name}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{map.categoryName}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{map.moduleName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
