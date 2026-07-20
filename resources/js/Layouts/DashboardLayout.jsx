import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Calendar, FileText, ShieldAlert, UserCheck,
    Search, ShieldCheck, Layers, HeartPulse, HardHat, CheckSquare,
    Activity, Award, Landmark
} from 'lucide-react';
import Sidebar from './Partials/Sidebar';
import Header from './Partials/Header';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [period, setPeriod] = useState('YTD 2026');
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const handleResetFilter = () => {
        setDepartment('');
        setLocation('');
        setPeriod('YTD 2026');
    };

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/', active: currentPath === '/' },
        { name: 'Calendar of Event (CoE)', icon: Calendar, href: '/coe/calendar', active: currentPath.startsWith('/coe') },
        { name: 'Document System', icon: FileText, href: '/document-system', active: currentPath.startsWith('/document-system'), moduleSlug: 'document-system' },
        { name: 'Safety Accountability Program (SAP)', icon: ShieldAlert, href: '#', active: false, moduleSlug: 'sap' },
        { name: 'Field Leadership', icon: UserCheck, href: '#', active: false, moduleSlug: 'field-leadership' },
        { name: 'Inspection / KPLH', icon: Search, href: '#', active: false, moduleSlug: 'inspection' },
        { name: 'Audit', icon: ShieldCheck, href: '#', active: false, moduleSlug: 'audit' },
        { name: 'Management Risk (IBPR & Bowtie)', icon: ShieldAlert, href: '#', active: false, moduleSlug: 'management-risk' },
        { name: 'Compliance Regulation (KPP)', icon: Layers, href: '#', active: false, moduleSlug: 'compliance' },
        { name: 'Medical Check Up (MCU)', icon: HeartPulse, href: '#', active: false, moduleSlug: 'mcu' },
        { name: 'Contractor Safety Management (CSMS)', icon: LandmarkIcon, href: '#', active: false, moduleSlug: 'csms' },
        { name: 'Safety Operation (KO)', icon: HardHat, href: '#', active: false, moduleSlug: 'safety-operation' },
        { name: 'PICA', icon: CheckSquare, href: '#', active: false, moduleSlug: 'pica' },
    ];

    function LandmarkIcon(props) {
        return <Landmark {...props} />;
    }

    const allowedModules = auth?.modules || [];
    const visibleNavigationItems = navigationItems.filter(item => {
        if (!item.moduleSlug) return true;
        if (!auth?.user) return false;
        if (allowedModules.includes('*')) return true;
        return allowedModules.includes(item.moduleSlug);
    });

    // Set sidebarOpen to false by default on mobile screens on mount
    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
            setSidebarOpen(false);
        }
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>

            {/* CSS Styling Override for Responsiveness */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .sidebar-container {
                        transform: translateX(${sidebarOpen ? '0' : '-280px'});
                        position: fixed !important;
                        z-index: 999;
                        height: 100vh !important;
                    }
                    .main-content-container {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                    .mobile-toggle {
                        display: flex !important;
                    }
                    .dashboard-header {
                        padding: 0 16px !important;
                    }
                    .header-title {
                        font-size: 14px !important;
                        white-space: nowrap !important;
                    }
                    .header-subtitle {
                        display: none !important;
                    }
                    .mobile-backdrop {
                        display: block !important;
                    }
                    /* Force dashboard grids to stack on mobile/tablet */
                    .dashboard-grid-hero,
                    .dashboard-grid-analytics,
                    .dashboard-grid-footer,
                    .dashboard-grid-info {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    /* Reduce padding on mobile */
                    .main-container {
                        padding: 16px !important;
                    }
                }
            `}} />

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 98,
                        display: 'none'
                    }}
                    className="mobile-backdrop"
                />
            )}

            {/* Sidebar Partial */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                visibleNavigationItems={visibleNavigationItems}
                department={department}
                setDepartment={setDepartment}
                location={location}
                setLocation={setLocation}
                period={period}
                setPeriod={setPeriod}
                handleResetFilter={handleResetFilter}
            />

            {/* Main Area */}
            <div
                className="main-content-container"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    transition: 'margin-left 0.3s ease'
                }}
            >
                {/* Header Partial */}
                <Header
                    auth={auth}
                    profileDropdownOpen={profileDropdownOpen}
                    setProfileDropdownOpen={setProfileDropdownOpen}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Dashboard Content Container */}
                <main className="main-container" style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
