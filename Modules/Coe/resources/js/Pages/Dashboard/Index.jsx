import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoeLayout from '../../Layouts/CoeLayout';
import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { 
    Calendar, CheckCircle, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
};

export default function DashboardIndex() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/coe/dashboard-stats');
            setStats(response.data?.result);
        } catch (e) {
            setError('Gagal memuat statistik dashboard.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Setup chart data
    const chart1Data = {
        labels: stats?.chart1?.labels || [],
        datasets: [
            {
                label: 'Event Terlaksana /Bulan',
                data: stats?.chart1?.data || [],
                backgroundColor: '#22c55e',
                borderRadius: 6,
            }
        ]
    };

    const chart3Data = {
        labels: stats?.chart3?.labels || [],
        datasets: [
            {
                label: 'Total Event',
                data: stats?.chart3?.data || [],
                backgroundColor: '#3b82f6',
                borderRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    return (
        <CoeLayout>
            <Head title="Dashboard CoE" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Dashboard CoE</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Statistik dan ringkasan pencapaian agenda Center of Excellence.</p>
                </div>
                <button
                    onClick={fetchStats}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "9px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        color: "#475569",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#dc2626', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Total Events */}
                <div style={cardStyle}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Event</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{loading ? '...' : (stats?.kpis?.total || 0)}</h3>
                    </div>
                </div>

                {/* Completed Events */}
                <div style={cardStyle}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Event Terlaksana</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{loading ? '...' : (stats?.kpis?.completed || 0)}</h3>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div style={cardStyle}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ca8a04' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Event Mendatang</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{loading ? '...' : (stats?.kpis?.upcoming || 0)}</h3>
                    </div>
                </div>

                {/* Cancelled Events */}
                <div style={cardStyle}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Event Dibatalkan</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{loading ? '...' : (stats?.kpis?.cancelled || 0)}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Chart 1 */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Event Terlaksana (DONE) per Bulan</h4>
                    {loading ? (
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Memuat data grafik...</div>
                    ) : (
                        <Bar data={chart1Data} options={chartOptions} height={180} />
                    )}
                </div>

                {/* Chart 3 */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Total Event Berdasarkan Status</h4>
                    {loading ? (
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Memuat data grafik...</div>
                    ) : (
                        <Bar data={chart3Data} options={chartOptions} height={180} />
                    )}
                </div>
            </div>
        </CoeLayout>
    );
}
