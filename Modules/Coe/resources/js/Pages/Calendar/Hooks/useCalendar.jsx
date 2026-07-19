import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useCalendar() {
    // Current date states
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Data states
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fetch filters & events
    const fetchFilters = async () => {
        try {
            const res = await axios.get('/api/coe/categories');
            setCategories(res.data?.result || []);
        } catch (e) {
            console.error('Failed to fetch categories', e);
        }
    };

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/coe/events', {
                params: {
                    category_id: filterCategory,
                    search: searchQuery
                }
            });
            setEvents(res.data?.result || []);
        } catch (e) {
            console.error('Failed to fetch events', e);
        } finally {
            setLoading(false);
        }
    }, [filterCategory, searchQuery]);

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Calendar Grid Calculations
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const calendarCells = [];

    // Pad previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const day = prevMonthTotalDays - i;
        calendarCells.push({
            day,
            month: month === 0 ? 11 : month - 1,
            year: month === 0 ? year - 1 : year,
            isCurrentMonth: false
        });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        calendarCells.push({
            day: i,
            month,
            year,
            isCurrentMonth: true
        });
    }

    // Pad next month days to complete weekly grid (multiples of 7)
    const remainingCells = 42 - calendarCells.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarCells.push({
            day: i,
            month: month === 11 ? 0 : month + 1,
            year: month === 11 ? year + 1 : year,
            isCurrentMonth: false
        });
    }

    // Helper: matches events to a date
    const getEventsForDate = (cellDate) => {
        return events.filter(event => {
            const eventDate = new Date(event.start_date);
            return eventDate.getDate() === cellDate.day &&
                   eventDate.getMonth() === cellDate.month &&
                   eventDate.getFullYear() === cellDate.year;
        });
    };

    // Controls
    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return {
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
    };
}
