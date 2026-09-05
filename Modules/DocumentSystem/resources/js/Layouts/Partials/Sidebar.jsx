import React, { useState } from 'react';
import {
    LayoutDashboard, ArrowLeft, ChevronDown, ChevronUp, FolderOpen, Database, HardHat, ClipboardCheck, FileText
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

const iconMap = {
    'doc.dashboard': LayoutDashboard,
    'doc': FolderOpen,
    'doc.approval': ClipboardCheck,
    'jsa': HardHat,
    'doc.ptw.parent': ClipboardCheck,
    'doc.master': Database
};

const pathMap = {
    'doc.dashboard': '/document-system',
    'doc.maker': '/document-system/active',
    'doc.ongoing': '/document-system/ongoing',
    'doc.obsolete': '/document-system/obsolete',
    'doc.draft': '/document-system/draft',
    'doc.approval': '/document-system/approval',
    'doc.jsa': '/document-system/jsa',
    'doc.jsa.obsolete': '/document-system/jsa/obsolete',
    'doc.jsa.draft': '/document-system/jsa/draft',
    'doc.ptw': '/document-system/ptw',
    'doc.master': '/document-system/master'
};

export default function Sidebar({
    sidebarOpen,
    isMobile,
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
    const { dsMenus = [] } = usePage().props;

    const [expandedMenus, setExpandedMenus] = useState({
        'doc': currentPath.includes('/draft') || currentPath.includes('/active') || currentPath.includes('/ongoing') || currentPath.includes('/obsolete') || currentPath.includes('/maker'),
        'jsa': currentPath.includes('/jsa'),
        'doc.ptw.parent': currentPath.includes('/ptw'),
        'doc.master': currentPath.includes('/master')
    });

    const toggleExpand = (slug) => {
        setExpandedMenus(prev => ({
            ...prev,
            [slug]: !prev[slug]
        }));
    };

    const renderHardcoded = () => {
        return (
            <>
                <li style={{ marginBottom: '4px' }}>
                    <a
                        href="/document-system"
                        aria-current={currentPath === '/document-system' ? 'page' : undefined}
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
                            color: currentPath === '/document-system' ? '#fff' : '#a3b1c6',
                            backgroundColor: currentPath === '/document-system' ? 'var(--primary)' : 'transparent',
                            transition: 'background-color 0.2s ease, color 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        className={currentPath !== '/document-system' ? "ds-sidebar-link" : ""}
                    >
                        <LayoutDashboard size={14} aria-hidden="true" style={{ color: currentPath === '/document-system' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        Dashboard
                    </a>
                </li>
                <li style={{ marginBottom: '4px' }}>
                    <button
                        type="button"
                        aria-expanded={openDocs}
                        aria-controls="ds-submenu-docs"
                        onClick={() => setOpenDocs(!openDocs)}
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
                        className="ds-sidebar-link"
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FolderOpen size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                            Dokumen Kebijakan
                        </span>
                        {openDocs ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                    </button>
                    {openDocs && (
                        <ul id="ds-submenu-docs" role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                            <li><a href="/document-system/active" aria-current={currentPath === '/document-system/active' ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath === '/document-system/active' ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Active Document</a></li>
                            <li><a href="/document-system/ongoing" aria-current={currentPath === '/document-system/ongoing' ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath === '/document-system/ongoing' ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Document On Review</a></li>
                            <li><a href="/document-system/obsolete" aria-current={currentPath === '/document-system/obsolete' ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath === '/document-system/obsolete' ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Obsolete Document</a></li>
                            <li><a href="/document-system/draft" aria-current={currentPath === '/document-system/draft' ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath === '/document-system/draft' ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Draft</a></li>
                        </ul>
                    )}
                </li>
                <li style={{ marginBottom: '4px' }}>
                    <button
                        type="button"
                        aria-expanded={openJsa}
                        aria-controls="ds-submenu-jsa"
                        onClick={() => setOpenJsa(!openJsa)}
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
                        className="ds-sidebar-link"
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <HardHat size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                            Job Safety Analysis (JSA)
                        </span>
                        {openJsa ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                    </button>
                    {openJsa && (
                        <ul id="ds-submenu-jsa" role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                            <li><a href="/document-system/jsa" aria-current={currentPath === '/document-system/jsa' ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath === '/document-system/jsa' ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Active JSA</a></li>
                            <li><a href="/document-system/jsa/obsolete" aria-current={currentPath.includes('/jsa/obsolete') ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath.includes('/jsa/obsolete') ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Obsolete JSA</a></li>
                            <li><a href="/document-system/jsa/draft" aria-current={currentPath.includes('/jsa/draft') ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath.includes('/jsa/draft') ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Draft JSA</a></li>
                        </ul>
                    )}
                </li>
                <li style={{ marginBottom: '4px' }}>
                    <button
                        type="button"
                        aria-expanded={openPtw}
                        aria-controls="ds-submenu-ptw"
                        onClick={() => setOpenPtw(!openPtw)}
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
                        className="ds-sidebar-link"
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ClipboardCheck size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                            Permit To Work (PTW)
                        </span>
                        {openPtw ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                    </button>
                    {openPtw && (
                        <ul id="ds-submenu-ptw" role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                            <li><a href="/document-system/ptw" aria-current={currentPath === '/document-system/ptw' ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: currentPath === '/document-system/ptw' ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Active PTW</a></li>
                        </ul>
                    )}
                </li>
                <li style={{ marginBottom: '4px' }}>
                    <button
                        type="button"
                        aria-expanded={openMaster}
                        aria-controls="ds-submenu-master"
                        onClick={() => setOpenMaster(!openMaster)}
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
                        className="ds-sidebar-link"
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Database size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                            Master Data
                        </span>
                        {openMaster ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                    </button>
                    {openMaster && (
                        <ul id="ds-submenu-master" role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                            <li><a href="/document-system/master?tab=modules" aria-current={currentPath === '/document-system/master' && currentSearch.includes('tab=modules') ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=modules')) ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Modules</a></li>
                            <li><a href="/document-system/master?tab=categories" aria-current={currentPath === '/document-system/master' && currentSearch.includes('tab=categories') ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=categories')) ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Categories</a></li>
                            <li><a href="/document-system/master?tab=mappings" aria-current={currentPath === '/document-system/master' && currentSearch.includes('tab=mappings') ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=mappings')) ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Mappings</a></li>
                            <li><a href="/document-system/master?tab=config" aria-current={currentPath === '/document-system/master' && currentSearch.includes('tab=config') ? 'page' : undefined} style={{ display: 'block', padding: '10px 12px', minHeight: '44px', fontSize: '12px', color: (currentPath === '/document-system/master' && currentSearch.includes('tab=config')) ? '#fff' : '#a3b1c6', textDecoration: 'none', lineHeight: '24px' }} className="ds-sidebar-link">Configuration</a></li>
                        </ul>
                    )}
                </li>
            </>
        );
    };

    const renderMenus = () => {
        if (!dsMenus || dsMenus.length === 0) {
            return renderHardcoded();
        }

        const parentMenus = dsMenus.filter(m => !m.parent_id);
        
        return parentMenus.map(parent => {
            const children = dsMenus.filter(m => m.parent_id === parent.id);
            const IconComponent = iconMap[parent.slug] || FolderOpen;
            const parentPath = pathMap[parent.slug] || `/document-system/${parent.slug.replace('doc.', '')}`;
            const isParentActive = currentPath === parentPath;

            if (children.length > 0 || parent.slug === 'doc.master') {
                const isOpen = expandedMenus[parent.slug];
                const activeChildren = children.length > 0 ? children : [
                    { slug: 'modules', name: 'Modules', custom_url: '/document-system/master?tab=modules' },
                    { slug: 'categories', name: 'Categories', custom_url: '/document-system/master?tab=categories' },
                    { slug: 'mappings', name: 'Mappings', custom_url: '/document-system/master?tab=mappings' },
                    { slug: 'config', name: 'Configuration', custom_url: '/document-system/master?tab=config' }
                ];

                return (
                    <li key={parent.id} style={{ marginBottom: '4px' }}>
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`ds-submenu-${parent.slug}`}
                            onClick={() => toggleExpand(parent.slug)}
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
                            className="ds-sidebar-link"
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <IconComponent size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                                {parent.name}
                            </span>
                            {isOpen ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                        </button>

                        {isOpen && (
                            <ul id={`ds-submenu-${parent.slug}`} role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                {activeChildren.map(child => {
                                    const childPath = child.custom_url || pathMap[child.slug] || `/document-system/${child.slug.replace('doc.', '').replace('.', '/')}`;
                                    const isChildActive = child.custom_url 
                                        ? (currentPath === '/document-system/master' && currentSearch.includes(child.custom_url.split('?')[1]))
                                        : currentPath === childPath;

                                    return (
                                        <li key={child.id || child.slug}>
                                            <a 
                                                href={childPath}
                                                aria-current={isChildActive ? 'page' : undefined}
                                                style={{ 
                                                    display: 'block', 
                                                    padding: '10px 12px',
                                                    minHeight: '44px',
                                                    lineHeight: '24px',
                                                    fontSize: '12px', 
                                                    color: isChildActive ? '#fff' : '#a3b1c6', 
                                                    textDecoration: 'none' 
                                                }} 
                                                className="ds-sidebar-link"
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
                <li key={parent.id} style={{ marginBottom: '4px' }}>
                    <a
                        href={parentPath}
                        aria-current={isParentActive ? 'page' : undefined}
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
                            color: isParentActive ? '#fff' : '#a3b1c6',
                            backgroundColor: isParentActive ? 'var(--primary)' : 'transparent',
                            transition: 'background-color 0.2s ease, color 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        className={!isParentActive ? "ds-sidebar-link" : ""}
                    >
                        <IconComponent size={14} aria-hidden="true" style={{ color: isParentActive ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        {parent.name}
                    </a>
                </li>
            );
        });
    };

    return (
        <nav
            id="ds-sidebar"
            aria-label="Navigasi Document System"
            style={{
                width: sidebarOpen ? '250px' : '0px',
                minWidth: sidebarOpen ? '250px' : '0px',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-250px)',
                backgroundColor: 'var(--sidebar-bg)',
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
                    <FileText size={18} />
                </div>
                <div>
                    <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>Document System</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Module Workspace</span>
                </div>
            </div>

            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a href="/" aria-label="Kembali ke Home AIMS" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600, minHeight: '44px' }} className="ds-sidebar-link">
                    <ArrowLeft size={12} aria-hidden="true" />
                    Home AIMS
                </a>
            </div>

            <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {renderMenus()}
                </ul>
            </div>
        </nav>
    );
}
