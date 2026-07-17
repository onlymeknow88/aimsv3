import React, { useState } from 'react';
import { X, Plus, Mail } from 'lucide-react';

export default function InvitedPeopleInput({ value = [], onChange }) {
    const [email, setEmail] = useState('');

    const addEmail = () => {
        if (!email || !email.includes('@')) return;
        if (!value.includes(email)) {
            onChange([...value, email]);
        }
        setEmail('');
    };

    const removeEmail = (toRemove) => {
        onChange(value.filter(e => e !== toRemove));
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
                        placeholder="email@pamapersada.com"
                        style={{ width: '100%', paddingLeft: '32px', padding: '8px 12px 8px 32px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none' }}
                    />
                </div>
                <button type="button" onClick={addEmail} style={{ flexShrink: 0, border: 'none', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}>
                    <Plus size={14} /> Add
                </button>
            </div>
            {value.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {value.map(e => (
                        <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.2)', borderRadius: '100px', padding: '3px 10px', fontSize: '10px', fontWeight: 600, color: 'var(--primary)' }}>
                            {e}
                            <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeEmail(e)} />
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
