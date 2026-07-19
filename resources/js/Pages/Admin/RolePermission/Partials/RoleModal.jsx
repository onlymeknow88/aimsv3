import React from 'react';
import { Shield, Pencil, X } from 'lucide-react';

export default function RoleModal({
    isOpen,
    onClose,
    onSubmit,
    name,
    setName,
    slug,
    setSlug,
    title = 'Tambah Role Baru',
    buttonText = 'Simpan Role',
    makeSlug,
}) {
    if (!isOpen) return null;

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (makeSlug) {
            setSlug(makeSlug(val));
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)' }}>
                {/* Modal Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={15} style={{ color: '#fff' }} />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '6px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={onSubmit}>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                Nama Role <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Contoh: Admin Safety"
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                Slug Role <span style={{ color: '#ef4444' }}>*</span>
                                <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '6px' }}>(auto dari nama)</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                placeholder="Contoh: admin_safety"
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'ui-monospace, monospace', outline: 'none', boxSizing: 'border-box', color: '#475569', transition: 'border-color 0.15s' }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fafafa' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(21,59,115,0.25)' }}
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
