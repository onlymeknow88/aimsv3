import React from 'react';
import {
    LayoutDashboard, ArrowLeft, ChevronDown, ChevronUp, FolderOpen, Database, HardHat, ClipboardCheck
} from 'lucide-react';

export default function Sidebar({
    sidebarOpen,
    currentPath,
    currentSearch,
    openDocs,
    setOpenDocs,
    openJsa,
    setOpenJsa,
    openPtw,
    setOpenPtw,
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
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                    📄
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>Document System</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Module Workspace</span>
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
                            href="/document-system"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
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
                                <FolderOpen size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <span>Dokumen Kebijakan</span>
                            </div>
                            {openDocs ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {openDocs && (
                            <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                <li><a href="/document-system/active" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath === '/document-system/active' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Active Document</a></li>
                                <li><a href="/document-system/ongoing" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath === '/document-system/ongoing' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Document On Review</a></li>
                                <li><a href="/document-system/obsolete" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath === '/document-system/obsolete' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Obsolete Document</a></li>
                                <li><a href="/document-system/draft" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath === '/document-system/draft' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Draft</a></li>
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
                                <HardHat size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <span>Job Safety Analysis (JSA)</span>
                            </div>
                            {openJsa ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                         {openJsa && (
                            <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                <li><a href="/document-system/jsa" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath === '/document-system/jsa' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Active JSA</a></li>
                                <li><a href="/document-system/jsa/obsolete" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath.includes('/jsa/obsolete') ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Obsolete JSA</a></li>
                                <li><a href="/document-system/jsa/draft" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath.includes('/jsa/draft') ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Draft JSA</a></li>
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
                                <ClipboardCheck size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <span>Permit To Work (PTW)</span>
                            </div>
                            {openPtw ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {openPtw && (
                            <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                <li><a href="/document-system/ptw" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: currentPath === '/document-system/ptw' ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Active PTW</a></li>
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
                                <li><a href="/document-system/master?tab=modules" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=modules')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Modules</a></li>
                                <li><a href="/document-system/master?tab=categories" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=categories')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Categories</a></li>
                                <li><a href="/document-system/master?tab=mappings" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=mappings')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Mappings</a></li>
                                <li><a href="/document-system/master?tab=config" style={{ display: 'block', padding: '6px 12px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=config')) ? '#fff' : '#a3b1c6', textDecoration: 'none' }} className="hover-link">Configuration</a></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}
