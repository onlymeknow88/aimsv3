import React from 'react';
import { AlertTriangle, X } from "lucide-react";

export default function MappingModal({
    isOpen,
    onClose,
    onSubmit,
    editId,
    form,
    setField,
    submitting,
    formError,
    categories = [],
}) {
    if (!isOpen) return null;

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
                    maxWidth: "500px",
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
                        {editId ? "Edit Mapping" : "Tambah Mapping Baru"}
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
                        {/* Parent Category */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            <label
                                htmlFor="category_id"
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#0f172a",
                                }}
                            >
                                Kategori Induk
                            </label>
                            <select
                                id="category_id"
                                value={form.category_id}
                                onChange={(e) => setField("category_id", e.target.value)}
                                required
                                style={{
                                    padding: "10px 14px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    outline: "none",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <option value="">Pilih Kategori Induk</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.module?.name || 'No Module'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Index */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            <label
                                htmlFor="index"
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#0f172a",
                                }}
                            >
                                Index Mapping
                            </label>
                            <input
                                id="index"
                                type="text"
                                value={form.index}
                                onChange={(e) => setField("index", e.target.value)}
                                placeholder="Contoh: 1.1.1"
                                required
                                style={{
                                    padding: "10px 14px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* Name */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            <label
                                htmlFor="name"
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#0f172a",
                                }}
                            >
                                Nama Mapping
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="Masukkan nama mapping"
                                required
                                style={{
                                    padding: "10px 14px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    outline: "none",
                                }}
                            />
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
