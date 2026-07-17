import React, { useState } from 'react';
import {
    LayoutDashboard, FileText, Clock, AlertCircle, Trash2,
    ShieldAlert, Activity, CheckSquare, Settings, Menu, X, ArrowLeft, ChevronDown, ChevronUp, FolderOpen, Database, HardHat, ClipboardCheck
} from 'lucide-react';

export default function DocumentSystemLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/document-system';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';

    // Dropdown collapse states
    const [openDocs, setOpenDocs] = useState(currentPath.includes('/draft') || currentPath.includes('/active') || currentPath.includes('/ongoing') || currentPath.includes('/obsolete') || currentPath.includes('/maker'));
    const [openJsa, setOpenJsa] = useState(currentPath.includes('/jsa'));
    const [openPtw, setOpenPtw] = useState(currentPath.includes('/ptw'));
    const [openMaster, setOpenMaster] = useState(currentPath.includes('/master'));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            {/* Sidebar */}
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
                    zIndex: 100
                }}
            >
                {/* Logo / Header Modul */}
                <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', whiteSpace: 'nowrap' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                        📄
                    </div>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, margin: 0 }}>Document System</h1>
                        <span style={{ fontSize: '9px', color: '#64748b', display: 'block' }}>Module Workspace</span>
                    </div>
                </div>

                {/* Kembali ke Dashboard Utama */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '11px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
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
                                href="/document-system"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    color: currentPath === '/document-system' ? '#fff' : '#a3b1c6',
                                    backgroundColor: currentPath === '/document-system' ? 'var(--primary)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                className={currentPath !== '/document-system' ? "hover-link" : ""}
                            >
                                <LayoutDashboard size={14} style={{ color: currentPath === '/document-system' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                                Dashboard
                            </a>
                        </li>

                        {/* 2. Dokumen Kebijakan Dropdown */}
                        <li style={{ marginBottom: '4px' }}>
                            <button
                                onClick={() => setOpenDocs(!openDocs)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
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
                                    <FolderOpen size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                    <span>Dokumen Kebijakan</span>
                                </div>
                                {openDocs ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>

                            {openDocs && (
                                <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                    <li><a href="/document-system/maker" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: currentPath === '/document-system/maker' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Active Document</a></li>
                                    <li><a href="/document-system/ongoing" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: currentPath === '/document-system/ongoing' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Document On Review</a></li>
                                    <li><a href="/document-system/obsolete" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: currentPath === '/document-system/obsolete' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Obsolete Document</a></li>
                                    <li><a href="/document-system/draft" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: currentPath === '/document-system/draft' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Draft</a></li>
                                </ul>
                            )}
                        </li>

                        {/* 3. Job Safety Analysis Dropdown */}
                        <li style={{ marginBottom: '4px' }}>
                            <button
                                onClick={() => setOpenJsa(!openJsa)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
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
                                    <HardHat size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                    <span>Job Safety Analysis (JSA)</span>
                                </div>
                                {openJsa ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>

                            {openJsa && (
                                <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                    <li><a href="/document-system/jsa" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: currentPath === '/document-system/jsa' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Active JSA</a></li>
                                </ul>
                            )}
                        </li>

                        {/* 4. Permit To Work Dropdown */}
                        <li style={{ marginBottom: '4px' }}>
                            <button
                                onClick={() => setOpenPtw(!openPtw)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
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
                                    <ClipboardCheck size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                    <span>Permit To Work (PTW)</span>
                                </div>
                                {openPtw ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>

                            {openPtw && (
                                <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                    <li><a href="/document-system/ptw" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: currentPath === '/document-system/ptw' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Active PTW</a></li>
                                </ul>
                            )}
                        </li>

                        {/* 5. Master Data Settings Dropdown */}
                        <li style={{ marginBottom: '4px' }}>
                            <button
                                onClick={() => setOpenMaster(!openMaster)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
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
                                    <li><a href="/document-system/master?tab=modules" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=modules')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Modules</a></li>
                                    <li><a href="/document-system/master?tab=categories" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=categories')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Categories</a></li>
                                    <li><a href="/document-system/master?tab=mappings" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=mappings')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Mappings</a></li>
                                    <li><a href="/document-system/master?tab=config" style={{ display: 'block', padding: '6px 12px', fontSize: '10.5px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=config')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Configuration</a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header Menu */}
                <header style={{ height: '60px', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContents: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 90 }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Welcome to Document System</span>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hover-link:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: #fff !important;
                }
            `}} />
        </div>
    );
}
