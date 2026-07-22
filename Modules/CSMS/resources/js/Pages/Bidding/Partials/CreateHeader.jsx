import { ArrowLeft, HardHat } from 'lucide-react';

import React from 'react';

export default function CreateHeader({ isEdit }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px',
            flexWrap: 'wrap',
            gap: '10px',
        }}>
            <a
                href="/csms/bidding/lists"
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px',
                }}
            >
                <ArrowLeft size={16} /> Kembali ke Bidding
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <HardHat size={16} color="#fff" />
                </div>
                <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {isEdit ? 'Edit Bidding CSMS' : 'Tambah Bidding Baru'}
                    </h2>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                        {isEdit ? 'Perbarui data bidding (hanya status Draft)' : 'Isi data perusahaan kontraktor untuk pendaftaran CSMS'}
                    </p>
                </div>
            </div>
        </div>
    );
}
