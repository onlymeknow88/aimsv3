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

const G      = '#91BA5F';
const MUTED  = '#64748b';
const BORDER = '#e2e8f0';

const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                color: MUTED,
                font: { size: 10 },
                boxWidth: 10,
                padding: 10
            }
        },
        tooltip: { mode: 'index', intersect: false },
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: MUTED, font: { size: 9 } } },
        y: { beginAtZero: true, ticks: { color: MUTED, font: { size: 9 } }, grid: { color: '#f1f5f9' } },
    },
};

export default function CsmsMonthlyChart({ monthly = [], loading }) {
    const chartData = {
        labels: monthly.map(d => d.month),
        datasets: [{
            label: 'Actual',
            backgroundColor: G,
            borderRadius: 4,
            data: monthly.map(d => d.count),
        }],
    };

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 12px' }}>Monthly</p>
            <div style={{ height: '160px' }}>
                {loading
                    ? <div style={{ height: '100%', backgroundColor: '#e2e8f0', borderRadius: '6px', animation: 'csms-pulse 1.8s infinite' }} />
                    : <Bar data={chartData} options={barOpts} />
                }
            </div>
        </div>
    );
}
