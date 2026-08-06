import React from 'react';
import { ChevronLeft, ChevronRight, Search, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import useCalendar from '../Hooks/useCalendar';
import CalendarModal from './CalendarModal';
import CoeLayout from '../../../Layouts/CoeLayout';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
};

const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
};

const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function CalendarView() {
    const {
        currentDate,
        year,
        month,
        categories,
        events,
        loading,
        filterCategory,
        setFilterCategory,
        searchQuery,
        setSearchQuery,
        selectedEvent,
        setSelectedEvent,
        calendarCells,
        getEventsForDate,
        handlePrevMonth,
        handleNextMonth,
        handleToday,
        fetchEvents,
    } = useCalendar();

    const calendarRef = React.useRef(null);

    // Sync external currentDate state to FullCalendar view
    React.useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(currentDate);
        }
    }, [currentDate]);

    // Format events for FullCalendar
    const formattedEvents = React.useMemo(() => {
        return events.map(ev => {
            let endDate = null;
            if (ev.end_date) {
                // Add 1 day to end_date to make it inclusive in FullCalendar's exclusive dayGridMonth view
                const d = new Date(ev.end_date);
                d.setDate(d.getDate() + 1);
                endDate = d.toISOString().split('T')[0];
            }
            const color = ev.category?.color || '#3b82f6';
            return {
                id: ev.id,
                title: ev.title,
                start: ev.start_date ? ev.start_date.split(' ')[0] : null,
                end: endDate,
                backgroundColor: color,
                borderColor: color,
                textColor: '#fff',
                extendedProps: {
                    originalEvent: ev
                }
            };
        });
    }, [events]);

    return (
        <CoeLayout>
            <Head title="Calendar of Event" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Calendar of Event</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Tinjauan agenda, rapat koordinasi, dan agenda penting Center of Excellence.</p>
            </div>

            {/* Filters Bar */}
            <div style={{ ...cardStyle, marginBottom: '20px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search Input */}
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari nama agenda..."
                                style={{ ...inputStyle, paddingLeft: '34px', width: '220px' }}
                            />
                        </div>

                        {/* Category Dropdown */}
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            style={{ ...inputStyle, width: '180px' }}
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <button
                            onClick={fetchEvents}
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

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleToday}
                            style={{
                                padding: '9px 16px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                backgroundColor: '#fff',
                                color: '#334155',
                                cursor: 'pointer'
                            }}
                        >
                            Hari Ini
                        </button>
                        <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                            <button
                                onClick={handlePrevMonth}
                                style={{ padding: '8px 12px', backgroundColor: '#fff', border: 'none', borderRight: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                style={{ padding: '8px 12px', backgroundColor: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Legends */}
                {categories.length > 0 && (
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Legenda Kategori:</span>
                        {categories.map(cat => (
                            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: cat.color || '#e2e8f0' }} />
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Monthly Calendar View */}
            <div style={{ ...cardStyle, padding: '24px' }}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={false}
                    events={formattedEvents}
                    height="auto"
                    eventClick={(info) => {
                        setSelectedEvent(info.event.extendedProps.originalEvent);
                    }}
                />
                
                <style>{`
                    .fc {
                        font-family: inherit;
                    }
                    .fc-scrollgrid {
                        border: 1px solid #e2e8f0 !important;
                        border-radius: 12px !important;
                        overflow: hidden !important;
                    }
                    .fc-col-header-cell {
                        background-color: #f8fafc !important;
                        padding: 12px 0 !important;
                        border: 1px solid #e2e8f0 !important;
                    }
                    .fc-col-header-cell-cushion {
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        text-transform: uppercase !important;
                        color: #475569 !important;
                        text-decoration: none !important;
                        letter-spacing: 0.5px;
                    }
                    .fc-day {
                        border: 1px solid #e2e8f0 !important;
                    }
                    .fc-day-other {
                        background-color: #f8fafc !important;
                        opacity: 0.6;
                    }
                    .fc-daygrid-day-number {
                        font-size: 12px !important;
                        font-weight: 700 !important;
                        color: #475569 !important;
                        text-decoration: none !important;
                        padding: 8px 10px !important;
                    }
                    .fc-daygrid-day.fc-day-today {
                        background-color: #f1f5f9 !important;
                    }
                    .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                        color: var(--primary) !important;
                        font-weight: 800 !important;
                    }
                    .fc-event {
                        cursor: pointer !important;
                        border-radius: 6px !important;
                        padding: 4px 8px !important;
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        border: none !important;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
                        margin: 2px 4px !important;
                        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
                    }
                    .fc-event:hover {
                        transform: translateY(-0.5px) !important;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
                        filter: brightness(0.95) !important;
                    }
                    .fc-event-title {
                        font-weight: 700 !important;
                        color: #fff !important;
                    }
                `}</style>
            </div>

            <CalendarModal
                selectedEvent={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </CoeLayout>
    );
}
