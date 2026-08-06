import {
    ArrowLeft,
    BarChart2,
    Image,
    LayoutDashboard,
    Newspaper,
    Video,
} from 'lucide-react';

import React from 'react';
import { usePage } from '@inertiajs/react';

const SLUG_URL = {
    'dashboard-portal.dashboard': '/dashboard-portal/dashboard',
    'dashboard-portal.slideshow': '/dashboard-portal/slideshow',
    'dashboard-portal.banner': '/dashboard-portal/banner',
    'dashboard-portal.general': '/dashboard-portal/general',
    'dashboard-portal.news-and-update': '/dashboard-portal/news-and-update',
};

const ICON_MAP = {
    'dashboard-portal.dashboard': <LayoutDashboard size={14} />,
    'dashboard-portal.slideshow': <Video size={14} />,
    'dashboard-portal.banner': <Image size={14} />,
    'dashboard-portal.general': <BarChart2 size={14} />,
    'dashboard-portal.news-and-update': <Newspaper size={14} />,
};

export default function Sidebar({
    sidebarOpen,
    currentPath,
    currentSearch,
    openMaster,
    setOpenMaster
}) {
    const { auth, dpMenus = [] } = usePage().props;
    const allowedModules = auth?.modules || [];
    const hasDashboardAccess = auth?.user && (allowedModules.includes('*') || allowedModules.includes('dashboard-portal'));

    // Filter and sort parent menus
    const parentMenus = dpMenus
        .filter(m => !m.parent_id)
        .sort((a, b) => a.order_by - b.order_by);

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
                    🛡️
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>Dashboard Portal</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>AIMS v3 Admin Panel</span>
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
                    {hasDashboardAccess && parentMenus.map(menu => {
                        const url = SLUG_URL[menu.slug] || '#';
                        const isActive = currentPath === url || (url === '/dashboard-portal/dashboard' && currentPath === '/dashboard-portal');
                        const icon = ICON_MAP[menu.slug] || <LayoutDashboard size={14} />;

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
                                        color: isActive ? '#fff' : '#a3b1c6',
                                        backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    className={!isActive ? "hover-link" : ""}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                                        {icon}
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
