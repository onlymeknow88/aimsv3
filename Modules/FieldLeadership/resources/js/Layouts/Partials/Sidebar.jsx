import { ArrowLeft, ChevronDown, ChevronUp, HardHat } from 'lucide-react';

import React from 'react';
import { usePage } from '@inertiajs/react';

const SLUG_URL = {
    'fls.dashboard':                     '/field-leadership/dashboard',
    'fls.field-leadership':               '/field-leadership',
    'fls.pja':                           null,
    'fls.pja.request-review':            '/field-leadership/pja/request-review',
    'fls.pja.draft':                     '/field-leadership/pja/draft',
    'fls.approval-pja':                  '/field-leadership/approval-pja',
    'fls.master':                        '/field-leadership/master',
    'fls.master.limit-parameter':        '/field-leadership/master?tab=limit-parameter',
    'fls.master.jenis-kta-tta':          '/field-leadership/master?tab=jenis-kta-tta',
    'fls.master.potensi-konsekuensi':    '/field-leadership/master?tab=potensi-konsekuensi',
};

function isActivePath(slug, currentPath, currentSearch) {
    const url = SLUG_URL[slug];
    if (!url) return false;
    if (slug === 'fls.dashboard') return currentPath === '/field-leadership/dashboard';
    if (url.includes('?')) {
        return `${currentPath}${currentSearch}` === url;
    }
    return currentPath === url;
}

export default function Sidebar({
    sidebarOpen,
    isMobile,
    currentPath,
    currentSearch,
    openObservation,
    setOpenObservation,
    openRisk,
    setOpenRisk,
    openMaster,
    setOpenMaster,
}) {
    const { flsMenus = [] } = usePage().props;

    const dropdownState = {
        'fls.pja':    { open: openRisk,   setOpen: setOpenRisk },
        'fls.master': { open: openMaster, setOpen: setOpenMaster },
    };

    const parentMenus = flsMenus
        .filter(m => !m.parent_id)
        .sort((a, b) => a.order_by - b.order_by);

    const childMenus = (parentId) => flsMenus
        .filter(m => String(m.parent_id) === String(parentId))
        .sort((a, b) => a.order_by - b.order_by);

    const hasChildren = (id) => flsMenus.some(m => String(m.parent_id) === String(id));

    return (
        <div
            style={{
                width: sidebarOpen ? '250px' : '0px',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-250px)',
                backgroundColor: 'var(--sidebar-bg)',
                color: '#a9b9d0',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: isMobile ? 'fixed' : 'sticky',
                top: 0,
                left: 0,
                transition: 'all 0.3s ease-in-out',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                overflowX: 'hidden',
                overflowY: 'auto',
                zIndex: 100,
                flexShrink: 0
            }}
        >
            {/* Logo / Header Modul */}
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <HardHat size={20} />
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>Field Leadership</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Module Workspace</span>
                </div>
            </div>

            {/* Kembali ke Dashboard Utama */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
                    <ArrowLeft size={12} />
                    Home AIMS
                </a>
            </div>

            {/* Navigasi dari aims_menus via Inertia shared prop */}
            <div style={{ flex: 1, padding: '16px 8px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {parentMenus.map(menu => {
                        const url        = SLUG_URL[menu.slug];
                        const active     = isActivePath(menu.slug, currentPath, currentSearch);
                        const dd         = dropdownState[menu.slug];
                        const isDropdown = hasChildren(menu.id) && dd;

                        if (isDropdown) {
                            return (
                                <li key={menu.id} style={{ marginBottom: '4px' }}>
                                    <button
                                        onClick={() => dd.setOpen(!dd.open)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#a3b1c6',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left'
                                        }}
                                        className="hover-link"
                                    >
                                        <span>{menu.name}</span>
                                        {dd.open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                    {dd.open && (
                                        <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                            {childMenus(menu.id).map(child => {
                                                const childUrl    = SLUG_URL[child.slug] ?? '#';
                                                const childActive = isActivePath(child.slug, currentPath, currentSearch);
                                                return (
                                                    <li key={child.id}>
                                                        <a
                                                            href={childUrl}
                                                            style={{
                                                                display: 'block',
                                                                padding: '6px 12px',
                                                                fontSize: '12px',
                                                                color: childActive ? '#fff' : '#a3b1c6',
                                                                textDecoration: 'none'
                                                            }}
                                                            className="hover-link"
                                                        >
                                                            {child.name}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        }

                        return (
                            <li key={menu.id} style={{ marginBottom: '4px' }}>
                                <a
                                    href={url ?? '#'}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: active ? '#fff' : '#a3b1c6',
                                        backgroundColor: active ? 'var(--primary)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    className={!active ? 'hover-link' : ''}
                                >
                                    {menu.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
