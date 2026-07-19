import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Plus, Trash } from "lucide-react";

export default function EventModal({
    isOpen,
    onClose,
    onSubmit,
    editId,
    form,
    setField,
    submitting,
    formError,
    categories,
    sections,
}) {
    const [newEmail, setNewEmail] = useState('');

    if (!isOpen) return null;

    const addEmail = () => {
        if (!newEmail) return;
        if (!form.invited_emails.includes(newEmail)) {
            setField('invited_emails', [...form.invited_emails, newEmail]);
        }
        setNewEmail('');
    };

    const removeEmail = (emailToRemove) => {
        setField('invited_emails', form.invited_emails.filter(e => e !== emailToRemove));
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15,23,42,0.65)",
                backdropFilter: "blur(5px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "16px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "92vh",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                }}
            >
                {/* Modal Header */}
                <div
                    style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}
                >
                    <h3
                        style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#0f172a",
                            margin: 0,
                        }}
                    >
                        {editId ? "Edit Agenda Pertemuan" : "Tambah Agenda Pertemuan Baru"}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                            borderRadius: "6px",
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <form
                    onSubmit={onSubmit}
                    style={{
                        padding: "20px 24px",
                        overflowY: "auto",
                        flexGrow: 1,
                    }}
                >
                    {formError && (
                        <div
                            style={{
                                backgroundColor: "#fef2f2",
                                color: "#b91c1c",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px",
                            }}
                        >
                            <AlertTriangle size={16} />
                            <span style={{ fontSize: '12px' }}>{formError}</span>
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {/* Title */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Nama Agenda (Title)</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setField("title", e.target.value)}
                                placeholder="Contoh: Rapat Koordinasi KPLH"
                                required
                                style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none" }}
                            />
                        </div>

                        {/* Category & Section */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Kategori</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setField("category_id", e.target.value)}
                                    required
                                    style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none" }}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Section Penanggung Jawab</label>
                                <select
                                    value={form.section_id}
                                    onChange={(e) => setField("section_id", e.target.value)}
                                    style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none" }}
                                >
                                    <option value="">Pilih Section (Opsional)</option>
                                    {sections.map(sec => (
                                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dates */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) => setField("start_date", e.target.value)}
                                    required
                                    style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none" }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Tanggal Akhir</label>
                                <input
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) => setField("end_date", e.target.value)}
                                    style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none" }}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setField("status", e.target.value)}
                                required
                                style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none" }}
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Deskripsi Agenda</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setField("description", e.target.value)}
                                placeholder="Masukkan detail agenda..."
                                rows={3}
                                style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", resize: 'vertical' }}
                            />
                        </div>

                        {/* Invited Emails */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Undangan Email (Invitees)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Contoh: user@alamtri.com"
                                    style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", flexGrow: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={addEmail}
                                    style={{ padding: '10px 14px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {form.invited_emails.map((email, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', color: '#334155' }}>
                                        <span>{email}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeEmail(email)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#ef4444', padding: '2px' }}
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Boolean checkboxes */}
                        <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={form.repeat}
                                    onChange={(e) => setField('repeat', e.target.checked)}
                                />
                                Ulangi Agenda (Repeat)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={form.must_send_email}
                                    onChange={(e) => setField('must_send_email', e.target.checked)}
                                />
                                Kirim Notifikasi Email
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                            marginTop: "24px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "10px 16px",
                                backgroundColor: "#fff",
                                color: "#475569",
                                border: "1.5px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: "10px 20px",
                                background: "linear-gradient(135deg, #1d4ed8, #153B73)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                opacity: submitting ? 0.7 : 1,
                            }}
                        >
                            {submitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
