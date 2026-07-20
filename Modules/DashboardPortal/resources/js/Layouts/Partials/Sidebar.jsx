import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    ChevronUp,
    Database,
    LayoutDashboard,
    List,
    Settings
} from 'lucide-react';

import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Sidebar({
    sidebarOpen,
    currentPath,
    currentSearch,
    openMaster,
    setOpenMaster
}) {
    const { auth } = usePage().props;
    const allowedModules = auth?.modules || [];
    const hasCoeAccess = auth?.user && (allowedModules.includes('*') || allowedModules.includes('calender-of-event-coe'));

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
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justify_content: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', flexShrink: 0, justifyContent: 'center' }}>
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

                    {hasCoeAccess && (
                        <>
                            {/* 1. Dashboard */}
                            <li style={{ marginBottom: '4px' }}>
                                <a
                                    href="/dashboard-portal"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: currentPath === '/dashboard-portal' ? '#fff' : '#a3b1c6',
                                        backgroundColor: currentPath === '/dashboard-portal' ? 'var(--primary)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    className={currentPath !== '/dashboard-portal' ? "hover-link" : ""}
                                >
                                    <LayoutDashboard size={14} style={{ color: currentPath === '/dashboard-portal' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                                    Dashboard
                                </a>
                            </li>
                            {/* 2. Slide Show */}
                            <li style={{ marginBottom: '4px' }}>
                                <a
                                    href="/dashboard-portal/slideshow"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: currentPath === '/dashboard-portal/list' ? '#fff' : '#a3b1c6',
                                        backgroundColor: currentPath === '/dashboard-portal/list' ? 'var(--primary)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    className={currentPath !== '/dashboard-portal/list' ? "hover-link" : ""}
                                >
                                    <List size={14} style={{ color: currentPath === '/dashboard-portal/list' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                                    SlideShow
                                </a>
                            </li>

                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
