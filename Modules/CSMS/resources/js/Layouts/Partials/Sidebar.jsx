import { ArrowLeft, ChevronDown, ChevronUp, HardHat } from 'lucide-react';

import React from 'react';
import { usePage } from '@inertiajs/react';

const SLUG_URL = {
    'csms.dashboard':    '/csms/dashboard',
    'csms.bidding':      '/csms/bidding/lists',
    'csms.post-bidding': '/csms/post-bidding/lists',
    'csms.renewal':      '/csms/renewal/lists',
    'csms.pica':         '/csms/pica/lists',
    'csms.pjo':          null,
    'csms.pjo.active':   '/csms/pjo/lists?status=Active',
    'csms.pjo.ongoing':  '/csms/pjo/lists?status=On Going',
    'csms.pjo.draft':    '/csms/pjo/lists?status=Draft',
    'csms.memo':         '/csms/memo-ktt/lists',
    'csms.letter':       '/csms/letter/lists',
    'csms.dictionary':   '/csms/dictionary/lists',
    'csms.approval':     '/csms/approval/bidding',
};

function isActivePath(slug, currentPath, currentSearch) {
    const url = SLUG_URL[slug];
    if (!url) return false;
    if (url.includes('?')) return `${currentPath}${currentSearch}` === url;
    return currentPath === url || currentPath.startsWith(url.replace('/lists', ''));
}

export default function Sidebar({ sidebarOpen, isMobile, currentPath, currentSearch, openPjo, setOpenPjo }) {
    const { csmsMenus = [] } = usePage().props;

    const dropdownState = {
        'csms.pjo': { open: openPjo, setOpen: setOpenPjo },
    };

    const parentMenus = csmsMenus.filter(m => !m.parent_id).sort((a, b) => a.order_by - b.order_by);
    const childMenus  = (parentId) => csmsMenus.filter(m => String(m.parent_id) === String(parentId)).sort((a, b) => a.order_by - b.order_by);
    const hasChildren = (id) => csmsMenus.some(m => String(m.parent_id) === String(id));

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
            top: 0, left: 0,
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
                    <h1 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0 }}>CSMS</h1>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Contractor Safety</span>
                </div>
            </div>

            {/* Back to Home */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b1c6', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }} className="hover-link">
                    <ArrowLeft size={12} /> Home AIMS
                </a>
            </div>

            {/* Menu */}
            <div style={{ flex: 1, padding: '16px 8px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {parentMenus.map(menu => {
                        const url        = SLUG_URL[menu.slug];
                        const active     = isActivePath(menu.slug, currentPath, currentSearch);
                        const dd         = dropdownState[menu.slug];
                        const isDropdown = hasChildren(menu.id) && dd;

                        if (isDropdown) {
                            return (
                                <li key={menu.id} style={{ marginBottom: '4px' }}>
                                    <button
                                        onClick={() => dd.setOpen(!dd.open)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            width: '100%', padding: '10px 16px', borderRadius: '8px',
                                            fontSize: '13px', fontWeight: 500, color: '#a3b1c6',
                                            backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                            transition: 'all 0.2s ease', textAlign: 'left',
                                        }}
                                        className="hover-link"
                                    >
                                        <span>{menu.name}</span>
                                        {dd.open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                    {dd.open && (
                                        <ul style={{ listStyle: 'none', margin: '4px 0 0 0', paddingLeft: '28px' }}>
                                            {childMenus(menu.id).map(child => {
                                                const childUrl    = SLUG_URL[child.slug] ?? '#';
                                                const childActive = isActivePath(child.slug, currentPath, currentSearch);
                                                return (
                                                    <li key={child.id}>
                                                        <a href={childUrl} style={{
                                                            display: 'block', padding: '6px 12px', fontSize: '12px',
                                                            color: childActive ? '#fff' : '#a3b1c6', textDecoration: 'none',
                                                            borderRadius: '6px',
                                                            backgroundColor: childActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                                                        }} className="hover-link">
                                                            {child.name}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        }

                        return (
                            <li key={menu.id} style={{ marginBottom: '4px' }}>
                                <a href={url ?? '#'} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '10px 16px', borderRadius: '8px',
                                    fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                                    color: active ? '#fff' : '#a3b1c6',
                                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                                    transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                                }} className={!active ? 'hover-link' : ''}>
                                    {menu.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
