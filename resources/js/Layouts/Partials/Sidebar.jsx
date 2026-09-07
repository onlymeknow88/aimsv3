import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    visibleNavigationItems,
    onFilterOpen,
}) {
    return (
        <>
            {/* Skip link for keyboard users */}
            <a href="#main-content" className="sr-only" style={{ position: 'absolute', left: '-9999px' }} onFocus={(e) => { e.currentTarget.style.left = '12px'; e.currentTarget.style.top = '12px'; e.currentTarget.style.zIndex = '1000'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.padding = '8px 12px'; e.currentTarget.style.borderRadius = '6px'; }}>
                Lewati ke konten utama
            </a>

            {/* Sidebar Panel — uses transform for perf, not width */}
            <nav
                aria-label="Navigasi utama"
                className="sidebar-container"
                data-open={sidebarOpen ? 'true' : 'false'}
                style={{
                    width: '280px',
                    minWidth: '280px',
                    backgroundColor: 'var(--sidebar-bg)',
                    color: '#a9b9d0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    overflowY: 'auto',
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
                        alt="Logo Alamtri — Integrated Management System"
                        width="40"
                        height="40"
                        loading="eager"
                        style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            backgroundColor: 'var(--card-bg)',
                            padding: '4px'
                        }}
                    />
                    <div>
                        <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '0.5px', display: 'block' }}>AIMS</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', whiteSpace: 'nowrap' }}>Integrated Management System</span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} role="list">
                        {visibleNavigationItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <li key={index} style={{ marginBottom: '4px' }}>
                                    <a
                                        href={item.href}
                                        aria-current={item.active ? 'page' : undefined}
                                        aria-label={item.name}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            minHeight: '44px',
                                            borderRadius: '8px',
                                            fontSize: '13.5px',
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            color: item.active ? '#fff' : '#a3b1c6',
                                            backgroundColor: item.active ? 'var(--primary)' : 'transparent',
                                            transition: 'background-color 0.2s ease, color 0.2s ease',
                                            outlineOffset: '2px',
                                        }}
                                        className={!item.active ? "hover-link" : ""}
                                    >
                                        <IconComponent size={16} aria-hidden="true" style={{ color: item.active ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                                        {item.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Filter Button at Bottom of Sidebar — 44px touch target */}
                {onFilterOpen && (
                    <div style={{
                        padding: '16px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: 'rgba(0,0,0,0.15)'
                    }}>
                        <button
                            type="button"
                            onClick={onFilterOpen}
                            aria-label="Buka filter dashboard"
                            style={{
                                width: '100%',
                                minHeight: '44px',
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
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                            onFocus={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onBlur={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        >
                            <SlidersHorizontal size={14} aria-hidden="true" />
                            Filter Dashboard
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
}
