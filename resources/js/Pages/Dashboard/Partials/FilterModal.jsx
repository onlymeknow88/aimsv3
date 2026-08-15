import { Calendar, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AVAILABLE_MONTHS, AVAILABLE_YEARS, useDashboardFilter } from '@/Context/DashboardFilterContext';

const SECTION_STYLE = {
    marginBottom: '20px',
};

const SECTION_TITLE_STYLE = {
    fontSize: '11px', fontWeight: 700, color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px',
};

function CheckItem({ label, checked, onChange, accent = '#153B73' }) {
    return (
        <label style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '7px 0', cursor: 'pointer',
            borderBottom: '1px solid #f8fafc',
        }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{ width: '15px', height: '15px', accentColor: accent, cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ fontSize: '13px', color: checked ? '#0f172a' : '#475569', fontWeight: checked ? 600 : 400 }}>
                {label}
            </span>
        </label>
    );
}

export default function FilterModal() {
    const {
        filterModalOpen, setFilterModalOpen,
        selectedYears,  setSelectedYears,
        selectedMonths, setSelectedMonths,
        resetFilters,
        currentYear, currentMonth,
    } = useDashboardFilter();

    const [localYears,  setLocalYears]  = useState(selectedYears);
    const [localMonths, setLocalMonths] = useState(selectedMonths);
    const [showAllMonths, setShowAllMonths] = useState(false);

    // Sync local state saat modal dibuka
    useEffect(() => {
        if (filterModalOpen) {
            setLocalYears(selectedYears);
            setLocalMonths(selectedMonths);
        }
    }, [filterModalOpen]);

    const toggleYear = (year) => {
        setLocalYears(prev =>
            prev.includes(year)
                ? prev.length > 1 ? prev.filter(y => y !== year) : prev
                : [...prev, year].sort((a, b) => b - a)
        );
    };

    const toggleMonth = (month) => {
        setLocalMonths(prev =>
            prev.includes(month)
                ? prev.length > 1 ? prev.filter(m => m !== month) : prev
                : [...prev, month].sort((a, b) => a - b)
        );
    };

    const handleApply = () => {
        setSelectedYears(localYears);
        setSelectedMonths(localMonths);
        setFilterModalOpen(false);
    };

    const handleReset = () => {
        resetFilters();
        setLocalYears([currentYear]);
        setLocalMonths([currentMonth]);
        setFilterModalOpen(false);
    };

    if (!filterModalOpen) return null;

    const visibleMonths = showAllMonths ? AVAILABLE_MONTHS : AVAILABLE_MONTHS.slice(0, 3);

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1200, padding: '16px',
            }}
            onClick={() => setFilterModalOpen(false)}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    width: '100%', maxWidth: '400px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                    overflow: 'hidden',
                    maxHeight: '85vh',
                    display: 'flex', flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SlidersHorizontal size={15} color="#153B73" />
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Filter Dashboard</h3>
                    </div>
                    <button onClick={() => setFilterModalOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body — scrollable */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>

                    {/* Section: Bulan */}
                    <div style={SECTION_STYLE}>
                        <div style={SECTION_TITLE_STYLE}>
                            <Calendar size={13} color="#153B73" /> Pilih Bulan
                        </div>
                        {visibleMonths.map(m => (
                            <CheckItem
                                key={m.value}
                                label={m.label}
                                checked={localMonths.includes(m.value)}
                                onChange={() => toggleMonth(m.value)}
                            />
                        ))}
                        <button
                            onClick={() => setShowAllMonths(v => !v)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF8C24', fontSize: '12px', fontWeight: 600, padding: '6px 0', marginTop: '4px' }}
                        >
                            {showAllMonths ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Semua Bulan'}
                        </button>
                    </div>

                    {/* Section: Tahun */}
                    <div style={SECTION_STYLE}>
                        <div style={SECTION_TITLE_STYLE}>
                            <Calendar size={13} color="#153B73" /> Pilih Tahun
                        </div>
                        {AVAILABLE_YEARS.map(year => (
                            <CheckItem
                                key={year}
                                label={year === currentYear ? `${year} (Berjalan)` : String(year)}
                                checked={localYears.includes(year)}
                                onChange={() => toggleYear(year)}
                            />
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    padding: '14px 20px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                    flexShrink: 0,
                }}>
                    <button onClick={handleReset}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        <RotateCcw size={13} /> Reset
                    </button>
                    <button onClick={handleApply}
                        style={{ padding: '9px 28px', backgroundColor: '#FF8C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
