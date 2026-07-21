import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FLS_SECONDARY = '#FF8C24';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ChartSkeleton() {
    return (
        <div style={{
            height: '180px', display: 'flex', alignItems: 'flex-end',
            gap: '6px', padding: '0 8px',
            animation: 'flschart-pulse 1.8s infinite ease-in-out',
        }}>
            {[60, 80, 45, 90, 70, 55, 75, 95, 65, 50, 85, 40].map((h, i) => (
                <div key={i} style={{
                    flex: 1, height: `${h}%`,
                    backgroundColor: '#e2e8f0', borderRadius: '4px 4px 0 0',
                }} />
            ))}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FieldLeadershipMonthlyChart({ stats, loading }) {
    const barChartByMonth = stats?.barChartByMonth ?? {};

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels     = monthOrder;
    const actualData = monthOrder.map(m => barChartByMonth[m]?.actual ?? 0);

    const data = {
        labels,
        datasets: [
            {
                label: 'Aktual',
                data: actualData,
                backgroundColor: FLS_SECONDARY,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 10 }, boxWidth: 12, padding: 12 },
            },
            tooltip: {
                callbacks: {
                    label: ctx => ` Aktual: ${ctx.parsed.y} observasi`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#94a3b8' },
            },
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: '#94a3b8', precision: 0 },
            },
        },
        animation: { duration: 800, easing: 'easeInOutQuart' },
    };

    return (
        <>
            <style>{`
                @keyframes flschart-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
            `}</style>

            <div>
                <span style={{
                    display: 'block', fontSize: '11px', fontWeight: 700,
                    color: '#475569', textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: '12px',
                }}>
                    Aktual per Bulan
                </span>

                {loading ? (
                    <ChartSkeleton />
                ) : (
                    <div style={{ height: '180px' }}>
                        <Bar data={data} options={options} />
                    </div>
                )}
            </div>
        </>
    );
}
