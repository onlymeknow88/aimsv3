import {
    Activity,
    AlertCircle,
    ArrowRight,
    Award,
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    FileSpreadsheet,
    FileText,
    HardHat,
    HelpCircle,
    ShieldAlert,
    TrendingUp
} from 'lucide-react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Title as ChartTitle,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Head, Link } from '@inertiajs/react';

import CalendarofEvent from './Partials/Widget/CalendarofEvent';
import DashboardLayout from '@/Layouts/DashboardLayout';
import React from 'react';
import SlideShow from './Partials/Widget/SlideShow';
import useDashboard from './Hooks/useDashboard';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, ArcElement, ChartTitle, Tooltip, Legend, Filler
);

export default function Dashboard({ coeEvents: initialEvents = [], slideshows: initialSlideshows = [] }) {
    const {
        activeSlide,
        setActiveSlide,
        previewVideo,
        setPreviewVideo,
        coeEvents,
        slides,
        currentSlide,
        nextSlide,
        prevSlide,
        loading,
    } = useDashboard(initialEvents, initialSlideshows);

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
            <div className="dashboard-grid-hero" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', marginBottom: '32px' }}>
                {/* Welcome Banner Slideshow Container */}
                <SlideShow
                    loading={loading}
                    currentSlide={currentSlide}
                    slides={slides}
                    activeSlide={activeSlide}
                    setActiveSlide={setActiveSlide}
                    prevSlide={prevSlide}
                    nextSlide={nextSlide}
                    setPreviewVideo={setPreviewVideo}
                />

                {/* Event Calendar Sidebar */}
                <CalendarofEvent loading={loading} coeEvents={coeEvents} />
            </div>


        </DashboardLayout>
    );
}
