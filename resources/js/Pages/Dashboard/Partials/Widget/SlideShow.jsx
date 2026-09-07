import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react';

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
    // Keyboard navigation for slideshow when focused
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    };

    if (loading) {
        return (
            <div className="slideshow-card skeleton-dashboard" aria-busy="true" aria-label="Memuat slideshow" style={{
                position: 'relative',
                borderRadius: '16px',
                padding: '40px',
                background: 'linear-gradient(25deg, #098192 0%, #06495B 41%, #023952 100%)',
                boxShadow: 'var(--shadow-premium)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '500px',
            }}>
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
        <section
            className="slideshow-card"
            aria-label="Slideshow sambutan"
            aria-roledescription="carousel"
            aria-live="polite"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                position: 'relative',
                borderRadius: '16px',
                padding: '40px',
                background: 'linear-gradient(25deg, #098192 0%, #06495B 41%, #023952 100%)',
                color: '#fff',
                boxShadow: 'var(--shadow-premium)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '500px',
                outline: 'none',
            }}>

            {/* Media Background (Image or Video) */}
            {currentSlide.blob_url ? (
                /\.(jpg|jpeg|png|webp)$/i.test(currentSlide.attc || currentSlide.blob_url || '') ? (
                    <img
                        key={currentSlide.id}
                        src={currentSlide.blob_url}
                        alt={currentSlide.name || 'Slideshow AIMS'}
                        loading="eager"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1
                        }}
                    />
                ) : (
                    <video
                        key={currentSlide.id}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/images/Alamtri Geo Monochrome - Full Color.png"
                        aria-label={currentSlide.name || 'Video slideshow'}
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
                )
            ) : (
                <div className="slideshow-fallback" aria-hidden="true" style={{ position: 'absolute', right: '40px', bottom: '40px', top: '40px', width: '35%', backgroundImage: 'url("/images/Alamtri Geo Monochrome - Full Color.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 1, zIndex: 3 }} />
            )}

            {/* Dark overlay for readability */}
            <div aria-hidden="true" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(2, 57, 82, 0.9) 0%, rgba(2, 57, 82, 0.55) 50%, rgba(2, 57, 82, 0) 100%)',
                zIndex: 2
            }} />

            <div className="slideshow-content" style={{ maxWidth: '65%', position: 'relative', zIndex: 3 }}>
                <h2 className="slideshow-title" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>{currentSlide.name}</h2>
                <p className="slideshow-desc" style={{ fontSize: '13.5px', color: '#FF8C24', fontWeight: 700, margin: 0 }}>{currentSlide.description}</p>
            </div>

            {/* Slideshow pagination dots — accessible buttons */}
            <div role="tablist" aria-label="Pilih slide" style={{ display: 'flex', gap: '8px', marginTop: '16px', zIndex: 3 }}>
                {slides.map((slide, idx) => (
                    <button
                        key={idx}
                        type="button"
                        role="tab"
                        aria-selected={activeSlide === idx}
                        aria-label={`Slide ${idx + 1} dari ${slides.length}: ${slide.name || ''}`}
                        onClick={() => setActiveSlide(idx)}
                        style={{
                            width: activeSlide === idx ? '28px' : '12px',
                            height: '12px',
                            borderRadius: '6px',
                            backgroundColor: activeSlide === idx ? '#FF8C24' : 'rgba(255,255,255,0.45)',
                            border: activeSlide === idx ? '2px solid #fff' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: 0,
                            minWidth: '44px',
                            minHeight: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // visual hit-area via padding-box, keep visual small but hit 44px
                            boxSizing: 'border-box',
                        }}
                    >
                        <span aria-hidden="true" style={{
                            display: 'block',
                            width: activeSlide === idx ? '20px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            backgroundColor: activeSlide === idx ? '#FF8C24' : 'rgba(255,255,255,0.7)',
                        }} />
                    </button>
                ))}
            </div>

            {/* Left/Right controls — 44px touch target */}
            <div style={{ position: 'absolute', right: '12px', bottom: '12px', display: 'flex', gap: '8px', zIndex: 3 }}>
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Slide sebelumnya"
                    style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(15, 23, 42, 0.55)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Slide berikutnya"
                    style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(15, 23, 42, 0.55)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            </div>
        </section>
    );
}
