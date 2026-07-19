import React from 'react';
import { Eye, FilePlus2, Pencil, Trash2, ShieldCheck, Check, AlertCircle } from 'lucide-react';

const PERMISSION_COLS = [
    { field: 'can_view',     label: 'View',     icon: Eye,        color: '#6366f1' },
    { field: 'can_create',   label: 'Create',   icon: FilePlus2,  color: '#10b981' },
    { field: 'can_edit',     label: 'Edit',     icon: Pencil,     color: '#f59e0b' },
    { field: 'can_delete',   label: 'Delete',   icon: Trash2,     color: '#ef4444' },
    { field: 'can_approval', label: 'Approval', icon: ShieldCheck, color: '#8b5cf6' },
];

function PermCheckbox({ checked, changed, onChange }) {
    return (
        <button
            type="button"
            onClick={onChange}
            style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: checked ? 'none' : `1.5px solid ${changed ? '#f59e0b' : '#cbd5e1'}`,
                backgroundColor: checked
                    ? (changed ? '#f59e0b' : '#2563eb')
                    : (changed ? '#fffbeb' : '#f8fafc'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                margin: '0 auto',
                flexShrink: 0,
                outline: 'none',
            }}
            title={checked ? 'Diizinkan — klik untuk cabut' : 'Tidak diizinkan — klik untuk beri akses'}
        >
            {checked && <Check size={13} style={{ color: '#fff', strokeWidth: 3 }} />}
        </button>
    );
}

export default function RolePermissionTable({
    roles = [],
    menus = [],
    getPermValue,
    onToggle,
    onToggleRoleAll,
    changedKeys,
    onEditRole,
    onDeleteRole,
}) {
    const parentMenus = menus.filter(m => !m.parent_id);
    const childMenus = menus.filter(m => m.parent_id);
    const getChildren = (parentId) => childMenus.filter(c => c.parent_id === parentId);

    if (menus.length === 0 || roles.length === 0) {
        return (
            <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
                <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    {menus.length === 0 ? 'Belum ada menu di modul ini.' : 'Belum ada role di modul ini.'}
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Tambahkan menu melalui halaman AIMS Menu atau tambah role melalui tombol di atas.
                </p>
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: `${280 + roles.length * 5 * 52}px` }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th
                            rowSpan="2"
                            style={{
                                padding: '14px 20px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                width: '280px',
                                minWidth: '200px',
                                borderRight: '2px solid #e2e8f0',
                                verticalAlign: 'middle',
                            }}
                        >
                            Menu / Sub-Menu
                        </th>
                        {roles.map(role => (
                            <th
                                key={role.id}
                                colSpan={PERMISSION_COLS.length}
                                style={{
                                    padding: '12px 8px 6px',
                                    textAlign: 'center',
                                    borderRight: '1px solid #e2e8f0',
                                    borderBottom: '1px solid #e2e8f0',
                                    position: 'relative',
                                }}
                            >
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', padding: '0 48px' }}>
                                    {role.name}
                                </div>
                                <code style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>
                                    {role.slug}
                                </code>
                                <div style={{ marginTop: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => onToggleRoleAll(role.id)}
                                        style={{
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            color: '#2563eb',
                                            backgroundColor: '#eff6ff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '2px 8px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                                        title="Toggle semua permission untuk role ini"
                                    >
                                        Select All
                                    </button>
                                </div>

                                <div 
                                    className="role-actions" 
                                    style={{ 
                                        position: 'absolute', 
                                        top: '8px', 
                                        right: '8px', 
                                        display: 'flex', 
                                        gap: '2px',
                                        opacity: 0.7,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onEditRole(role)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#2563eb',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        title="Edit role ini"
                                    >
                                        <Pencil size={13} />
                                    </button>
                                    {!role.is_system && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteRole(role.id, role.name)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#ef4444',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="Hapus role ini"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>

                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {roles.map(role => (
                            <React.Fragment key={`sub-${role.id}`}>
                                {PERMISSION_COLS.map((col, ci) => {
                                    const Icon = col.icon;
                                    const isLast = ci === PERMISSION_COLS.length - 1;
                                    return (
                                        <th
                                            key={col.field}
                                            style={{
                                                padding: '6px 4px 10px',
                                                textAlign: 'center',
                                                width: '52px',
                                                borderRight: isLast ? '1px solid #e2e8f0' : 'none',
                                            }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                <Icon size={11} style={{ color: col.color }} />
                                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    {col.label}
                                                </span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {parentMenus.map((menu, mIdx) => {
                        const children = getChildren(menu.id);
                        const isEven = mIdx % 2 === 0;

                        return (
                            <React.Fragment key={menu.id}>
                                <tr style={{ backgroundColor: isEven ? '#fff' : '#fafcff', borderBottom: children.length > 0 ? 'none' : '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '13px 20px', borderRight: '2px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#153B73', flexShrink: 0 }} />
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{menu.name}</span>
                                        </div>
                                        <code style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '14px' }}>{menu.slug}</code>
                                    </td>

                                    {roles.map(role => (
                                        <React.Fragment key={`${menu.id}-${role.id}`}>
                                            {PERMISSION_COLS.map((col, ci) => {
                                                const isLast = ci === PERMISSION_COLS.length - 1;
                                                const key = `${role.id}::${menu.id}::${col.field}`;
                                                const val = getPermValue(role.id, menu.id, col.field);
                                                const changed = changedKeys.has(key);
                                                return (
                                                    <td key={col.field} style={{ padding: '10px 4px', textAlign: 'center', borderRight: isLast ? '1px solid #e2e8f0' : 'none' }}>
                                                        <PermCheckbox
                                                            checked={val}
                                                            changed={changed}
                                                            onChange={() => onToggle(role.id, menu.id, col.field)}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tr>

                                {children.map((child, cIdx) => (
                                    <tr
                                        key={child.id}
                                        style={{
                                            backgroundColor: isEven ? '#f8fafc' : '#f5f8fe',
                                            borderBottom: cIdx === children.length - 1 ? '1px solid #f1f5f9' : '1px solid #f0f4f8',
                                        }}
                                    >
                                        <td style={{ padding: '10px 20px', borderRight: '2px solid #e2e8f0', paddingLeft: '40px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: '#cbd5e1', fontSize: '11px' }}>└</span>
                                                <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#475569' }}>{child.name}</span>
                                            </div>
                                            <code style={{ fontSize: '10px', color: '#cbd5e1', marginLeft: '18px' }}>{child.slug}</code>
                                        </td>

                                        {roles.map(role => (
                                            <React.Fragment key={`${child.id}-${role.id}`}>
                                                {PERMISSION_COLS.map((col, ci) => {
                                                    const isLast = ci === PERMISSION_COLS.length - 1;
                                                    const key = `${role.id}::${child.id}::${col.field}`;
                                                    const val = getPermValue(role.id, child.id, col.field);
                                                    const changed = changedKeys.has(key);
                                                    return (
                                                        <td key={col.field} style={{ padding: '8px 4px', textAlign: 'center', borderRight: isLast ? '1px solid #e2e8f0' : 'none' }}>
                                                            <PermCheckbox
                                                                checked={val}
                                                                changed={changed}
                                                                onChange={() => onToggle(role.id, child.id, col.field)}
                                                            />
                                                        </td>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
