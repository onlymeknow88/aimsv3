import React from 'react';
import {
    LayoutDashboard, ArrowLeft, ChevronDown, ChevronUp, Calendar, List, Database
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

const SLUG_URL = {
    'calender-of-event-coe.calendar': '/coe/calendar',
    'calender-of-event-coe.dashboard': '/coe',
    'calender-of-event-coe.list': '/coe/list',
    'calender-of-event-coe.master': null,
    'calender-of-event-coe.categories': '/coe/categories',
};

const ICON_MAP = {
    'calender-of-event-coe.calendar': Calendar,
    'calender-of-event-coe.dashboard': LayoutDashboard,
    'calender-of-event-coe.list': List,
    'calender-of-event-coe.master': Database,
    'calender-of-event-coe.categories': List,
};

function isActivePath(slug, currentPath, currentSearch) {
    const url = SLUG_URL[slug];
    if (!url) return false;
    return currentPath === url;
}

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    isMobile,
    currentPath,
    currentSearch,
    openMaster,
    setOpenMaster
}) {
    const { auth, coeMenus = [] } = usePage().props;
    const allowedModules = auth?.modules || [];
    const hasCoeAccess = auth?.user && (allowedModules.includes('*') || allowedModules.includes('calender-of-event-coe'));

    const dropdownState = {
        'calender-of-event-coe.master': { open: openMaster, setOpen: setOpenMaster },
    };

    const parentMenus = coeMenus
        .filter(m => !m.parent_id && m.slug !== 'calender-of-event-coe.calendar')
        .sort((a, b) => a.order_by - b.order_by);

    const childMenus = (parentId) => coeMenus
        .filter(m => String(m.parent_id) === String(parentId))
        .sort((a, b) => a.order_by - b.order_by);

    const hasChildren = (id) => coeMenus.some(m => String(m.parent_id) === String(id));

    return (
        <nav
            id="coe-sidebar"
            aria-label="Navigasi CoE"
            style={{
                width: sidebarOpen ? '250px' : '0px',
                minWidth: sidebarOpen ? '250px' : '0px',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-250px)',
                backgroundColor: 'var(--sidebar-bg, #0f172a)',
                color: '#a9b9d0',
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
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', whiteSpace: 'nowrap' }}>
                <div aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Calendar size={18} />
                </div>
                <div>
                    <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>CoE Portal</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Center of Excellence</span>
                </div>
            </div>

            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a href="/" aria-label="Kembali ke Home AIMS" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600, minHeight: '44px' }} className="coe-sidebar-link">
                    <ArrowLeft size={12} aria-hidden="true" />
                    Home AIMS
                </a>
            </div>

            <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    <li style={{ marginBottom: '4px' }}>
                        <a
                            href="/coe/calendar"
                            aria-current={currentPath === '/coe/calendar' ? 'page' : undefined}
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
                                color: currentPath === '/coe/calendar' ? '#fff' : '#a3b1c6',
                                backgroundColor: currentPath === '/coe/calendar' ? 'var(--primary)' : 'transparent',
                                transition: 'background-color 0.2s ease, color 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            className={currentPath !== '/coe/calendar' ? "coe-sidebar-link" : ""}
                        >
                            <Calendar size={14} aria-hidden="true" style={{ color: currentPath === '/coe/calendar' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                            Event Calendar
                        </a>
                    </li>

                    {hasCoeAccess && parentMenus.map(menu => {
                        const url = SLUG_URL[menu.slug];
                        const active = isActivePath(menu.slug, currentPath, currentSearch);
                        const dd = dropdownState[menu.slug];
                        const isDropdown = hasChildren(menu.id) && dd;

                        if (isDropdown) {
                            const Icon = ICON_MAP[menu.slug] || Database;
                            return (
                                <li key={menu.id} style={{ marginBottom: '4px' }}>
                                    <button
                                        type="button"
                                        aria-expanded={dd.open}
                                        aria-controls={`coe-submenu-${menu.slug}`}
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
                                        className="coe-sidebar-link"
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Icon size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                                            {menu.name}
                                        </span>
                                        {dd.open ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                                    </button>
                                    {dd.open && (
                                        <ul id={`coe-submenu-${menu.slug}`} role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                            {childMenus(menu.id).map(child => {
                                                const childUrl = SLUG_URL[child.slug] ?? '#';
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
                                                            className="coe-sidebar-link"
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

                        const Icon = ICON_MAP[menu.slug] || LayoutDashboard;
                        return (
                            <li key={menu.id} style={{ marginBottom: '4px' }}>
                                <a
                                    href={url || '#'}
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
                                    className={!active ? "coe-sidebar-link" : ""}
                                >
                                    <Icon size={14} aria-hidden="true" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
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
