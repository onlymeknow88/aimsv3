import React from 'react';
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    deleting = false,
    title = "Hapus Data",
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
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.6, margin: 0 }}>
                        {description || (
                            <>
                                Apakah Anda yakin ingin menghapus{" "}
                                {itemName ? <strong>{itemName}</strong> : "data ini"}? Tindakan ini
                                tidak dapat dibatalkan.
                            </>
                        )}
                    </p>

                    {errorMessage && (
                        <div
                            style={{
                                backgroundColor: "#fef2f2",
                                color: "#b91c1c",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "14px",
                                fontSize: "12px",
                            }}
                        >
                            <AlertTriangle size={14} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Actions */}
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
                            disabled={deleting}
                            style={{
                                padding: "8px 14px",
                                backgroundColor: "#fff",
                                color: "#475569",
                                border: "1.5px solid #e2e8f0",
                                borderRadius: "8px",
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
                                padding: "8px 16px",
                                backgroundColor: "#dc2626",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: deleting ? "not-allowed" : "pointer",
                                opacity: deleting ? 0.7 : 1,
                            }}
                        >
                            {deleting ? "Menghapus..." : "Hapus"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
