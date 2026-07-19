import React from 'react';
import { ChevronLeft, ChevronRight, Search, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import useCalendar from '../Hooks/useCalendar';
import CalendarModal from './CalendarModal';
import CoeLayout from '../../../Layouts/CoeLayout';
import { Head } from '@inertiajs/react';

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
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                {/* Month Name Banner */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc' }}>
                    <CalendarIcon size={18} color="var(--primary)" />
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {MONTH_NAMES[month]} {year}
                    </h2>
                </div>

                {/* Day Header Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    {DAY_NAMES.map((d, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '12px 10px',
                                textAlign: 'center',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: index === 0 ? '#ef4444' : '#475569',
                                borderRight: index < 6 ? '1px solid #e2e8f0' : 'none'
                            }}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#e2e8f0', gap: '1px' }}>
                    {calendarCells.map((cell, idx) => {
                        const cellEvents = getEventsForDate(cell);
                        const isToday = new Date().getDate() === cell.day &&
                                        new Date().getMonth() === cell.month &&
                                        new Date().getFullYear() === cell.year;

                        return (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: cell.isCurrentMonth ? '#fff' : '#f8fafc',
                                    minHeight: '120px',
                                    padding: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                }}
                            >
                                {/* Date Number */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: isToday ? 800 : 600,
                                            color: isToday ? '#fff' : (cell.isCurrentMonth ? '#0f172a' : '#94a3b8'),
                                            backgroundColor: isToday ? 'var(--primary)' : 'transparent',
                                            width: isToday ? '22px' : 'auto',
                                            height: isToday ? '22px' : 'auto',
                                            borderRadius: isToday ? '50%' : 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {cell.day}
                                    </span>
                                </div>

                                {/* Events List on this Date */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1, overflowY: 'auto' }}>
                                    {cellEvents.map(ev => (
                                        <div
                                            key={ev.id}
                                            onClick={() => setSelectedEvent(ev)}
                                            style={{
                                                backgroundColor: ev.category?.color || '#3b82f6',
                                                color: '#fff',
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                            title={ev.title}
                                        >
                                            {ev.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <CalendarModal
                selectedEvent={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </CoeLayout>
    );
}
