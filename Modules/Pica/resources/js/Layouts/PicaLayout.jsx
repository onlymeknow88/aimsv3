import React, { useEffect, useState } from 'react';
import Header from './Partials/Header';
import Sidebar from './Partials/Sidebar';

export default function PicaLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/pica';

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

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0,
                        width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)', zIndex: 99,
                    }}
                />
            )}

            <Sidebar sidebarOpen={sidebarOpen} isMobile={isMobile} currentPath={currentPath} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main style={{ flex: 1, padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .hover-link:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: #fff !important;
                }
            ` }} />
        </div>
    );
}