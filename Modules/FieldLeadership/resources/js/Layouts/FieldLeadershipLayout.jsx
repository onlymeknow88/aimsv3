import React, { useState, useEffect } from 'react';
import Sidebar from './Partials/Sidebar';
import Header from './Partials/Header';

export default function FieldLeadershipLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/field-leadership';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile || !sidebarOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isMobile, sidebarOpen]);

    // Dropdown collapse states — diinisialisasi dari currentPath
    const [openObservation, setOpenObservation] = useState(
        currentPath.includes('/pto') || currentPath.includes('/ttt') ||
        currentPath.includes('/hr') || currentPath.includes('/observations')
    );
    const [openRisk, setOpenRisk] = useState(
        currentPath.includes('/risks') || currentPath.includes('/corrective-actions')
    );
    const [openMaster, setOpenMaster] = useState(currentPath.includes('/master'));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            <a href="#fls-main-content" className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>Lewati ke konten utama</a>
            {/* Mobile Sidebar Overlay Backdrop — accessible */}
            {isMobile && sidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup navigasi"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        zIndex: 99,
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                    }}
                />
            )}

            {/* Sidebar Partial */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                isMobile={isMobile}
                currentPath={currentPath}
                currentSearch={currentSearch}
                openObservation={openObservation}
                setOpenObservation={setOpenObservation}
                openRisk={openRisk}
                setOpenRisk={setOpenRisk}
                openMaster={openMaster}
                setOpenMaster={setOpenMaster}
            />

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header Partial */}
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Konten Halaman */}
                <main id="fls-main-content" tabIndex={-1} style={{ flex: 1, padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hover-link:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: #fff !important;
                }
                .fls-sidebar-link:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: #fff !important;
                }
                *:focus-visible {
                    outline: 2px solid var(--primary, #1d4ed8);
                    outline-offset: 2px;
                }
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0,0,0,0);
                    white-space: nowrap;
                    border: 0;
                }
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                        backdrop-filter: none !important;
                    }
                }
            `}} />
        </div>
    );
}