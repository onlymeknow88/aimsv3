import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const C = {
    primary:    '#153B73',
    orange:     '#FF8C24',
    lightGreen: '#91BA5F',
    border:     '#e2e8f0',
    bgInner:    '#f8fafc',
    textMuted:  '#64748b',
};

const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: C.textMuted, font: { size: 10 }, boxWidth: 10, padding: 12 },
        },
        tooltip: { mode: 'index', intersect: false },
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: C.textMuted, font: { size: 10 } } },
        y: {
            beginAtZero: true,
            ticks: { color: C.textMuted, font: { size: 10 } },
            grid: { color: '#f1f5f9' },
        },
    },
};

function buildBar2(series, c1 = C.primary, c2 = C.orange) {
    if (!series?.length) return { labels: [], datasets: [] };
    return {
        labels: series.map(d => d.month),
        datasets: [
            { label: series[0]?.label  ?? 'S1', backgroundColor: c1, borderRadius: 3, data: series.map(d => d.count)  },
            { label: series[0]?.label2 ?? 'S2', backgroundColor: c2, borderRadius: 3, data: series.map(d => d.count2) },
        ],
    };
}

function ChartCard({ title, height = 160, loading, children }) {
    return (
        <div style={{
            backgroundColor: C.bgInner, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '12px',
            width: '100%', boxSizing: 'border-box', overflowX: 'hidden',
        }}>
            {title && (
                <p style={{
                    fontSize: '10px', fontWeight: 700, color: C.textMuted,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    margin: '0 0 10px',
                }}>
                    {title}
                </p>
            )}
            <div style={{ height }}>
                {loading
                    ? <div style={{
                        height: '100%', backgroundColor: '#e2e8f0',
                        borderRadius: '6px',
                        animation: 'csms-widget-pulse 1.8s infinite',
                    }} />
                    : children
                }
            </div>
        </div>
    );
}

export default function CsmsBarChart({ stats, loading }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
            {/* Post Bidding Trend */}
            <ChartCard title="Post Bidding" loading={loading}>
                <Bar data={buildBar2(stats?.postBidding)} options={barOpts} />
            </ChartCard>

            {/* Renewal Trend */}
            <ChartCard title="Renewal" loading={loading}>
                <Bar data={buildBar2(stats?.renewal, C.primary, C.lightGreen)} options={barOpts} />
            </ChartCard>
        </div>
    );
}
