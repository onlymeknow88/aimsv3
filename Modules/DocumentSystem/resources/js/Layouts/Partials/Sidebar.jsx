import React, { useState } from 'react';
import {
    LayoutDashboard, ArrowLeft, ChevronDown, ChevronUp, FolderOpen, Database, HardHat, ClipboardCheck
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
                            onClick={() => toggleExpand(parent.slug)}
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
                                <IconComponent size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <span>{parent.name}</span>
                            </div>
                            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {isOpen && (
                            <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                {activeChildren.map(child => {
                                    const childPath = child.custom_url || pathMap[child.slug] || `/document-system/${child.slug.replace('doc.', '').replace('.', '/')}`;
                                    const isChildActive = child.custom_url 
                                        ? (currentPath === '/document-system/master' && currentSearch.includes(child.custom_url.split('?')[1]))
                                        : currentPath === childPath;

                                    return (
                                        <li key={child.id || child.slug}>
                                            <a 
                                                href={childPath} 
                                                style={{ 
                                                    display: 'block', 
                                                    padding: '6px 12px', 
                                                    fontSize: '12px', 
                                                    color: isChildActive ? '#fff' : '#a3b1c6', 
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
                <li key={parent.id} style={{ marginBottom: '4px' }}>
                    <a
                        href={parentPath}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            color: isParentActive ? '#fff' : '#a3b1c6',
                            backgroundColor: isParentActive ? 'var(--primary)' : 'transparent',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        className={!isParentActive ? "hover-link" : ""}
                    >
                        <IconComponent size={14} style={{ color: isParentActive ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        {parent.name}
                    </a>
                </li>
            );
        });
    };

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
                position: isMobile ? 'fixed' : 'sticky',
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
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                    📄
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>Document System</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Module Workspace</span>
                </div>
            </div>

            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
                    <ArrowLeft size={12} />
                    Home AIMS
                </a>
            </div>

            <div style={{ flex: 1, padding: '16px 8px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {renderMenus()}
                </ul>
            </div>
        </div>
    );
}
