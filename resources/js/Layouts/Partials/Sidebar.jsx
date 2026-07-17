import React from 'react';
import { X, Menu, ChevronDown, RefreshCw } from 'lucide-react';

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    visibleNavigationItems,
    department,
    setDepartment,
    location,
    setLocation,
    period,
    setPeriod,
    handleResetFilter
}) {
    return (
        <>
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
                    overflowY: 'auto',
                    flexShrink: 0
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

                {/* Filter Panel at Bottom of Sidebar */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: 'rgba(0,0,0,0.15)'
                }}>
                    <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter Tampilan</h4>

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
                                fontSize: '13px',
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
                                fontSize: '13px',
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
                                fontSize: '13px',
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
                            fontSize: '13px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        <RefreshCw size={12} />
                        Reset Filter
                    </button>
                </div>
            </div>
        </>
    );
}
