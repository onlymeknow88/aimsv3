import { Menu, X } from 'lucide-react';

import React from 'react';

export default function Header({ sidebarOpen, setSidebarOpen }) {
    return (
        <header style={{
             height: '60px',
            backgroundColor: 'var(--card-bg)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 90,
        }}>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    PICA — Problem Identification & Corrective Action
                </span>
            </div>
        </header>
    );
}