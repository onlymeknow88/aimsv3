import {
    Activity,
    AlertCircle,
    Award,
    Briefcase,
    FileText,
    HardHat,
    ShieldAlert,
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

import CalendarOfEventStats from './Partials/Widget/CalendarOfEventStats';
import CalendarofEvent from './Partials/Widget/CalendarofEvent';
import CsmsWidget from './Partials/Widget/CSMS';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HealthPerformanceWidget from './Partials/Widget/HealthPerformanceWidget';
import IncidentNotificationWidget from './Partials/Widget/IncidentNotification';
import ProductionMtdWidget from './Partials/Widget/Production/ProductionMtdWidget';
import ProductionYtdWidget from './Partials/Widget/Production/ProductionYtdWidget';
import SafetyPerformanceWidget from './Partials/Widget/SafetyPerformanceWidget';
import DocumentSystemWidget from './Partials/Widget/DocumentSystem/DocumentSystemWidget';
import FieldLeadership from './Partials/Widget/FieldLeadership';
import NewsUpdate from './Partials/Widget/NewsUpdate';
import React from 'react';
import SafetyKPI from './Partials/Widget/SafetyKPI';
import SlideShow from './Partials/Widget/SlideShow';
import useDashboard from './Hooks/useDashboard';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, ArcElement, ChartTitle, Tooltip, Legend, Filler
);

export default function Dashboard({ coeEvents: initialEvents = [], slideshows: initialSlideshows = [], widgetSettings = {} }) {
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
        generalStats,
        newsItems,
        coeStats,
    } = useDashboard(initialEvents, initialSlideshows);

    // KPI Cards — data dari API dashboard_general (lihat SafetyKPI widget)

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

            {/* Section 1: KPI Cards — Safety Performance dari dashboard_general */}
            {widgetSettings['widget_safety_performance_chart'] !== "false" && (
                <SafetyKPI generalStats={generalStats} loading={loading} />
            )}

            {/* Section 2: Hero Area */}
            <style>{`
                .dashboard-grid-hero {
                    display: grid;
                    grid-template-columns: 1.8fr 1.2fr;
                    gap: 24px;
                    margin-bottom: 32px;
                }
                @media (max-width: 768px) {
                    .dashboard-grid-hero {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
            
            {(widgetSettings['widget_video_slide'] !== "false" || widgetSettings['widget_calendar'] !== "false") && (
                <div className="dashboard-grid-hero">
                    {/* Welcome Banner Slideshow Container */}
                    {widgetSettings['widget_video_slide'] !== "false" && (
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
                    )}

                    {/* Event Calendar Sidebar */}
                    {widgetSettings['widget_calendar'] !== "false" && (
                        <CalendarofEvent loading={loading} coeEvents={coeEvents} />
                    )}
                </div>
            )}

            {/* Section 3: Calendar of Event Stats */}
            {widgetSettings['widget_calendar_of_event_list'] !== "false" && (
                <CalendarOfEventStats stats={coeStats} loading={loading} coeEvents={coeEvents} />
            )}

            {/* Section 4: Document System Widget */}
            {widgetSettings['widget_ds'] !== "false" && (
                <DocumentSystemWidget />
            )}

            {/* Section 5: Field Leadership Widget */}
            {widgetSettings['widget_fls'] !== "false" && (
                <FieldLeadership />
            )}

            {/* Section 6: CSMS Widget */}
            {widgetSettings['widget_csms'] !== "false" && (
                <CsmsWidget />
            )}

            {/* Section 7: Incident Notification Widget */}
            {widgetSettings['widget_incident_notification'] !== "false" && (
                <IncidentNotificationWidget />
            )}

            {/* Section 8 & 9: Safety + Health Performance — 1 row */}
            {(widgetSettings['widget_safety_performance_chart'] !== "false" || widgetSettings['widget_health_performance_chart'] !== "false") && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    {widgetSettings['widget_safety_performance_chart'] !== "false" && (
                        <SafetyPerformanceWidget />
                    )}
                    {widgetSettings['widget_health_performance_chart'] !== "false" && (
                        <HealthPerformanceWidget />
                    )}
                </div>
            )}

            {/* Section 10: Production MTD Widget */}
            {widgetSettings['widget_production_mtd'] !== "false" && (
                <ProductionMtdWidget />
            )}

            {/* Section 11: Production YTD Widget */}
            {widgetSettings['widget_production_ytd_chart'] !== "false" && (
                <ProductionYtdWidget />
            )}

            {/* Section 12: News & Update */}
            {widgetSettings['widget_news_update'] !== "false" && (
                <NewsUpdate newsItems={newsItems} loading={loading} />
            )}

        </DashboardLayout>
    );
}
