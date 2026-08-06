import React, { useState } from 'react';
import {
    LayoutDashboard, ArrowLeft, ChevronDown, ChevronUp, Calendar, List, Database, Settings
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
    'calender-of-event-coe.calendar': <Calendar size={14} />,
    'calender-of-event-coe.dashboard': <LayoutDashboard size={14} />,
    'calender-of-event-coe.list': <List size={14} />,
    'calender-of-event-coe.master': <Database size={14} />,
    'calender-of-event-coe.categories': <List size={14} />,
};

function isActivePath(slug, currentPath, currentSearch) {
    const url = SLUG_URL[slug];
    if (!url) return false;
    return currentPath === url;
}

export default function Sidebar({
    sidebarOpen,
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

    // Filter parent menus (excluding Calendar as it is rendered statically at the top)
    const parentMenus = coeMenus
        .filter(m => !m.parent_id && m.slug !== 'calender-of-event-coe.calendar')
        .sort((a, b) => a.order_by - b.order_by);

    const childMenus = (parentId) => coeMenus
        .filter(m => String(m.parent_id) === String(parentId))
        .sort((a, b) => a.order_by - b.order_by);

    const hasChildren = (id) => coeMenus.some(m => String(m.parent_id) === String(id));

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
                position: 'sticky',
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
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                    📅
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>CoE Portal</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Center of Excellence</span>
                </div>
            </div>

            {/* Kembali ke Dashboard Utama */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
                    <ArrowLeft size={12} />
                    Home AIMS
                </a>
            </div>

            {/* Navigasi Modul */}
            <div style={{ flex: 1, padding: '16px 8px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {/* Statically render Event Calendar at the top */}
                    <li style={{ marginBottom: '4px' }}>
                        <a
                            href="/coe/calendar"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                color: currentPath === '/coe/calendar' ? '#fff' : '#a3b1c6',
                                backgroundColor: currentPath === '/coe/calendar' ? 'var(--primary)' : 'transparent',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            className={currentPath !== '/coe/calendar' ? "hover-link" : ""}
                        >
                            <Calendar size={14} style={{ color: currentPath === '/coe/calendar' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                            Event Calendar
                        </a>
                    </li>

                    {hasCoeAccess && parentMenus.map(menu => {
                        const url = SLUG_URL[menu.slug];
                        const active = isActivePath(menu.slug, currentPath, currentSearch);
                        const dd = dropdownState[menu.slug];
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                                                {ICON_MAP[menu.slug] || <Database size={14} />}
                                            </span>
                                            <span>{menu.name}</span>
                                        </div>
                                        {dd.open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                    {dd.open && (
                                        <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                            {childMenus(menu.id).map(child => {
                                                const childUrl = SLUG_URL[child.slug] ?? '#';
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
                                    href={url || '#'}
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
                                    className={!active ? "hover-link" : ""}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', color: active ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                                        {ICON_MAP[menu.slug] || <LayoutDashboard size={14} />}
                                    </span>
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
