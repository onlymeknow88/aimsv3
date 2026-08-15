import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const DashboardFilterContext = createContext(null);

const STORAGE_KEY_YEARS  = 'dashboard_filter_years';
const STORAGE_KEY_MONTHS = 'dashboard_filter_months';
const CURRENT_YEAR  = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1; // 1-12

export const AVAILABLE_YEARS  = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i);
export const AVAILABLE_MONTHS = [
    { value: 1,  label: 'Januari' },
    { value: 2,  label: 'Februari' },
    { value: 3,  label: 'Maret' },
    { value: 4,  label: 'April' },
    { value: 5,  label: 'Mei' },
    { value: 6,  label: 'Juni' },
    { value: 7,  label: 'Juli' },
    { value: 8,  label: 'Agustus' },
    { value: 9,  label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

function loadFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch {}
    return fallback;
}

export function DashboardFilterProvider({ children }) {
    const [selectedYears,  setSelectedYears]  = useState(() => loadFromStorage(STORAGE_KEY_YEARS,  [CURRENT_YEAR]));
    const [selectedMonths, setSelectedMonths] = useState(() => loadFromStorage(STORAGE_KEY_MONTHS, [CURRENT_MONTH]));
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_YEARS, JSON.stringify(selectedYears));
    }, [selectedYears]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(selectedMonths));
    }, [selectedMonths]);

    const resetFilters = useCallback(() => {
        setSelectedYears([CURRENT_YEAR]);
        setSelectedMonths([CURRENT_MONTH]);
        localStorage.removeItem(STORAGE_KEY_YEARS);
        localStorage.removeItem(STORAGE_KEY_MONTHS);
    }, []);

    const filters = { years: selectedYears, months: selectedMonths };

    return (
        <DashboardFilterContext.Provider value={{
            filters,
            selectedYears,  setSelectedYears,
            selectedMonths, setSelectedMonths,
            availableYears:  AVAILABLE_YEARS,
            availableMonths: AVAILABLE_MONTHS,
            currentYear:  CURRENT_YEAR,
            currentMonth: CURRENT_MONTH,
            filterModalOpen, setFilterModalOpen,
            resetFilters,
        }}>
            {children}
        </DashboardFilterContext.Provider>
    );
}

export function useDashboardFilter() {
    const ctx = useContext(DashboardFilterContext);
    if (!ctx) throw new Error('useDashboardFilter must be used within DashboardFilterProvider');
    return ctx;
}
