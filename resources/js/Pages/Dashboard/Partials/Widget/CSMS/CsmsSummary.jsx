import { HardHat } from 'lucide-react';
import React from 'react';

const P      = '#153B73';
const O      = '#FF8C24';
const BORDER = '#e2e8f0';
const BG     = '#f8fafc';

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r,
            backgroundColor: '#e2e8f0',
            animation: 'csms-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

export default function CsmsSummary({ summary, loading }) {
    const total = summary?.ytd ?? 0;
    const pct   = summary?.percent ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>

            {/* YTD gradient card */}
            {loading ? (
                <div style={{
                    background: P, borderRadius: '12px', padding: '16px 20px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    animation: 'csms-pulse 1.5s infinite',
                }}>
                    <Skel w="50%" h="11px" />
                    <Skel w="35%" h="36px" />
                    <Skel h="8px" r="999px" />
                    <Skel w="45%" h="11px" />
                </div>
            ) : (
                <div style={{
                    background: 'linear-gradient(135deg, #153B73, #1E4E96)',
                    borderRadius: '12px', padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    color: '#fff', flex: 1, justifyContent: 'space-between',
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <HardHat size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                            YTD — Total Dokumen
                        </span>
                    </div>

                    {/* Big number */}
                    <span style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>
                        {total.toLocaleString('id-ID')}
                    </span>

                    {/* Progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: O, borderRadius: '999px', transition: 'width .6s ease' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{pct}% approved</span>
                    </div>

                    {/* Breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
                        {[
                            { label: 'Bidding',      val: summary?.totalBidding  ?? 0 },
                            { label: 'Post Bidding', val: summary?.totalPB       ?? 0 },
                            { label: 'Renewal',      val: summary?.totalRenewal  ?? 0 },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{item.val.toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
