import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useDashboard(initialEvents = [], initialSlideshows = []) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [coeEvents, setCoeEvents] = useState(initialEvents);
    const [slidesData, setSlidesData] = useState(initialSlideshows);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/dashboard/data')
            .then(res => {
                if (res.data?.result) {
                    setCoeEvents(res.data.result.coeEvents || []);
                    setSlidesData(res.data.result.slideshows || []);
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
            description: 'Zero Incident • Zero Harm • Zero Compromise',
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
    };
}
