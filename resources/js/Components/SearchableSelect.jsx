import { ChevronDown, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DebouncedInput } from '@/lib/utils';

export default function SearchableSelect({ options = [], value, onChange, placeholder = 'Pilih opsi...', isMulti = false, portal = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);
    const uniqueIdRef = useRef(`portal-${Math.random().toString(36).substr(2, 9)}`);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const portalEl = document.getElementById(uniqueIdRef.current);
            if (
                containerRef.current && 
                !containerRef.current.contains(event.target) &&
                (!portalEl || !portalEl.contains(event.target))
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update coordinates when dropdown is open and portal is true
    useEffect(() => {
        if (isOpen && portal && containerRef.current) {
            const updateCoords = () => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            };
            updateCoords();
            // Recalculate on window resize or scroll
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
            return () => {
                window.removeEventListener('resize', updateCoords);
                window.removeEventListener('scroll', updateCoords, true);
            };
        }
    }, [isOpen, portal]);

    const filteredOptions = options.filter(opt =>
        opt.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('SearchableSelect Debug:', { portal, searchQuery, optionsCount: options.length, filteredCount: filteredOptions.length, firstFiltered: filteredOptions[0] });
    const handleSelect = (opt) => {
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(opt.id)) {
                onChange(currentValues.filter(id => id !== opt.id));
            } else {
                onChange([...currentValues, opt.id]);
            }
        } else {
            onChange(opt.id);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    const isSelected = (optId) => {
        if (isMulti) {
            return Array.isArray(value) && value.includes(optId);
        }
        return value === optId;
    };

    const getDisplayLabel = () => {
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.length === 0) return placeholder;
            return `${currentValues.length} Orang Terpilih`;
        }
        const selected = options.find(opt => opt.id === value);
        return selected ? selected.name : placeholder;
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {/* Display value box */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    userSelect: 'none',
                    minHeight: '42px'
                }}
            >
                <span style={{ color: (isMulti ? (Array.isArray(value) && value.length > 0) : value) ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: (isMulti ? (Array.isArray(value) && value.length > 0) : value) ? 600 : 400 }}>
                    {getDisplayLabel()}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {/* Dropdown panel */}
            {isOpen && (() => {
                const dropdownEl = (
                    <div 
                        id={uniqueIdRef.current}
                        className={portal ? 'searchable-select-portal-dropdown' : ''}
                        style={{
                            position: 'absolute',
                            top: portal ? `${coords.top}px` : 'calc(100% + 4px)',
                            left: portal ? `${coords.left}px` : 0,
                            width: portal ? `${coords.width}px` : '100%',
                            backgroundColor: '#fff',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: portal ? 99999 : 200,
                            padding: '9px',
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Search Input inside dropdown */}
                        <div style={{ position: 'relative', marginBottom: '8px' }}>
                            <Search size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-muted)' }} />
                            <DebouncedInput
                                type="text"
                                value={searchQuery}
                                onChange={val => setSearchQuery(val)}
                                debounce={300}
                                placeholder="Cari..."
                                style={{
                                    width: '100%',
                                    padding: '6px 8px 6px 26px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {searchQuery && (
                                <X
                                    size={12}
                                    onClick={() => setSearchQuery('')}
                                    style={{ position: 'absolute', right: '8px', top: '9px', color: 'var(--text-muted)', cursor: 'pointer' }}
                                />
                            )}
                        </div>

                        {/* Options list container */}
                        <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, idx) => {
                                    const selected = isSelected(opt.id);
                                    return (
                                        <div
                                            key={`${opt.id}-${idx}`}
                                            onClick={() => handleSelect(opt)}
                                            style={{
                                                padding: '8px 10px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                color: 'var(--text-primary)',
                                                cursor: 'pointer',
                                                backgroundColor: selected ? 'rgba(21, 59, 115, 0.06)' : 'transparent',
                                                fontWeight: selected ? 700 : 400,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(21, 59, 115, 0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = selected ? 'rgba(21, 59, 115, 0.06)' : 'transparent'}
                                        >
                                            <span>{opt.name} {opt.email ? `(${opt.email})` : ''}</span>
                                            {isMulti && selected && (
                                                <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 800 }}>✓</span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    Opsi tidak ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                );

                if (portal) {
                    return createPortal(dropdownEl, document.body);
                }
                return dropdownEl;
            })()}

            {/* Selected badges display for Multi-Select */}
            {isMulti && Array.isArray(value) && value.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {value.map(id => {
                        const opt = options.find(o => o.id === id);
                        if (!opt) return null;
                        return (
                            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(21, 59, 115, 0.06)', border: '1px solid rgba(21, 59, 115, 0.2)', borderRadius: '100px', padding: '3px 10px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                                {opt.name}
                                <X size={10} style={{ cursor: 'pointer' }} onClick={() => handleSelect(opt)} />
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
