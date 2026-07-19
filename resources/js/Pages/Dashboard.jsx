import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
    FileText, Calendar, Clock, HardHat, TrendingUp, AlertCircle, Award, 
    Briefcase, ShieldAlert, ArrowRight, Download, Activity, FileSpreadsheet,
    HelpCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, 
    LineElement, ArcElement, ChartTitle, Tooltip, Legend, Filler
);

export default function Dashboard({ coeEvents = [] }) {
    // 1. KPI Cards
    const statsCards = [
        { title: 'PROJECT TO DATE', value: '1.245 Hari', trend: '▲ 8,5% dari periode lalu', icon: Calendar, color: '#2563eb' },
        { title: 'MANHOURS', value: '12.456.789 Jam', trend: '▲ 6,3% dari periode lalu', icon: Clock, color: '#ea580c' },
        { title: 'DAY AFTER LAST LTI', value: '245 Hari', trend: '▲ 15,2% dari periode lalu', icon: HardHat, color: '#16a34a' },
        { title: 'MANPOWER', value: '3.456 Orang', trend: '▼ -2,1% dari periode lalu', icon: TrendingUp, color: '#7c3aed' },
    ];

    // 2. Production YTD Chart
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Target',
                data: [10, 15, 20, 25, 30, 40],
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Realisasi',
                data: [12, 14, 22, 28, 29, 39],
                borderColor: '#153B73',
                backgroundColor: 'rgba(21, 59, 115, 0.15)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 3. Production MTD Gauge Data
    const gaugeChartData = {
        labels: ['Realisasi', 'Sisa Target'],
        datasets: [{
            data: [76, 24],
            backgroundColor: ['#FF8C24', '#E7ECF3'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '80%'
        }]
    };

    // 4. Production MTD Chart
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Target (BCM)',
                data: [15, 20, 24, 28, 32, 38],
                backgroundColor: '#94a3b8',
                borderRadius: 4,
            },
            {
                label: 'Realisasi (BCM)',
                data: [12, 18, 22, 30, 31, 39],
                backgroundColor: '#ea580c',
                borderRadius: 4,
            }
        ]
    };

    // 5. Operational Summary Cards (9 Grid)
    const operationalCards = [
        { name: 'SAP SUMMARY', value: '12 Program', icon: Award, color: '#FF8C24' },
        { name: 'FIELD LEADERSHIP', value: '24 Temuan', icon: UserCheckIcon, color: '#16a34a' },
        { name: 'AUDIT SUMMARY', value: '8 Audit', icon: ShieldAlert, color: '#ea580c' },
        { name: 'INSPECTION', value: '36 Inspeksi', icon: FileText, color: '#2563eb' },
        { name: 'SAFETY OPERATION', value: '15 Unit', icon: HardHat, color: '#7c3aed' },
        { name: 'MANAGEMENT RISK', value: '9 Risiko', icon: AlertCircle, color: '#ef4444' },
        { name: 'COMPLIANCE', value: '27 Regulasi', icon: Briefcase, color: '#06b6d4' },
        { name: 'MCU SUMMARY', value: '156 Peserta', icon: Activity, color: '#ec4899' },
        { name: 'CSMS SUMMARY', value: '18 Kontraktor', icon: LandmarkIcon, color: '#6366f1' },
    ];

    // Helper dummy component in case icon name is missing
    function UserCheckIcon(props) {
        return <Activity {...props} />;
    }
    function LandmarkIcon(props) {
        return <Award {...props} />;
    }

    return (
        <DashboardLayout>
            <Head title="AIMS Dashboard" />

            {/* Section 1: KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {statsCards.map((c, i) => {
                    const Icon = c.icon;
                    return (
                        <div key={i} style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{c.title}</span>
                                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{c.value}</h3>
                                <span style={{ fontSize: '11.5px', color: c.trend.includes('▲') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{c.trend}</span>
                            </div>
                            <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '11px', color: 'var(--text-muted)', cursor: 'help' }}>ⓘ</span>
                        </div>
                    );
                })}
            </div>

            {/* Section 2: Hero Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', marginBottom: '32px' }}>
                {/* Welcome Banner Slideshow Container */}
                <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #10233f 0%, #153b73 100%)',
                    color: '#fff',
                    boxShadow: 'var(--shadow-premium)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '260px'
                }}>
                    <div style={{ maxWidth: '70%', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>Utamakan Keselamatan,<br />Ciptakan Masa Depan Tanpa Kecelakaan Kerja</h2>
                        <p style={{ fontSize: '13.5px', color: '#94a3b8', marginBottom: '24px' }}>Zero Incident • Zero Harm • Zero Compromise</p>
                        <button style={{ backgroundColor: '#fff', color: '#10233f', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span>▶</span> Tonton Video
                        </button>
                    </div>
                    {/* Slideshow pagination dots */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '16px', zIndex: 2 }}>
                        <span style={{ width: '20px', height: '6px', borderRadius: '3px', backgroundColor: '#FF8C24' }} />
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    </div>
                    <div style={{ position: 'absolute', right: 0, bottom: 0, top: 0, width: '45%', backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, borderLeft: '1px solid rgba(255,255,255,0.05)' }} />
                    
                    {/* Left/Right controls */}
                    <div style={{ position: 'absolute', right: '20px', bottom: '20px', display: 'flex', gap: '8px', zIndex: 2 }}>
                        <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={14} /></button>
                        <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={14} /></button>
                    </div>
                </div>

                {/* Event Calendar Sidebar */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>CALENDAR OF EVENT</h4>
                            <a href="/coe/calendar" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Lihat Semua</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {coeEvents.length > 0 ? (
                                coeEvents.map((evt, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: idx !== coeEvents.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '10px', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '6px 10px', textAlign: 'center', minWidth: '50px' }}>
                                            <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>{evt.date.split(' ')[0]}</span>
                                            <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{evt.date.split(' ')[1]}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>{evt.title}</h5>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{evt.dept}</span>
                                        </div>
                                        <span style={{ fontSize: '9.5px', fontWeight: 800, backgroundColor: `${evt.color}12`, color: evt.color, padding: '2px 6px', borderRadius: '4px' }}>{evt.status}</span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
                                    Tidak ada agenda kegiatan saat ini.
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', textAlign: 'center' }}>
                        <a href="/coe/calendar" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            Lihat Kalender Lengkap <ArrowRight size={12} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Section 3: Analytics & Summaries */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* 1. Production YTD Chart */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>PRODUCTION YTD</h4>
                        <select style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}>
                            <option>YTD 2026</option>
                        </select>
                    </div>
                    <div style={{ height: '180px' }}>
                        <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>

                {/* 2. Production MTD Gauge Progress Card */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContents: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>PRODUCTION MTD</h4>
                        <select style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}>
                            <option>Juni 2026</option>
                        </select>
                    </div>
                    <div style={{ position: 'relative', height: '110px', margin: '0 auto', width: '160px' }}>
                        <Doughnut data={gaugeChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, textAlign: 'center' }}>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>76%</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '10px', fontSize: '11.5px' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Realisasi</span>
                            <strong style={{ color: 'var(--success)' }}>2.280.000 BCM</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target</span>
                            <strong>3.000.000 BCM</strong>
                        </div>
                    </div>
                </div>

                {/* 3. Operational Summary 3x3 Grid */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase' }}>Operational Summary</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {operationalCards.map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Icon size={12} style={{ color: c.color }} />
                                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name.split(' ')[0]}</span>
                                    </div>
                                    <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{c.value.split(' ')[0]}</strong>
                                    <a href="#" style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Lihat Detail →</a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Section 4: Information Center */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {/* 1. News & Update */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>NEWS & UPDATE</span>
                        <a href="#" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>Lihat Semua</a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>20 Jun 2026</span>
                            <h6 style={{ fontSize: '12px', fontWeight: 700, margin: '2px 0' }}>AIMS Gelar Safety Campaign Q2 2026</h6>
                        </div>
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>18 Jun 2026</span>
                            <h6 style={{ fontSize: '12px', fontWeight: 700, margin: '2px 0' }}>Audit ISO 45001 Berhasil Tanpa Temuan Mayor</h6>
                        </div>
                    </div>
                </div>

                {/* 2. Incident Notification */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>INCIDENT ALERTS</span>
                        <a href="#" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>Lihat Semua</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--danger)' }}>2</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Incident 7 hari terakhir</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', marginBottom: '4px' }}>• Near Miss - Area Pit 3</div>
                        <div>• First Aid Case - Workshop</div>
                    </div>
                </div>

                {/* 3. K3LH Activities */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>K3LH ACTIVITIES</span>
                        <a href="#" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>Lihat Semua</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)' }}>14</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kegiatan Bulan Ini</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <div>• Safety Talk: 6 Kegiatan</div>
                        <div>• Training K3: 4 Kegiatan</div>
                    </div>
                </div>

                {/* 4. Strategic Project */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>STRATEGIC PROJECT</span>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '6px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                        <strong style={{ fontSize: '12px' }}>63%</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Digitalisasi Sistem K3LH</span>
                </div>

                {/* 5. K3LH Award */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>K3LH AWARD</span>
                    <div style={{ color: '#F5A623', marginBottom: '6px' }}>🏆</div>
                    <h6 style={{ fontSize: '12px', fontWeight: 700, margin: '2px 0' }}>Best Safety Performance</h6>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Mining Operation Division</span>
                </div>
            </div>

            {/* Section 5: Safety Performance & Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1.3fr', gap: '24px' }}>
                {/* 1. Safety Performance YTD */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>SAFETY PERFORMANCE (YTD 2026)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Fatality', val: '0', target: '0% target' },
                            { label: 'LTI', val: '1', target: '▲ 100% target' },
                            { label: 'TRIFR', val: '0,45', target: '▼ -10% target' },
                            { label: 'LTIFR', val: '0,90', target: '▼ -18% target' },
                        ].map((s, idx) => (
                            <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>{s.label}</span>
                                <strong style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'block', margin: '4px 0' }}>{s.val}</strong>
                                <span style={{ fontSize: '10px', color: s.target.includes('▲') ? 'var(--danger)' : 'var(--success)' }}>{s.target}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Performance Overview (Progress bar) */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>K3LH PERFORMANCE OVERVIEW</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { name: 'Environment', rate: 92, color: 'var(--success)' },
                            { name: 'Health', rate: 88, color: 'var(--info)' },
                            { name: 'Safety', rate: 90, color: 'var(--accent)' },
                        ].map((bar, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600 }}>{bar.name}</span>
                                    <strong>{bar.rate}%</strong>
                                </div>
                                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#f1f5f9', width: '100%', overflow: 'hidden' }}>
                                    <div style={{ width: `${bar.rate}%`, height: '100%', backgroundColor: bar.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Quick Links Shortcut */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>QUICK LINKS</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {[
                            { label: 'Policy & Procedure', icon: FileSpreadsheet },
                            { label: 'Download Center', icon: Download },
                            { label: 'Report Center', icon: FileText },
                            { label: 'Helpdesk', icon: HelpCircle },
                        ].map((link, idx) => {
                            const Icon = link.icon;
                            return (
                                <a key={idx} href="#" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                                    <Icon size={16} />
                                    <span style={{ fontSize: '10.5px', fontWeight: 700, textAlign: 'center' }}>{link.label}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
