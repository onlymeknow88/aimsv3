import { HardHat } from 'lucide-react';
import React from 'react';

const P      = '#153B73';
const G      = '#91BA5F';
const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const BG     = '#f8fafc';

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return <div style={{ width: w, height: h, borderRadius: r, backgroundColor: '#e2e8f0', animation: 'csms-pulse 1.8s infinite ease-in-out' }} />;
}

function ProgressBar({ pct, color = P }) {
    return (
        <div style={{ height: '6px', backgroundColor: '#e8edf3', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', backgroundColor: color, borderRadius: '999px', transition: 'width .6s ease' }} />
        </div>
    );
}

export default function CsmsSummary({ summary, loading }) {
    const total = summary?.ytd ?? 0;
    const pct   = summary?.percent ?? 0;

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 12px' }}>YTD</p>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Skel h="40px" w="55%" />
                    <Skel h="6px" r="999px" />
                    <Skel h="10px" w="40%" />
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '48px', fontWeight: 800, color: P, lineHeight: 1, marginBottom: '8px' }}>
                        {total.toLocaleString('id-ID')}
                    </div>
                    <ProgressBar pct={pct} color={G} />
                    <p style={{ fontSize: '11px', color: MUTED, margin: '6px 0 0' }}>{pct}% approved</p>
                </>
            )}
        </div>
    );
}