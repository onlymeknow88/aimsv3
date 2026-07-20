import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { FileText, Clock, AlertCircle, Trash2, ShieldAlert, Activity, BarChart3 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend
);

export default function Index() {
    const [data, setData] = useState({ stats: {}, departments: [] });
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        axios.get('/api/document-system/dashboard/stats')
            .then(res => {
                if (res.data?.result) {
                    setData(res.data.result);
                }
            })
            .catch(err => {
                console.error("Gagal memuat statistik dashboard:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const stats = data.stats || {};
    const departments = data.departments || [];

    const statCards = [
        { title: 'Active Documents', count: stats.active_docs ?? 0, icon: FileText, color: 'var(--success)', bg: 'rgba(47, 191, 113, 0.05)', href: '/document-system/active' },
        { title: 'On Going Workflow', count: stats.ongoing_docs ?? 0, icon: Clock, color: 'var(--accent)', bg: 'rgba(255, 140, 36, 0.05)', href: '/document-system/ongoing' },
        { title: 'Draft Documents', count: stats.draft_docs ?? 0, icon: AlertCircle, color: 'var(--info)', bg: 'rgba(45, 127, 249, 0.05)', href: '/document-system/draft' },
        { title: 'Obsolete Archive', count: stats.obsolete_docs ?? 0, icon: Trash2, color: 'var(--danger)', bg: 'rgba(244, 67, 54, 0.05)', href: '/document-system/obsolete' },
        { title: 'Active JSA', count: stats.jsa_active ?? 0, icon: ShieldAlert, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)', href: '/document-system/jsa' },
        { title: 'Active PTW', count: stats.ptw_active ?? 0, icon: Activity, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.05)', href: '/document-system/ptw' },
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 8,
                    font: { size: 9, family: 'Inter' }
                }
            },
            tooltip: {
                backgroundColor: '#10233F',
                titleFont: { size: 10, family: 'Inter' },
                bodyFont: { size: 10, family: 'Inter' },
                padding: 8,
                cornerRadius: 6
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 8, family: 'Inter' }, color: 'var(--text-secondary)' }
            },
            y: {
                border: { dash: [4, 4] },
                grid: { color: '#E7ECF3' },
                ticks: { font: { size: 8, family: 'Inter' }, color: 'var(--text-secondary)' }
            }
        }
    };

    return (
        <DocumentSystemLayout>
            <Head title="Document System Dashboard" />
            
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Document System</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>Manajemen dokumen legal perusahaan, keselamatan operasional, SOP, JSA, dan PTW.</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
                    Memuat data dashboard...
                </div>
            ) : (
                <>
                    {/* Stat Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '20px',
                        marginBottom: '32px'
                    }}>
                        {statCards.map((card, idx) => {
                            const IconComponent = card.icon;
                            return (
                                <a 
                                    key={idx} 
                                    href={card.href} 
                                    style={{
                                        textDecoration: 'none',
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        boxShadow: 'var(--shadow-sm)',
                                        transition: 'all 0.2s ease',
                                    }}
                                    className="hover-lift"
                                >
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.title}</span>
                                        <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 0 0' }}>{card.count}</h3>
                                    </div>
                                    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconComponent size={28} />
                                    </div>
                                </a>
                            );
                        })}
                    </div>

                    {/* Department Charts Section */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Statistik Dokumen Departemen</h2>
                        </div>

                        {departments.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '20px'
                            }}>
                                {departments.map((dept, idx) => {
                                    const chartData = {
                                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
                                        datasets: [
                                            {
                                                label: 'Total Document',
                                                data: dept.total,
                                                backgroundColor: '#153B73',
                                                borderRadius: 3,
                                                barThickness: 6
                                            },
                                            {
                                                label: 'Document Active',
                                                data: dept.active,
                                                backgroundColor: '#2FBF71',
                                                borderRadius: 3,
                                                barThickness: 6
                                            },
                                            {
                                                label: 'Document Expired',
                                                data: dept.expired,
                                                backgroundColor: '#F44336',
                                                borderRadius: 3,
                                                barThickness: 6
                                            }
                                        ]
                                    };

                                    return (
                                        <div key={idx} style={{
                                            backgroundColor: 'var(--card-bg)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            boxShadow: 'var(--shadow-sm)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '280px'
                                        }}>
                                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                                                {dept.name} {dept.company_code ? `- ${dept.company_code}` : ''}
                                            </h4>
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <Bar data={chartData} options={chartOptions} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Belum ada departemen aktif yang memiliki dokumen.
                            </div>
                        )}
                    </div>
                </>
            )}
        </DocumentSystemLayout>
    );
}
