import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { FileText, Clock, AlertCircle, Trash2, ShieldAlert, Activity, ChevronRight, BarChart3 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
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

export default function Index({ stats = {} }) {
    const statCards = [
        { title: 'Active Documents', count: stats.active_docs ?? 0, icon: FileText, color: 'var(--success)', bg: 'rgba(47, 191, 113, 0.05)', href: '/document-system/active' },
        { title: 'On Going Workflow', count: stats.ongoing_docs ?? 0, icon: Clock, color: 'var(--accent)', bg: 'rgba(255, 140, 36, 0.05)', href: '/document-system/ongoing' },
        { title: 'Draft Documents', count: stats.draft_docs ?? 0, icon: AlertCircle, color: 'var(--info)', bg: 'rgba(45, 127, 249, 0.05)', href: '/document-system/draft' },
        { title: 'Obsolete Archive', count: stats.obsolete_docs ?? 0, icon: Trash2, color: 'var(--danger)', bg: 'rgba(244, 67, 54, 0.05)', href: '/document-system/obsolete' },
        { title: 'Active JSA', count: stats.jsa_active ?? 0, icon: ShieldAlert, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)', href: '/document-system/jsa' },
        { title: 'Active PTW', count: stats.ptw_active ?? 0, icon: Activity, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.05)', href: '/document-system/ptw' },
    ];

    // Mock data for 9 department charts from aimsv2 logic
    const departments = [
        { name: 'Mining & Engineering', color: '#009D50', data: [65, 59, 20, 81, 56, 55, 40, 65, 59, 20, 81, 56] },
        { name: 'CPP Operation', color: '#153B73', data: [40, 48, 60, 35, 75, 80, 50, 42, 63, 70, 52, 90] },
        { name: 'Maintenance', color: '#FF8C24', data: [80, 65, 45, 70, 92, 85, 60, 75, 80, 95, 68, 77] },
        { name: 'Logistic', color: '#2D7FF9', data: [35, 40, 55, 60, 48, 50, 62, 58, 45, 60, 72, 65] },
        { name: 'Procurement', color: '#8B5CF6', data: [50, 55, 60, 58, 62, 70, 68, 72, 75, 80, 85, 90] },
        { name: 'Explorasi', color: '#06B6D4', data: [20, 30, 25, 45, 35, 40, 50, 48, 52, 60, 58, 62] },
        { name: 'External & Relation', color: '#F5A623', data: [45, 50, 48, 52, 58, 60, 55, 65, 62, 70, 75, 80] },
        { name: 'Port Operation & Maintenance', color: '#EC4899', data: [60, 55, 65, 70, 72, 80, 78, 85, 82, 90, 88, 95] },
        { name: 'IT', color: '#10B981', data: [75, 80, 85, 90, 92, 95, 98, 90, 93, 97, 95, 100] }
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
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

            {/* Stat Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                                justifyContents: 'space-between',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all 0.2s ease',
                            }}
                            className="hover-lift"
                        >
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.title}</span>
                                <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 0 0' }}>{card.count}</h3>
                            </div>
                            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: card.bg, color: card.color }}>
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

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '20px'
                }}>
                    {departments.map((dept, idx) => {
                        const chartData = {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
                            datasets: [{
                                label: 'Dokumen',
                                data: dept.data,
                                backgroundColor: dept.color,
                                borderRadius: 4,
                                barThickness: 10
                            }]
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
                                height: '240px'
                            }}>
                                <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                                    {dept.name}
                                </h4>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    Quick Operations
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px'
                }}>
                    <a href="/document-system/maker" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        backgroundColor: '#fafbfc'
                    }} className="hover-lift">
                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>Buat Dokumen Baru (Maker)</h4>
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>SOP, Technical Standard, Manual, Work Instruction & Form.</p>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </a>

                    <a href="/document-system/jsa" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        backgroundColor: '#fafbfc'
                    }} className="hover-lift">
                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>Create Job Safety Analysis</h4>
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Isi matriks analisis bahaya, langkah kerja, & mitigasi risiko.</p>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </a>

                    <a href="/document-system/ptw" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        backgroundColor: '#fafbfc'
                    }} className="hover-lift">
                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>Apply Permit to Work (PTW)</h4>
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Izin kerja aman untuk risiko tinggi (Hot Work, Ketinggian, Confined Space).</p>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </a>
                </div>
            </div>
        </DocumentSystemLayout>
    );
}


