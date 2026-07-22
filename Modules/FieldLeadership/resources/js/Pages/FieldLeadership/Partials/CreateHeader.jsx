import { AlertTriangle, ArrowLeft } from 'lucide-react';

import { Head } from '@inertiajs/react';
import React from 'react';

export default function CreateHeader({ isEdit, limitParam }) {
    return (
        <>
            <Head title={isEdit ? 'Edit Field Leadership' : 'Buat Field Leadership Baru'} />

            {/* Back navigation — same style as Maker/Create.jsx */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '24px', borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px', maxWidth: '1100px', margin: '0 auto 24px auto',
            }}>
                <a
                    href="/field-leadership"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px',
                    }}
                >
                    <ArrowLeft size={16} /> Kembali ke Field Leadership
                </a>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {isEdit ? 'Siklus Pembaharuan Field Leadership' : 'Siklus Pembuatan Field Leadership Baru'}
                </span>
            </div>

            {/* Warning: limit parameter not set */}
            {!limitParam && (
                <div style={{
                    backgroundColor: '#fef2f2', border: '1px solid #fca5a5',
                    borderRadius: '8px', padding: '14px 16px', marginBottom: '24px',
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                    <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '1px' }} />
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b', margin: '0 0 2px 0' }}>
                            Limit Parameter Belum Diatur!
                        </p>
                        <p style={{ fontSize: '12px', color: '#7f1d1d', margin: 0 }}>
                            Atur Limit Parameter di menu{' '}
                            <strong>Master Library › Limit Parameter</strong>{' '}
                            agar form ini berfungsi dengan benar.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
