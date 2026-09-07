import { Calendar, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AVAILABLE_MONTHS, AVAILABLE_YEARS, useDashboardFilter } from '@/Context/DashboardFilterContext';

const SECTION_STYLE = {
    marginBottom: '20px',
};

const SECTION_TITLE_STYLE = {
    fontSize: '11px', fontWeight: 700, color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px',
};

function CheckItem({ label, checked, onChange, accent = '#153B73', id }) {
    return (
        <label htmlFor={id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 0', cursor: 'pointer',
            borderBottom: '1px solid #f8fafc',
            minHeight: '44px',
        }}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                aria-checked={checked}
                style={{ width: '18px', height: '18px', accentColor: accent, cursor: 'pointer', flexShrink: 0 }}
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
    const dialogRef = useRef(null);
    const closeBtnRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Sync local state saat modal dibuka + focus management
    useEffect(() => {
        if (filterModalOpen) {
            previousFocusRef.current = document.activeElement;
            setLocalYears(selectedYears);
            setLocalMonths(selectedMonths);
            // focus close button after mount
            setTimeout(() => closeBtnRef.current?.focus(), 0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // restore focus
            if (previousFocusRef.current && previousFocusRef.current.focus) {
                previousFocusRef.current.focus();
            }
        }
        return () => { document.body.style.overflow = ''; };
    }, [filterModalOpen, selectedYears, selectedMonths]);

    // ESC + focus trap
    useEffect(() => {
        if (!filterModalOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setFilterModalOpen(false);
            }
            if (e.key === 'Tab' && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [filterModalOpen, setFilterModalOpen]);

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
            role="presentation"
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
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-modal-title"
                aria-describedby="filter-modal-desc"
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: 'var(--card-bg)',
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
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SlidersHorizontal size={15} color="#153B73" />
                        </div>
                        <h2 id="filter-modal-title" style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Filter Dashboard</h2>
                    </div>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        aria-label="Tutup filter"
                        onClick={() => setFilterModalOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '44px', minHeight: '44px', borderRadius: '8px' }}>
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                {/* Body — scrollable */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    <p id="filter-modal-desc" className="sr-only">Pilih bulan dan tahun untuk memfilter data dashboard. Minimal satu bulan dan satu tahun harus dipilih.</p>

                    {/* Section: Bulan */}
                    <fieldset style={{ ...SECTION_STYLE, border: 'none', padding: 0, margin: '0 0 20px 0' }}>
                        <legend style={{ ...SECTION_TITLE_STYLE, float: 'none', width: '100%' }}>
                            <Calendar size={13} color="#153B73" aria-hidden="true" /> Pilih Bulan
                        </legend>
                        {visibleMonths.map(m => (
                            <CheckItem
                                key={m.value}
                                id={`filter-month-${m.value}`}
                                label={m.label}
                                checked={localMonths.includes(m.value)}
                                onChange={() => toggleMonth(m.value)}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={() => setShowAllMonths(v => !v)}
                            aria-expanded={showAllMonths}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF8C24', fontSize: '12px', fontWeight: 600, padding: '12px 0', marginTop: '4px', minHeight: '44px' }}
                        >
                            {showAllMonths ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Semua Bulan'}
                        </button>
                    </fieldset>

                    {/* Section: Tahun */}
                    <fieldset style={{ ...SECTION_STYLE, border: 'none', padding: 0, margin: 0 }}>
                        <legend style={{ ...SECTION_TITLE_STYLE, float: 'none', width: '100%' }}>
                            <Calendar size={13} color="#153B73" aria-hidden="true" /> Pilih Tahun
                        </legend>
                        {AVAILABLE_YEARS.map(year => (
                            <CheckItem
                                key={year}
                                id={`filter-year-${year}`}
                                label={year === currentYear ? `${year} (Berjalan)` : String(year)}
                                checked={localYears.includes(year)}
                                onChange={() => toggleYear(year)}
                            />
                        ))}
                    </fieldset>

                </div>

                {/* Footer */}
                <div style={{
                    padding: '14px 20px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                    flexShrink: 0,
                }}>
                    <button type="button" onClick={handleReset}
                        aria-label="Reset filter ke tahun dan bulan berjalan"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', minHeight: '44px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        <RotateCcw size={13} aria-hidden="true" /> Reset
                    </button>
                    <button type="button" onClick={handleApply}
                        aria-label="Terapkan filter yang dipilih"
                        style={{ padding: '10px 28px', minHeight: '44px', backgroundColor: '#FF8C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
