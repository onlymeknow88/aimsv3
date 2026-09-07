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
    'fls.master.kategori':    '/field-leadership/master?tab=kategori',
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
        <nav
            id="fls-sidebar"
            aria-label="Navigasi Field Leadership"
            style={{
                width: sidebarOpen ? '250px' : '0px',
                minWidth: sidebarOpen ? '250px' : '0px',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-250px)',
                backgroundColor: 'var(--sidebar-bg, #0f172a)',
                color: 'var(--sidebar-text, #a9b9d0)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: isMobile ? 'fixed' : 'sticky',
                top: 0,
                left: 0,
                transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
                overflowX: 'hidden',
                overflowY: sidebarOpen ? 'auto' : 'hidden',
                zIndex: 100,
                flexShrink: 0
            }}
        >
            {/* Logo / Header Modul */}
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', whiteSpace: 'nowrap' }}>
                <div aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <HardHat size={20} />
                </div>
                <div>
                    <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>Field Leadership</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Module Workspace</span>
                </div>
            </div>

            {/* Kembali ke Dashboard Utama */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a href="/" aria-label="Kembali ke Home AIMS" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600, minHeight: '44px' }} className="fls-sidebar-link hover-link">
                    <ArrowLeft size={12} aria-hidden="true" />
                    Home AIMS
                </a>
            </div>

            {/* Navigasi dari aims_menus via Inertia shared prop */}
            <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {parentMenus.map(menu => {
                        const url        = SLUG_URL[menu.slug];
                        const active     = isActivePath(menu.slug, currentPath, currentSearch);
                        const dd         = dropdownState[menu.slug];
                        const isDropdown = hasChildren(menu.id) && dd;

                        if (isDropdown) {
                            return (
                                <li key={menu.id} style={{ marginBottom: '4px' }}>
                                    <button
                                        type="button"
                                        aria-expanded={dd.open}
                                        aria-controls={`fls-submenu-${menu.slug}`}
                                        onClick={() => dd.setOpen(!dd.open)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '12px 16px',
                                            minHeight: '44px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#a3b1c6',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease, color 0.2s ease',
                                            textAlign: 'left'
                                        }}
                                        className="fls-sidebar-link hover-link"
                                    >
                                        <span>{menu.name}</span>
                                        {dd.open ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                                    </button>
                                    {dd.open && (
                                        <ul id={`fls-submenu-${menu.slug}`} role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                            {childMenus(menu.id).map(child => {
                                                const childUrl    = SLUG_URL[child.slug] ?? '#';
                                                const childActive = isActivePath(child.slug, currentPath, currentSearch);
                                                return (
                                                    <li key={child.id}>
                                                        <a
                                                            href={childUrl}
                                                            aria-current={childActive ? 'page' : undefined}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '10px 12px',
                                                                minHeight: '44px',
                                                                lineHeight: '24px',
                                                                fontSize: '12px',
                                                                color: childActive ? '#fff' : '#a3b1c6',
                                                                textDecoration: 'none',
                                                                borderRadius: '6px'
                                                            }}
                                                            className="fls-sidebar-link hover-link"
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
                                    aria-current={active ? 'page' : undefined}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        minHeight: '44px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: active ? '#fff' : '#a3b1c6',
                                        backgroundColor: active ? 'var(--primary)' : 'transparent',
                                        transition: 'background-color 0.2s ease, color 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    className={active ? "" : "fls-sidebar-link hover-link"}
                                >
                                    {menu.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
