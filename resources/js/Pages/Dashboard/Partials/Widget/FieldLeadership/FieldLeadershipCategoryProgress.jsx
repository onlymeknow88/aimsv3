const FLS_PRIMARY   = 'var(--primary)';
const FLS_SECONDARY = '#FF8C24';

// Category color map
const CATEGORY_COLORS = {
    'Planned Task Observation': 'var(--primary)',
    'Take Time Talk':           '#FF8C24',
    'Hazard Report':            '#2FBF71',
};

// Short label for display
const CATEGORY_SHORT = {
    'Planned Task Observation': 'PTO',
    'Take Time Talk':           'TTT',
    'Hazard Report':            'HR',
};

// ── Skeleton block ────────────────────────────────────────────────────────────
function SkeletonBlock({ width = '100%', height = '12px', radius = '6px' }) {
    return (
        <div style={{
            width, height, borderRadius: radius,
            backgroundColor: '#e2e8f0',
            animation: 'flsprogress-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

// ── Single progress bar row ───────────────────────────────────────────────────
function CategoryRow({ name, count, value, color, loading }) {
    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <SkeletonBlock width="90px" height="11px" />
                    <SkeletonBlock width="32px" height="11px" />
                </div>
                <SkeletonBlock height="8px" radius="999px" />
            </div>
        );
    }

    const shortLabel = CATEGORY_SHORT[name] ?? name;
    const pct        = Math.min(100, Math.max(0, value ?? 0));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Color dot */}
                    <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        backgroundColor: color, display: 'inline-block', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                        {shortLabel}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                        ({count?.toLocaleString('id-ID') ?? 0})
                    </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                    {pct}%
                </span>
            </div>
            {/* Progress track */}
            <div style={{
                height: '8px', backgroundColor: '#f1f5f9',
                borderRadius: '999px', overflow: 'hidden',
            }}>
                <div style={{
                    width: `${pct}%`, height: '100%',
                    backgroundColor: color, borderRadius: '999px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FieldLeadershipCategoryProgress({ stats, loading }) {
    const categories = stats?.barChartByCategory ?? [
        { name: 'Planned Task Observation', count: 0, value: 0 },
        { name: 'Take Time Talk',           count: 0, value: 0 },
        { name: 'Hazard Report',            count: 0, value: 0 },
    ];

    return (
        <>
            <style>{`
                @keyframes flsprogress-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
            `}</style>

            <div>
                <span style={{
                    display: 'block', fontSize: '11px', fontWeight: 700,
                    color: '#475569', textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: '16px',
                }}>
                    Per Kategori
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {loading
                        ? [1, 2, 3].map(i => (
                            <CategoryRow key={i} loading />
                          ))
                        : categories.map(cat => (
                            <CategoryRow
                                key={cat.name}
                                name={cat.name}
                                count={cat.count}
                                value={cat.value}
                                color={CATEGORY_COLORS[cat.name] ?? FLS_PRIMARY}
                                loading={false}
                            />
                          ))
                    }
                </div>

                {/* Total summary */}
                {!loading && (
                    <div style={{
                        marginTop: '16px', paddingTop: '12px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                            Total
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: FLS_PRIMARY }}>
                            {categories.reduce((s, c) => s + (c.count ?? 0), 0).toLocaleString('id-ID')}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
