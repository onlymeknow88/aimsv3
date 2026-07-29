import React, { useEffect, useState } from 'react';

import Header from './Partials/Header';
import Sidebar from './Partials/Sidebar';

export default function CSMSLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath   = typeof window !== 'undefined' ? window.location.pathname : '/csms';
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

    // Dropdown collapse states — diinisialisasi dari currentPath
    const [openBidding, setOpenBidding]         = useState(currentPath.includes('/bidding') && !currentPath.includes('/approval'));
    const [openPjo, setOpenPjo]                 = useState(currentPath.includes('/pjo'));
    const [openPostBidding, setOpenPostBidding] = useState(currentPath.includes('/post-bidding') && !currentPath.includes('/approval'));
    const [openApproval, setOpenApproval]       = useState(currentPath.includes('/approval'));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            {/* Mobile Sidebar Overlay Backdrop */}
            {isMobile && sidebarOpen && (
                <div
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
                        animation: 'fadeIn 0.2s ease'
                    }}
                />
            )}

            {/* Sidebar Partial */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                isMobile={isMobile}
                currentPath={currentPath}
                currentSearch={currentSearch}
                openBidding={openBidding}
                setOpenBidding={setOpenBidding}
                openPjo={openPjo}
                setOpenPjo={setOpenPjo}
                openPostBidding={openPostBidding}
                setOpenPostBidding={setOpenPostBidding}
                openApproval={openApproval}
                setOpenApproval={setOpenApproval}
            />

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header Partial */}
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Konten Halaman */}
                <main style={{ flex: 1, padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hover-link:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: #fff !important;
                }
            `}} />
        </div>
    );
}
