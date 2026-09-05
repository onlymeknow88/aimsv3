import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Partials/Sidebar';
import Header from './Partials/Header';

export default function DocumentSystemLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/document-system';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
    const mainRef = useRef(null);

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

    // Close sidebar on Escape (mobile)
    useEffect(() => {
        if (!isMobile || !sidebarOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isMobile, sidebarOpen]);

    // Focus main content after sidebar closes for keyboard users
    useEffect(() => {
        if (!sidebarOpen && mainRef.current) {
            // don't steal focus aggressively, just ensure main is reachable
        }
    }, [sidebarOpen]);

    // Dropdown collapse states
    const [openDocs, setOpenDocs] = useState(currentPath.includes('/draft') || currentPath.includes('/active') || currentPath.includes('/ongoing') || currentPath.includes('/obsolete') || currentPath.includes('/maker'));
    const [openJsa, setOpenJsa] = useState(currentPath.includes('/jsa'));
    const [openPtw, setOpenPtw] = useState(currentPath.includes('/ptw'));
    const [openMaster, setOpenMaster] = useState(currentPath.includes('/master'));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            {/* Skip link */}
            <a href="#ds-main-content" className="sr-only">Lewati ke konten utama</a>

            {/* Mobile Sidebar Overlay Backdrop — accessible button */}
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
                openDocs={openDocs}
                setOpenDocs={setOpenDocs}
                openJsa={openJsa}
                setOpenJsa={setOpenJsa}
                openPtw={openPtw}
                setOpenPtw={setOpenPtw}
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
                <main ref={mainRef} id="ds-main-content" tabIndex={-1} style={{ flex: 1, padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
