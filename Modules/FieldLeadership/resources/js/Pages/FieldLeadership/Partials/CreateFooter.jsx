import { Save, Send } from 'lucide-react';

import React from 'react';

export default function CreateFooter({ isEdit, submitting, handleSubmit }) {
    const btnBase = {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '10px 20px', borderRadius: '8px',
        fontSize: '12px', fontWeight: 700,
        cursor: submitting ? 'not-allowed' : 'pointer',
        opacity: submitting ? 0.7 : 1,
        transition: 'opacity 0.15s',
    };

    return (
        <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px',
            display: 'flex', justifyContent: 'flex-end',
            alignItems: 'center', gap: '12px',
            flexWrap: 'wrap',
        }}>
            <a
                href="/field-leadership"
                style={{
                    display: 'inline-flex', alignItems: 'center',
                    height: '40px', padding: '0 20px',
                    border: '1px solid var(--border-color)', borderRadius: '8px',
                    textDecoration: 'none', color: 'var(--text-secondary)',
                    fontSize: '12px', fontWeight: 600,
                }}
            >
                Batal
            </a>

            <button
                type="button"
                onClick={() => handleSubmit('Draft')}
                disabled={submitting}
                style={{
                    height: '40px', padding: '0 20px',
                    backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px',
                    color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
            >
                <Save size={13} />
                {submitting ? 'Menyimpan...' : 'Simpan Draft'}
            </button>

            <button
                type="button"
                onClick={() => handleSubmit('Publish')}
                disabled={submitting}
                style={{
                    height: '40px', padding: '0 24px',
                    backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px',
                    color: '#fff', fontSize: '12px', fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
            >
                <Send size={13} />
                {submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Submit for Review')}
            </button>
        </div>
    );
}
