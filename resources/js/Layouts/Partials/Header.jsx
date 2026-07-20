import React from 'react';
import { Link } from '@inertiajs/react';
import { Bell, LogOut, LogIn, Menu } from 'lucide-react';

export default function Header({
    auth,
    profileDropdownOpen,
    setProfileDropdownOpen,
    sidebarOpen,
    setSidebarOpen
}) {
    return (
        <header style={{
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
                    className="mobile-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Selamat Datang di AIMS</h2>
                    <span className="header-subtitle" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Aplikasi Integrated Management System</span>
                </div>
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
                        fontSize: '10.5px',
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
                </div>

                {/* User Profile / Dropdown Action */}
                {auth?.user ? (
                    <div style={{ position: 'relative', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                        {/* Clickable Avatar Initials */}
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            style={{
                                width: '40px',
                                height: '40px',
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
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            {auth.user.name ? auth.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US'}
                        </button>

                        {/* Dropdown Menu */}
                        {profileDropdownOpen && (
                            <>
                                {/* Backdrop to close dropdown */}
                                <div 
                                    onClick={() => setProfileDropdownOpen(false)} 
                                    style={{ position: 'fixed', inset: 0, zIndex: 98, cursor: 'default' }}
                                />
                                
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    marginTop: '10px',
                                    width: '240px',
                                    backgroundColor: '#fff',
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
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', wordBreak: 'break-all' }}>{auth.user.email}</span>
                                    </div>

                                    {/* Dropdown Options */}
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li>
                                            <Link 
                                                href={route('profile.edit')}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px 16px',
                                                    fontSize: '13px',
                                                    color: 'var(--text-primary)',
                                                    textDecoration: 'none',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                className="dropdown-item"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                👤 Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                href="#" 
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px 16px',
                                                    fontSize: '13px',
                                                    color: 'var(--text-primary)',
                                                    textDecoration: 'none',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                className="dropdown-item"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                🔐 Setup 2FA
                                            </Link>
                                        </li>
                                        <li style={{ borderTop: '1px solid var(--border-color)', marginTop: '4px', paddingTop: '4px' }}>
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button"
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px 16px',
                                                    fontSize: '13px',
                                                    color: 'var(--danger)',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                className="dropdown-item"
                                            >
                                                <LogOut size={14} />
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
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
                                fontSize: '13.5px',
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
            
            <style dangerouslySetInnerHTML={{
                __html: `
                .dropdown-item:hover {
                    background-color: #f1f5f9 !important;
                }
            `}} />
        </header>
    );
}
