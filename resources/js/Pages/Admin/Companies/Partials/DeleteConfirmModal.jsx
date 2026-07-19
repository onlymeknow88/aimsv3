import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    deleting = false,
    title = "Hapus Data Perusahaan",
    description,
    errorMessage,
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
                zIndex: 1100,
                padding: "16px",
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "400px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                backgroundColor: "#fef2f2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <AlertTriangle size={16} color="#dc2626" />
                        </div>
                        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: deleting ? "not-allowed" : "pointer",
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                            borderRadius: "6px",
                        }}
                        onMouseEnter={(e) => !deleting && (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: 1.6, margin: 0 }}>
                        {description || (
                            <>
                                Apakah Anda yakin ingin menghapus perusahaan{" "}
                                {itemName ? <strong>{itemName}</strong> : "ini"}? Semua data department yang terkait di dalamnya mungkin akan terdampak. Tindakan ini tidak dapat dibatalkan.
                            </>
                        )}
                    </p>
                    {errorMessage && (
                        <div
                            style={{
                                marginTop: "12px",
                                backgroundColor: "#fef2f2",
                                color: "#b91c1c",
                                padding: "9px 12px",
                                borderRadius: "8px",
                                fontSize: "12.5px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "6px",
                            }}
                        >
                            <AlertTriangle size={13} style={{ marginTop: "1px", flexShrink: 0 }} />
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "14px 24px",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        backgroundColor: "#fafafa",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        style={{
                            padding: "9px 18px",
                            borderRadius: "8px",
                            border: "1.5px solid #e2e8f0",
                            backgroundColor: "#fff",
                            color: "#475569",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: deleting ? "not-allowed" : "pointer",
                        }}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        style={{
                            padding: "9px 18px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: deleting ? "#fca5a5" : "#dc2626",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: deleting ? "not-allowed" : "pointer",
                            boxShadow: deleting ? "none" : "0 3px 10px rgba(220,38,38,0.25)",
                        }}
                    >
                        {deleting ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}
