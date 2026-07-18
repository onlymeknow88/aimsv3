import { X, AlertTriangle } from "lucide-react";

export default function DepartmentModal({ isOpen, onClose, onSubmit, editId, form, setField, submitting, formError }) {
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
                    maxWidth: "680px",
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
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, #1d4ed8, #153B73)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        ></div>
                        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                            {editId ? "Edit Department" : "Tambah Department Baru"}
                        </h3>
                    </div>
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={onSubmit} style={{ padding: "20px 24px", overflowY: "auto", flexGrow: 1 }}>
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
                            <span>{formError}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="name" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                Nama Departemen <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="Contoh: Human Resources"
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="code" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                Kode Departemen
                            </label>
                            <input
                                type="text"
                                id="code"
                                value={form.code}
                                onChange={(e) => setField("code", e.target.value)}
                                placeholder="Contoh: HRD"
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="document_code" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                Kode Dokumen
                            </label>
                            <input
                                type="text"
                                id="document_code"
                                value={form.document_code}
                                onChange={(e) => setField("document_code", e.target.value)}
                                placeholder="Contoh: DOC-HRD"
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
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
                                padding: "10px 16px",
                                backgroundColor: "#1d4ed8",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: submitting ? "not-allowed" : "pointer",
                                opacity: submitting ? 0.6 : 1,
                            }}
                        >
                            {submitting ? (editId ? "Menyimpan..." : "Membuat...") : (editId ? "Simpan Perubahan" : "Buat Departemen")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
