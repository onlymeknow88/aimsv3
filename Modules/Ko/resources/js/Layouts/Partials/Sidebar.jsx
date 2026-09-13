import { AlertTriangle, ArrowLeft, BookOpen, ChevronDown, ChevronUp, ClipboardList, HardHat, LayoutDashboard, QrCode, Truck, Wrench } from 'lucide-react';
import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

const SLUG_URL = {
    'ko.dashboard':      '/ko/dashboard',
    'ko.proposals':      '/ko/proposals',
    'ko.proposals.list':     '/ko/proposals',
    'ko.proposals.returned': '/ko/proposals?status=Returned',
    'ko.proposals.completed':'/ko/proposals?status=Completed',
    'ko.commissionings': '/ko/commissionings',
    'ko.commissionings.progress': '/ko/commissionings?status=Commissioning in Progress',
    'ko.commissionings.returned': '/ko/commissionings?status=Commissioning Returned',
    'ko.commissionings.list':     '/ko/commissionings',
    'ko.issues':         '/ko/issues',
    'ko.issues.open':        '/ko/issues?status=Open',
    'ko.issues.admin':       '/ko/issues?status=Under Admin Verification',
    'ko.issues.coordinator': '/ko/issues?status=Under Coordinator Verification',
    'ko.issues.solved':      '/ko/issues?status=Solved',
    'ko.issues.returned':    '/ko/issues?status=Returned',
    'ko.units':          '/ko/units',
    'ko.units.list':     '/ko/units',
    'ko.units.demob':    '/ko/units?tab=demob',
    'ko.qr-requests':    '/ko/qr-requests',
    'ko.qr-requests.request':  '/ko/qr-requests?tab=request',
    'ko.qr-requests.verify':   '/ko/qr-requests?tab=verify',
    'ko.qr-requests.approved': '/ko/qr-requests?tab=approved',
    'ko.master':         '/ko/master',
    'ko.master.categories': '/ko/master?tab=categories',
    'ko.master.types':      '/ko/master?tab=types',
    'ko.master.spip-units': '/ko/master?tab=spip-units',
    'ko.master.brands':     '/ko/master?tab=brands',
};

const SLUG_ICON = {
    'ko.dashboard':      LayoutDashboard,
    'ko.proposals':      ClipboardList,
    'ko.commissionings': Wrench,
    'ko.issues':         AlertTriangle,
    'ko.units':          Truck,
    'ko.qr-requests':    QrCode,
    'ko.master':         BookOpen,
};

function isActivePath(slug, currentPath) {
    const url = SLUG_URL[slug];
    if (!url) return false;
    return currentPath === url || currentPath.startsWith(url + '/');
}

export default function Sidebar({ sidebarOpen, isMobile, currentPath }) {
    const { koMenus = [] } = usePage().props;
    const menus = koMenus.filter(m => !m.parent_id).sort((a, b) => a.order_by - b.order_by);
    const childrenOf = (parentId) => koMenus.filter(m => m.parent_id === parentId).sort((a, b) => a.order_by - b.order_by);
    // Parity DocumentSystem + newaims: submenu deep-link via query (?tab= / ?status=),
    // grup collapse (buka otomatis mengikuti halaman aktif).
    // window.location.search meng-encode spasi (%20/+) sedangkan SLUG_URL
    // memakai spasi literal — normalkan agar submenu ber-spasi
    // (mis. ?status=Commissioning in Progress) tetap ter-highlight.
    const normQuery = (s) => { try { return decodeURIComponent(String(s).replace(/\+/g, ' ')); } catch { return s; } };
    const currentQuery = typeof window !== 'undefined' ? normQuery(window.location.search) : '';
    const currentFull = `${currentPath}${currentQuery}`;
    const kidsOf = (menu) => childrenOf(menu.id).filter(k => SLUG_URL[k.slug]);
    const isKidActive = (menu) => kidsOf(menu).some(k => (SLUG_URL[k.slug] ?? '#') === currentFull);

    const [expanded, setExpanded] = useState(() => {
        const init = {};
        const full = `${currentPath}${typeof window !== 'undefined' ? normQuery(window.location.search) : ''}`;
        menus.forEach(menu => {
            init[menu.slug] = isActivePath(menu.slug, currentPath) || kidsOf(menu).some(k => (SLUG_URL[k.slug] ?? '#') === full);
        });
        return init;
    });
    const toggleExpand = (slug) => setExpanded(prev => ({ ...prev, [slug]: !prev[slug] }));

    const parentLinkStyle = (on) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        textDecoration: 'none',
        color: on ? '#fff' : '#a3b1c6',
        backgroundColor: on ? 'var(--primary)' : 'transparent',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
    });
    const parentBtnStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        color: '#a3b1c6',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        whiteSpace: 'nowrap',
    };

    return (
        <div style={{
            width: sidebarOpen ? '250px' : '0px',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-250px)',
            backgroundColor: 'var(--sidebar-bg)',
            color: '#a9b9d0',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: isMobile ? 'fixed' : 'sticky',
            top: 0,
            left: 0,
            transition: 'all 0.3s ease-in-out',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            overflowX: 'hidden',
            overflowY: 'auto',
            zIndex: 100,
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <HardHat size={20} />
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0 }}>KO</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Keselamatan Operasi</span>
                </div>
            </div>

            {/* Back to Home */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
                    <ArrowLeft size={12} /> Home AIMS
                </a>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, padding: '16px 8px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {menus.map(menu => {
                        const url    = SLUG_URL[menu.slug] ?? '#';
                        const active = isActivePath(menu.slug, currentPath);
                        const Icon   = SLUG_ICON[menu.slug] ?? null;
                        const kids   = kidsOf(menu);
                        const kidOn  = isKidActive(menu);
                        const open   = !!expanded[menu.slug];

                        // Parent tanpa anak (Dashboard): link biasa ala DocumentSystem.
                        if (kids.length === 0) {
                            return (
                                <li key={menu.id} style={{ marginBottom: '4px' }}>
                                    <a href={url} aria-current={active ? 'page' : undefined} style={parentLinkStyle(active)} className={!active ? 'hover-link' : ''}>
                                        {Icon && <Icon size={14} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />}
                                        {menu.name}
                                    </a>
                                </li>
                            );
                        }

                        // Parent beranak: tombol collapse ala DocumentSystem.
                        return (
                            <li key={menu.id} style={{ marginBottom: '4px' }}>
                                <button
                                    type="button"
                                    aria-expanded={open}
                                    aria-controls={`ko-submenu-${menu.slug}`}
                                    onClick={() => toggleExpand(menu.slug)}
                                    style={{ ...parentBtnStyle, color: (active || kidOn) ? '#fff' : '#a3b1c6' }}
                                    className={!(active || kidOn) ? 'hover-link' : ''}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {Icon && <Icon size={14} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />}
                                        {menu.name}
                                    </span>
                                    {open ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                                </button>
                                {open && (
                                <ul id={`ko-submenu-${menu.slug}`} role="list" style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                    {kids.map(k => {
                                        const kUrl = SLUG_URL[k.slug];
                                        const kOn  = kUrl === currentFull;
                                        return (
                                            <li key={k.id} style={{ marginBottom: '2px' }}>
                                                <a href={kUrl} aria-current={kOn ? 'page' : undefined}
                                                    style={{ display: 'block', padding: '10px 12px', fontSize: '12px', color: kOn ? '#fff' : '#a3b1c6', backgroundColor: kOn ? 'rgba(255,255,255,0.12)' : 'transparent', borderRadius: '6px', textDecoration: 'none', lineHeight: '20px', whiteSpace: 'nowrap' }}
                                                    className={!kOn ? 'hover-link' : ''}>
                                                    {k.name}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
