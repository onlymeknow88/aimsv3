import React from 'react';
import {
    LayoutDashboard, ArrowLeft, ChevronDown, ChevronUp, Calendar, List, Database, Settings
} from 'lucide-react';

export default function Sidebar({
    sidebarOpen,
    currentPath,
    currentSearch,
    openMaster,
    setOpenMaster
}) {
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
                    {/* 1. Dashboard */}
                    <li style={{ marginBottom: '4px' }}>
                        <a
                            href="/coe"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                color: currentPath === '/coe' ? '#fff' : '#a3b1c6',
                                backgroundColor: currentPath === '/coe' ? 'var(--primary)' : 'transparent',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            className={currentPath !== '/coe' ? "hover-link" : ""}
                        >
                            <LayoutDashboard size={14} style={{ color: currentPath === '/coe' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                            Dashboard
                        </a>
                    </li>

                    {/* 2. Calendar */}
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

                    {/* 3. Event List */}
                    <li style={{ marginBottom: '4px' }}>
                        <a
                            href="/coe/list"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                color: currentPath === '/coe/list' ? '#fff' : '#a3b1c6',
                                backgroundColor: currentPath === '/coe/list' ? 'var(--primary)' : 'transparent',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            className={currentPath !== '/coe/list' ? "hover-link" : ""}
                        >
                            <List size={14} style={{ color: currentPath === '/coe/list' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                            Event List
                        </a>
                    </li>

                    {/* 4. Master Data Settings Dropdown */}
                    <li style={{ marginBottom: '4px' }}>
                        <button
                            onClick={() => setOpenMaster(!openMaster)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justify_content: 'space-between',
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
                                <Database size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <span>Master Data</span>
                            </div>
                            {openMaster ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {openMaster && (
                            <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                <li>
                                    <a
                                        href="/coe/categories"
                                        style={{
                                            display: 'block',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            color: currentPath === '/coe/categories' ? '#fff' : '#a3b1c6',
                                            textDecoration: 'none'
                                        }}
                                        className="hover-link"
                                    >
                                        Categories
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}
