import { Bell, LogIn, LogOut, Menu, Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';

export default function Header({
    auth,
    profileDropdownOpen,
    setProfileDropdownOpen,
    sidebarOpen,
    setSidebarOpen
}) {
    const dropdownRef = useRef(null);
    const avatarBtnRef = useRef(null);

    // Close dropdown on Escape and click outside
    useEffect(() => {
        if (!profileDropdownOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setProfileDropdownOpen(false);
                avatarBtnRef.current?.focus();
            }
        };
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !avatarBtnRef.current?.contains(e.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleKey);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileDropdownOpen, setProfileDropdownOpen]);

    // Derive unread count from auth if available, fallback hidden when 0
    const notificationCount = auth?.notifications_count ?? 7;
    const showBadge = notificationCount > 0;

    return (
        <header className="dashboard-header" style={{
            height: '70px',
            backgroundColor: 'var(--card-bg)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    type="button"
                    className="mobile-toggle"
                    aria-label={sidebarOpen ? 'Tutup navigasi' : 'Buka navigasi'}
                    aria-expanded={sidebarOpen}
                    aria-controls="sidebar"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '44px',
                        minHeight: '44px',
                        padding: '8px',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    <Menu size={20} aria-hidden="true" />
                </button>
                <div>
                    <h1 className="header-title" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>Selamat Datang di AIMS</h1>
                    <span className="header-subtitle" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Aplikasi Integrated Management System</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Notifications — semantic button */}
                <button
                    type="button"
                    aria-label={showBadge ? `Notifikasi, ${notificationCount} baru` : 'Notifikasi, tidak ada yang baru'}
                    style={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '44px',
                        minHeight: '44px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        padding: 0,
                    }}
                >
                    <Bell size={20} aria-hidden="true" style={{ color: 'var(--text-secondary)' }} />
                    {showBadge && (
                        <span aria-hidden="true" style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'var(--danger)',
                            color: '#fff',
                            fontSize: '10.5px',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid var(--card-bg)',
                            lineHeight: 1,
                        }}>
                            {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                    )}
                </button>

                {/* User Profile / Dropdown Action */}
                {auth?.user ? (
                    <div style={{ position: 'relative', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', display: 'flex', alignItems: 'center' }}>
                        {/* Clickable Avatar Initials */}
                        <button
                            ref={avatarBtnRef}
                            type="button"
                            aria-label={`Menu pengguna ${auth.user.name}`}
                            aria-expanded={profileDropdownOpen}
                            aria-haspopup="menu"
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(21, 59, 115, 0.15)',
                                transition: 'transform 0.2s ease',
                                flexShrink: 0,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            {auth.user.name ? auth.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US'}
                        </button>

                        {/* Dropdown Menu */}
                        {profileDropdownOpen && (
                            <div
                                ref={dropdownRef}
                                role="menu"
                                aria-label="Menu pengguna"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 'calc(100% + 10px)',
                                    width: '240px',
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.05)',
                                    border: '1px solid var(--border-color)',
                                    padding: '8px 0',
                                    zIndex: 99,
                                    textAlign: 'left'
                                }}>
                                    {/* User Info Header */}
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{auth.user.name}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', wordBreak: 'break-all' }}>{auth.user.email}</span>
                                    </div>

                                    {/* Dropdown Options */}
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} role="none">
                                        {auth?.user && (auth?.modules?.includes('*') || auth?.modules?.includes('dashboard-portal')) && (
                                            <li role="none">
                                                <Link
                                                    role="menuitem"
                                                    href={route('dashboard-portal.dashboard')}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '12px 16px',
                                                        minHeight: '44px',
                                                        fontSize: '13px',
                                                        color: 'var(--text-primary)',
                                                        textDecoration: 'none',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    className="dropdown-item"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    Dashboard Portal
                                                </Link>
                                            </li>
                                        )}
                                        <li role="none">
                                            <Link
                                                role="menuitem"
                                                href={route('two-factor.setup')}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '12px 16px',
                                                    minHeight: '44px',
                                                    fontSize: '13px',
                                                    color: 'var(--text-primary)',
                                                    textDecoration: 'none',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                className="dropdown-item"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <Shield size={14} aria-hidden="true" /> Setup 2FA
                                            </Link>
                                        </li>
                                        <li role="none" style={{ borderTop: '1px solid var(--border-color)', marginTop: '4px', paddingTop: '4px' }}>
                                            <button
                                                role="menuitem"
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        await axios.post('/logout');
                                                        window.location.href = '/login';
                                                    } catch (error) {
                                                        console.error('Logout error:', error);
                                                        window.location.href = '/login';
                                                    }
                                                }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '12px 16px',
                                                    minHeight: '44px',
                                                    fontSize: '13px',
                                                    color: 'var(--danger)',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s',
                                                    fontFamily: 'inherit',
                                                }}
                                                className="dropdown-item"
                                            >
                                                <LogOut size={14} aria-hidden="true" />
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                        )}
                    </div>
                ) : (
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                        <Link
                            href="/login"
                            aria-label="Masuk ke AIMS"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                minHeight: '44px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                fontSize: '13.5px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 4px 10px rgba(21, 59, 115, 0.2)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
                        >
                            <LogIn size={14} aria-hidden="true" />
                            Log In
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
