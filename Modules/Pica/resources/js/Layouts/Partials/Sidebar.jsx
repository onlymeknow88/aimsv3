import { AlertTriangle, ArrowLeft, ClipboardList, FileText, LayoutDashboard, RotateCcw, SearchCheck } from 'lucide-react';
import React from 'react';
import { usePage } from '@inertiajs/react';

const SLUG_URL = {
    'pica.dashboard':        '/pica/dashboard',
    'pica.active-document':  '/pica/active-document',
    'pica.draft':            '/pica/draft',
    'pica.return-document':  '/pica/return-document',
    'pica.review-crs':       '/pica/review-crs',
};

const SLUG_ICON = {
    'pica.dashboard':        LayoutDashboard,
    'pica.active-document':  ClipboardList,
    'pica.draft':            FileText,
    'pica.return-document':  RotateCcw,
    'pica.review-crs':       SearchCheck,
};

function isActivePath(slug, currentPath) {
    const url = SLUG_URL[slug];
    if (!url) return false;
    return currentPath === url || currentPath.startsWith(url + '/');
}

export default function Sidebar({ sidebarOpen, isMobile, currentPath }) {
    const { picaMenus = [] } = usePage().props;
    const menus = picaMenus.filter(m => !m.parent_id).sort((a, b) => a.order_by - b.order_by);

    return (
        <div style={{
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
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0 }}>PICA</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Problem Identification & CA</span>
                </div>
            </div>

            {/* Back to Home */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
                    <ArrowLeft size={12} /> Home AIMS
                </a>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, padding: '16px 8px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {menus.map(menu => {
                        const url    = SLUG_URL[menu.slug] ?? '#';
                        const active = isActivePath(menu.slug, currentPath);
                        const Icon   = SLUG_ICON[menu.slug] ?? null;
                        return (
                            <li key={menu.id} style={{ marginBottom: '4px' }}>
                                <a
                                    href={url}
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
                                        whiteSpace: 'nowrap',
                                    }}
                                    className={!active ? 'hover-link' : ''}
                                >
                                    {Icon && <Icon size={14} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />}
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
