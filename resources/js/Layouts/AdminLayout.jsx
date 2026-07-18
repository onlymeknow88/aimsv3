import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Users, ShieldAlert, Landmark, Layers, MapPin, 
    ArrowLeft, LogOut, ChevronDown, Menu, X, Settings, FolderOpen
} from 'lucide-react';

export default function AdminLayout({ children, title = "Backoffice Admin" }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userDropdown, setUserDropdown] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin/role-permissions';

    const mainMenuItems = [
        { name: 'Dashboard', icon: () => <span style={{ fontSize: '16px' }}>🏠</span>, href: '/admin/dashboard', active: currentPath === '/admin/dashboard' },
        { name: 'Business Entities', icon: () => <span style={{ fontSize: '16px' }}>🏬</span>, href: '/admin/business-entities', active: currentPath === '/admin/business-entities' },
        { name: 'Roles', icon: () => <span style={{ fontSize: '16px' }}>🛡️</span>, href: '/admin/role-permissions', active: currentPath.startsWith('/admin/role-permissions') },
        { name: 'Users & Employee', icon: () => <span style={{ fontSize: '16px' }}>👥</span>, href: '/admin/users', active: currentPath.startsWith('/admin/users') },
    ];

    const masterMenuItems = [
        { name: 'Companies', icon: () => <span style={{ fontSize: '16px' }}>🏛️</span>, href: '/admin/companies', active: currentPath.startsWith('/admin/companies') },
        { name: 'Departments', icon: () => <span style={{ fontSize: '16px' }}>🏢</span>, href: '/admin/departments', active: currentPath.startsWith('/admin/departments') },
        { name: 'Sections', icon: () => <span style={{ fontSize: '16px' }}>📁</span>, href: '/admin/sections', active: currentPath.startsWith('/admin/sections') },
    ];

    const systemMenuItems = [
        { name: 'AIMS Menu', icon: () => <FolderOpen size={16} />, href: '/admin/aims-menu', active: currentPath.startsWith('/admin/aims-menu') },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
            <Head title={title} />

            {/* Sidebar Admin Custom */}
            <div style={{
                width: sidebarOpen ? '260px' : '0px',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-260px)',
                backgroundColor: '#0a0a0c', // Gelap premium seperti di screenshot
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'sticky',
                top: 0,
                transition: 'all 0.3s ease-in-out',
                borderRight: '1px solid #1f2937',
                overflowX: 'hidden',
                zIndex: 100,
                flexShrink: 0
            }}>
                {/* Header Brand */}
                <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1f2937' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        ⚙️
                    </div>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: 0 }}>AIMS BACKOFFICE</h1>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Custom Management Console</span>
                    </div>
                </div>


                {/* Menu List */}
                <div style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
                    {/* Main Section */}
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '20px' }}>
                        {mainMenuItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <li key={idx} style={{ marginBottom: '6px' }}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            color: item.active ? '#3b82f6' : '#a1a1aa',
                                            backgroundColor: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                        className={!item.active ? 'nav-hover' : ''}
                                    >
                                        <Icon />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Master Data Section Header */}
                    <div style={{ paddingLeft: '16px', fontSize: '13px', fontWeight: 700, color: '#3b82f6', textTransform: 'none', margin: '20px 0 10px 0' }}>
                        Master Data
                    </div>

                    {/* Master Data Section List */}
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {masterMenuItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <li key={idx} style={{ marginBottom: '6px' }}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            color: item.active ? '#3b82f6' : '#a1a1aa',
                                            backgroundColor: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                        className={!item.active ? 'nav-hover' : ''}
                                    >
                                        <Icon />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* System Section Header */}
                    <div style={{ paddingLeft: '16px', fontSize: '13px', fontWeight: 700, color: '#3b82f6', textTransform: 'none', margin: '20px 0 10px 0' }}>
                        System
                    </div>

                    {/* System Section List */}
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {systemMenuItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <li key={idx} style={{ marginBottom: '6px' }}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            color: item.active ? '#3b82f6' : '#a1a1aa',
                                            backgroundColor: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                        className={!item.active ? 'nav-hover' : ''}
                                    >
                                        <Icon />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <style dangerouslySetInnerHTML={{__html: `
                        .nav-hover:hover {
                            background-color: rgba(255,255,255,0.03) !important;
                            color: #ffffff !important;
                        }
                    `}} />
                </div>
            </div>

            {/* Content Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Navbar Header */}
                <header style={{
                    height: '64px',
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
                    >
                        <Menu size={20} />
                    </button>

                    {/* User Panel */}
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setUserDropdown(!userDropdown)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#334155', fontWeight: 600, fontSize: '13px' }}
                        >
                            Administrator
                            <ChevronDown size={14} />
                        </button>
                        
                        {userDropdown && (
                            <div style={{ position: 'absolute', right: 0, marginTop: '8px', width: '160px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                <Link 
                                    href="/admin/logout" 
                                    method="post" 
                                    as="button"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                                >
                                    <LogOut size={14} />
                                    Keluar
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content Panel Area */}
                <main style={{ flex: 1, padding: '24px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
