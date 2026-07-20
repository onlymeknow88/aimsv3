import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SlideShow({
    currentSlide,
    slides,
    activeSlide,
    setActiveSlide,
    prevSlide,
    nextSlide,
    setPreviewVideo,
    loading
}) {
    if (loading) {
        return (
            <div className="slideshow-card" style={{
                position: 'relative',
                borderRadius: '16px',
                padding: '40px',
                background: 'linear-gradient(135deg, #10233f 0%, #153b73 100%)',
                boxShadow: 'var(--shadow-premium)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '500px',
                animation: 'pulse 1.8s infinite ease-in-out'
            }}>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.9; }
                        50% { opacity: 0.55; }
                    }
                    @media (max-width: 768px) {
                        .slideshow-card {
                            height: 240px !important;
                            padding: 20px !important;
                        }
                        .slideshow-title {
                            font-size: 16px !important;
                        }
                        .slideshow-desc {
                            font-size: 11px !important;
                        }
                        .slideshow-content {
                            max-width: 100% !important;
                        }
                    }
                `}</style>
                <div className="slideshow-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '65%' }}>
                    <div style={{ height: '32px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', width: '80%' }} />
                    <div style={{ height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', width: '50%' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
                    <div style={{ width: '20px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="slideshow-card" style={{
            position: 'relative',
            borderRadius: '16px',
            padding: '40px',
            background: 'linear-gradient(135deg, #10233f 0%, #153b73 100%)',
            color: '#fff',
            boxShadow: 'var(--shadow-premium)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '500px'
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .slideshow-card {
                        height: 240px !important;
                        padding: 20px !important;
                    }
                    .slideshow-title {
                        font-size: 16px !important;
                    }
                    .slideshow-desc {
                        font-size: 11px !important;
                    }
                    .slideshow-content {
                        max-width: 100% !important;
                    }
                }
            `}</style>

            {/* Video Background (Plays inline) */}
            {currentSlide.blob_url ? (
                <video
                    key={currentSlide.id}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1
                    }}
                >
                    <source src={currentSlide.blob_url} type="video/mp4" />
                </video>
            ) : (
                <div style={{ position: 'absolute', right: 0, bottom: 0, top: 0, width: '45%', backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, borderLeft: '1px solid rgba(255,255,255,0.05)', zIndex: 1 }} />
            )}

            {/* Dark overlay for readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(16, 35, 63, 0.9) 0%, rgba(16, 35, 63, 0.65) 50%, rgba(16, 35, 63, 0.2) 100%)',
                zIndex: 2
            }} />

            <div className="slideshow-content" style={{ maxWidth: '65%', position: 'relative', zIndex: 3 }}>
                <h2 className="slideshow-title" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>{currentSlide.name}</h2>
                <p className="slideshow-desc" style={{ fontSize: '13.5px', color: '#FF8C24', fontWeight: 700, margin: 0 }}>{currentSlide.description}</p>
            </div>

            {/* Slideshow pagination dots */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '16px', zIndex: 3 }}>
                {slides.map((_, idx) => (
                    <span
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        style={{
                            width: activeSlide === idx ? '20px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            backgroundColor: activeSlide === idx ? '#FF8C24' : 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* Left/Right controls */}
            <div style={{ position: 'absolute', right: '20px', bottom: '20px', display: 'flex', gap: '8px', zIndex: 3 }}>
                <button type="button" onClick={prevSlide} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={14} /></button>
                <button type="button" onClick={nextSlide} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={14} /></button>
            </div>
        </div>
    );
}
