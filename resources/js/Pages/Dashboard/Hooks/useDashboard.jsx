import { useEffect, useState } from 'react';

import axios from 'axios';

export default function useDashboard(initialEvents = [], initialSlideshows = []) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [coeEvents, setCoeEvents] = useState(initialEvents);
    const [slidesData, setSlidesData] = useState(initialSlideshows);
    const [generalStats, setGeneralStats] = useState(null);
    const [newsItems, setNewsItems] = useState([]);
    const [coeStats, setCoeStats] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // Fetch dashboard data + COE stats secara paralel
        Promise.all([
            axios.get('/api/dashboard/data'),
            axios.get('/api/dashboard/coe/stats'),
        ])
            .then(([dashRes, statsRes]) => {
                if (dashRes.data?.result) {
                    setCoeEvents(dashRes.data.result.coeEvents || []);
                    setSlidesData(dashRes.data.result.slideshows || []);
                    setGeneralStats(dashRes.data.result.generalStats || null);
                    setNewsItems(dashRes.data.result.newsItems || []);
                }
                if (statsRes.data?.result) {
                    setCoeStats(statsRes.data.result);
                }
            })
            .catch(err => {
                console.error('Failed to fetch dashboard data:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const slides = slidesData.length > 0 ? slidesData : [
        {
            id: 'default-1',
            name: 'Utamakan Keselamatan, Ciptakan Masa Depan Tanpa Kecelakaan Kerja',
            description: 'Alamtri Zero Accident Mindset (AZAM)',
            blob_url: null
        }
    ];

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const currentSlide = slides[activeSlide];

    return {
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
    };
}
