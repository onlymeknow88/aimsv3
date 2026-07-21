import React from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function CreateHeader({ isEdit, limitParam }) {
    return (
        <>
            <Head title={isEdit ? 'Edit Field Leadership' : 'Buat Field Leadership Baru'} />

            {/* Back + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <a
                    href="/field-leadership/observations"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '32px', height: '32px', borderRadius: '8px',
                        border: '1px solid var(--border-color)', backgroundColor: '#fff',
                        color: 'var(--text-primary)', textDecoration: 'none', flexShrink: 0,
                    }}
                >
                    <ArrowLeft size={16} />
                </a>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                        {isEdit ? 'Edit Field Leadership' : 'Buat Field Leadership Baru'}
                    </h1>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                        {isEdit ? 'Ubah data Field Leadership yang sudah ada' : 'Tambah Field Leadership baru'}
                    </p>
                </div>
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
