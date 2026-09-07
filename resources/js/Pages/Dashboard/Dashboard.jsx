import { Head } from '@inertiajs/react';

import CalendarOfEventStats from './Partials/Widget/CalendarOfEventStats';
import CalendarofEvent from './Partials/Widget/CalendarofEvent';
import CsmsWidget from './Partials/Widget/CSMS';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DashboardFilterProvider, useDashboardFilter } from '@/Context/DashboardFilterContext';
import FilterModal from './Partials/FilterModal';
import HealthPerformanceWidget from './Partials/Widget/HealthPerformanceWidget';
import IncidentNotificationWidget from './Partials/Widget/IncidentNotification';
import ProductionWidgets from './Partials/Widget/Production/ProductionWidgets';
import SafetyPerformanceWidget from './Partials/Widget/SafetyPerformanceWidget';
import DocumentSystemWidget from './Partials/Widget/DocumentSystem/DocumentSystemWidget';
import FieldLeadership from './Partials/Widget/FieldLeadership';
import NewsUpdate from './Partials/Widget/NewsUpdate';
import React from 'react';
import SafetyKPI from './Partials/Widget/SafetyKPI';
import SlideShow from './Partials/Widget/SlideShow';
import useDashboard from './Hooks/useDashboard';

import './dashboard-widgets.css';

export default function Dashboard({ coeEvents: initialEvents = [], slideshows: initialSlideshows = [], widgetSettings = {} }) {
    return (
        <DashboardFilterProvider>
            <DashboardInner
                initialEvents={initialEvents}
                initialSlideshows={initialSlideshows}
                widgetSettings={widgetSettings}
            />
        </DashboardFilterProvider>
    );
}

function DashboardInner({ initialEvents, initialSlideshows, widgetSettings }) {
    const { filters, setFilterModalOpen } = useDashboardFilter();
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
    } = useDashboard(initialEvents, initialSlideshows, filters);

    const isVisible = (key) => widgetSettings[key] !== "false";

    return (
        <DashboardLayout onFilterOpen={() => setFilterModalOpen(true)}>
            <Head title="AIMS Dashboard" />
            <h1 className="sr-only">Dashboard AIMS — Integrated Management System</h1>
            <FilterModal />

            {/* Section 1: KPI Cards — Safety Performance dari dashboard_general */}
            {isVisible('widget_safety_performance_chart') && (
                <SafetyKPI generalStats={generalStats} loading={loading} />
            )}

            {/* Section 2: Hero Area */}
            {((isVisible('widget_video_slide')) || isVisible('widget_calendar')) && (
                <div className="dashboard-grid-hero">
                    {/* Welcome Banner Slideshow Container */}
                    {isVisible('widget_video_slide') && (
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
                    {isVisible('widget_calendar') && (
                        <CalendarofEvent loading={loading} coeEvents={coeEvents} />
                    )}
                </div>
            )}

            {/* Section 3: Calendar of Event Stats */}
            {isVisible('widget_calendar_of_event_list') && (
                <CalendarOfEventStats stats={coeStats} loading={loading} coeEvents={coeEvents} />
            )}

            {/* Section 4: Document System Widget */}
            {isVisible('widget_ds') && (
                <DocumentSystemWidget filters={filters} />
            )}

            {/* Section 5: Field Leadership Widget */}
            {isVisible('widget_fls') && (
                <FieldLeadership filters={filters} />
            )}

            {/* Section 6: CSMS Widget */}
            {isVisible('widget_csms') && (
                <CsmsWidget filters={filters} />
            )}

            {/* Section 7: Incident Notification Widget */}
            {isVisible('widget_incident_notification') && (
                <IncidentNotificationWidget filters={filters} />
            )}

            {/* Section 8 & 9: Safety + Health Performance — stacked full-width (bukan 1 row) */}
            {isVisible('widget_safety_performance_chart') && (
                <div style={{ marginBottom: '24px' }}>
                    <SafetyPerformanceWidget filters={filters} />
                </div>
            )}
            {isVisible('widget_health_performance_chart') && (
                <div style={{ marginBottom: '32px' }}>
                    <HealthPerformanceWidget filters={filters} />
                </div>
            )}

            {/* Section 10 & 11: Production MTD + YTD — berbagi satu fetch */}
            {(isVisible('widget_production_mtd') || isVisible('widget_production_ytd_chart')) && (
                <ProductionWidgets
                    filters={filters}
                    showMtd={isVisible('widget_production_mtd')}
                    showYtd={isVisible('widget_production_ytd_chart')}
                />
            )}

            {/* Section 12: News & Update */}
            {isVisible('widget_news_update') && (
                <NewsUpdate newsItems={newsItems} loading={loading} />
            )}

        </DashboardLayout>
    );
}
