import React from 'react';
import { Save, Send } from 'lucide-react';

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
            display: 'flex', justifyContent: 'flex-end',
            alignItems: 'center', gap: '10px',
            paddingBottom: '48px', flexWrap: 'wrap',
        }}>
            <a
                href="/field-leadership/observations"
                style={{
                    ...btnBase,
                    backgroundColor: '#fff',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                }}
            >
                Batal
            </a>

            <button
                type="button"
                onClick={() => handleSubmit('Draft')}
                disabled={submitting}
                style={{
                    ...btnBase,
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
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
                    ...btnBase,
                    backgroundColor: 'var(--primary)',
                    border: 'none',
                    color: '#fff',
                }}
            >
                <Send size={13} />
                {submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Submit for Review')}
            </button>
        </div>
    );
}