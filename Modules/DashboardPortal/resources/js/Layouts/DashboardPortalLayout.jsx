import React, { useState } from 'react';
import Sidebar from './Partials/Sidebar';
import Header from './Partials/Header';

export default function DashboardPortalLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/coe';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';

    // Dropdown collapse states
    const [openMaster, setOpenMaster] = useState(currentPath.includes('/categories'));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            {/* Sidebar Partial */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                currentPath={currentPath}
                currentSearch={currentSearch}
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

                {/* Page Content */}
                <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-link:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: #fff !important;
                }
            `}} />
        </div>
    );
}
