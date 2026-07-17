import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Calendar, FileText, ShieldAlert, UserCheck,
    Search, Bell, LogOut, ChevronDown, RefreshCw, Layers, CheckSquare,
    Menu, X, Landmark, HeartPulse, HardHat, ShieldCheck, Activity, LogIn
} from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [period, setPeriod] = useState('YTD 2026');

    const handleResetFilter = () => {
        setDepartment('');
        setLocation('');
        setPeriod('YTD 2026');
    };

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/', active: currentPath === '/' },
        { name: 'Calendar of Event (CoE)', icon: Calendar, href: '#', active: false },
        { name: 'Document System', icon: FileText, href: '/document-system', active: currentPath.startsWith('/document-system'), moduleSlug: 'document-system' },
        { name: 'Safety Accountability Program (SAP)', icon: ShieldAlert, href: '#', active: false, moduleSlug: 'sap' },
        { name: 'Field Leadership', icon: UserCheck, href: '#', active: false, moduleSlug: 'field-leadership' },
        { name: 'Inspection / KPLH', icon: Search, href: '#', active: false, moduleSlug: 'inspection' },
        { name: 'Audit', icon: ShieldCheck, href: '#', active: false, moduleSlug: 'audit' },
        { name: 'Management Risk (IBPR & Bowtie)', icon: ShieldAlert, href: '#', active: false, moduleSlug: 'management-risk' },
        { name: 'Compliance Regulation (KPP)', icon: Layers, href: '#', active: false, moduleSlug: 'compliance' },
        { name: 'Medical Check Up (MCU)', icon: HeartPulse, href: '#', active: false, moduleSlug: 'mcu' },
        { name: 'Contractor Safety Management (CSMS)', icon: Landmark, href: '#', active: false, moduleSlug: 'csms' },
        { name: 'Safety Operation (KO)', icon: HardHat, href: '#', active: false, moduleSlug: 'safety-operation' },
        { name: 'PICA', icon: CheckSquare, href: '#', active: false, moduleSlug: 'pica' },
    ];

    const allowedModules = auth?.modules || [];
    const visibleNavigationItems = navigationItems.filter(item => {
        if (!item.moduleSlug) return true;
        if (allowedModules.includes('*')) return true;
        return allowedModules.includes(item.moduleSlug);
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>

            {/* Sidebar Toggle Button for Mobile */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 999,
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)',
                    cursor: 'pointer'
                }}
                className="mobile-toggle"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* CSS Styling Override for Responsiveness */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .sidebar-container {
                        transform: translateX(${sidebarOpen ? '0' : '-280px'});
                        position: fixed !important;
                        z-index: 99;
                    }
                    .main-content-container {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                    .mobile-toggle {
                        display: flex !important;
                    }
                }
            `}} />

            {/* Sidebar Panel */}
            <div
                className="sidebar-container"
                style={{
                    width: '280px',
                    backgroundColor: 'var(--sidebar-bg)',
                    color: '#a9b9d0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    transition: 'transform 0.3s ease-in-out',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    overflowY: 'auto'
                }}
            >
                {/* Logo Area */}
                <div style={{
                    padding: '24px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        boxShadow: '0 4px 10px rgba(255, 140, 36, 0.3)'
                    }}>
                        ★
                    </div>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>AIMS</h1>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block', whiteSpace: 'nowrap' }}>Integrated Management System</span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none' }}>
                        {visibleNavigationItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <li key={index} style={{ marginBottom: '4px' }}>
                                    <a
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            fontSize: '11.5px',
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            color: item.active ? '#fff' : '#a3b1c6',
                                            backgroundColor: item.active ? 'var(--primary)' : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                        className={!item.active ? "hover-link" : ""}
                                    >
                                        <IconComponent size={16} style={{ color: item.active ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                                        {item.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .hover-link:hover {
                            background-color: rgba(255,255,255,0.03) !important;
                            color: #fff !important;
                        }
                    `}} />
                </div>

                {/* Filter Panel at Bottom of Sidebar */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: 'rgba(0,0,0,0.15)'
                }}>
                    <h4 style={{ color: '#fff', fontSize: '11px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter Tampilan</h4>

                    <div style={{ marginBottom: '10px', position: 'relative' }}>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '11px',
                                appearance: 'none',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="" style={{ background: '#10233f' }}>Semua Departemen</option>
                            <option value="ohs" style={{ background: '#10233f' }}>OHS (Safety)</option>
                            <option value="plant" style={{ background: '#10233f' }}>Plant Maintenance</option>
                            <option value="operation" style={{ background: '#10233f' }}>Mine Operation</option>
                        </select>
                        <ChevronDown size={12} style={{ position: 'absolute', right: '12px', top: '11px', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)' }} />
                    </div>

                    <div style={{ marginBottom: '10px', position: 'relative' }}>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '11px',
                                appearance: 'none',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="" style={{ background: '#10233f' }}>Semua Lokasi</option>
                            <option value="pit3" style={{ background: '#10233f' }}>Area Pit 3</option>
                            <option value="workshop" style={{ background: '#10233f' }}>Workshop Main</option>
                            <option value="port" style={{ background: '#10233f' }}>Port Facility</option>
                        </select>
                        <ChevronDown size={12} style={{ position: 'absolute', right: '12px', top: '11px', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)' }} />
                    </div>

                    <div style={{ marginBottom: '14px', position: 'relative' }}>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '11px',
                                appearance: 'none',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="YTD 2026" style={{ background: '#10233f' }}>YTD 2026</option>
                            <option value="2025" style={{ background: '#10233f' }}>Full Year 2025</option>
                        </select>
                        <ChevronDown size={12} style={{ position: 'absolute', right: '12px', top: '11px', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)' }} />
                    </div>

                    <button
                        onClick={handleResetFilter}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        <RefreshCw size={12} />
                        Reset Filter
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div
                className="main-content-container"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    transition: 'margin-left 0.3s ease'
                }}
            >
                {/* Header (Topbar) */}
                <header style={{
                    height: '70px',
                    backgroundColor: 'var(--card-bg)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Selamat Datang di AIMS</h2>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Aplikasi Integrated Management System</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Notifications */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
                            <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                backgroundColor: 'var(--danger)',
                                color: '#fff',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--card-bg)'
                            }}>
                                7
                            </span>
                        </div>                        {/* User Profile / Login Action */}
                        {auth?.user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary)',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        boxShadow: '0 2px 5px rgba(21, 59, 115, 0.2)'
                                    }}>
                                        {auth.user.name ? auth.user.name.substring(0, 2).toUpperCase() : 'US'}
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{auth.user.name}</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>{auth.user.email}</span>
                                    </div>
                                </div>
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'transparent',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: 'var(--danger)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <LogOut size={12} />
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                                <Link 
                                    href="/login" 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 18px',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--primary)',
                                        color: '#fff',
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 10px rgba(21, 59, 115, 0.2)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
                                >
                                    <LogIn size={14} />
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dashboard Content Container */}
                <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
