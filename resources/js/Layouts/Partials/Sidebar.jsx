import { Menu, SlidersHorizontal, X } from 'lucide-react';

import React from 'react';

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    visibleNavigationItems,
    onFilterOpen,
}) {
    return (
        <>


            {/* Sidebar Panel */}
            <div
                className="sidebar-container"
                style={{
                    width: sidebarOpen ? '280px' : '0px',
                    minWidth: sidebarOpen ? '280px' : '0px',
                    backgroundColor: 'var(--sidebar-bg)',
                    color: '#a9b9d0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    transition: 'width 0.3s ease-in-out, min-width 0.3s ease-in-out',
                    borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    overflowY: sidebarOpen ? 'auto' : 'hidden',
                    overflowX: 'hidden',
                    flexShrink: 0,
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
                    <img
                        src="/images/Alamtri Geo Logo - Full Color 1.png"
                        alt="Alamtri Logo"
                        style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            padding: '4px'
                        }}
                    />
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>AIMS</h1>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block', whiteSpace: 'nowrap' }}>Integrated Management System</span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
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
                                            fontSize: '13.5px',
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

                {/* Filter Button at Bottom of Sidebar */}
                {onFilterOpen && (
                    <div style={{
                        padding: '16px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: 'rgba(0,0,0,0.15)'
                    }}>
                        <button
                            onClick={onFilterOpen}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        >
                            <SlidersHorizontal size={14} />
                            Filter Dashboard
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
