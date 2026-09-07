import {
    Activity,
    Award,
    Calendar,
    CheckSquare,
    FileText,
    HardHat,
    HeartPulse,
    Landmark,
    Layers,
    LayoutDashboard,
    Search,
    ShieldAlert,
    ShieldCheck,
    UserCheck
} from 'lucide-react';
import React, { useState } from 'react';

import Header from './Partials/Header';
import Sidebar from './Partials/Sidebar';
import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children, onFilterOpen }) {
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
        { name: 'Field Leadership', icon: UserCheck, href: '/field-leadership', active: currentPath.startsWith('/field-leadership'), moduleSlug: 'field-leadership' },
        { name: 'Inspection / KPLH', icon: Search, href: '#', active: false, moduleSlug: 'inspection' },
        { name: 'Audit', icon: ShieldCheck, href: '#', active: false, moduleSlug: 'audit' },
        { name: 'Management Risk (IBPR & Bowtie)', icon: ShieldAlert, href: '#', active: false, moduleSlug: 'management-risk' },
        { name: 'Compliance Regulation (KPP)', icon: Layers, href: '#', active: false, moduleSlug: 'compliance' },
        { name: 'Medical Check Up (MCU)', icon: HeartPulse, href: '#', active: false, moduleSlug: 'mcu' },
        { name: 'Contractor Safety Management (CSMS)', icon: LandmarkIcon, href: '/csms/dashboard', active: currentPath.startsWith('/csms'), moduleSlug: 'csms' },
        { name: 'Keselamatan Operasi (KO)', icon: HardHat, href: '/ko/dashboard', active: currentPath.startsWith('/ko'), moduleSlug: 'ko' },
        { name: 'PICA', icon: CheckSquare, href: '/pica/dashboard', active: currentPath.startsWith('/pica'), moduleSlug: 'pica' },
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

            {/* Mobile Sidebar Backdrop — accessible */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup navigasi"
                    onClick={() => setSidebarOpen(false)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setSidebarOpen(false); }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 98,
                        display: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                    }}
                    className="mobile-backdrop"
                />
            )}

            {/* Sidebar Partial */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                visibleNavigationItems={visibleNavigationItems}
                onFilterOpen={onFilterOpen}
            />

            {/* Main Area — no layout-property animation */}
            <div
                className="main-content-container"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
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
                <main className="main-container" id="main-content" tabIndex={-1} style={{ padding: '32px', flex: 1, overflowY: 'auto', outline: 'none' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
