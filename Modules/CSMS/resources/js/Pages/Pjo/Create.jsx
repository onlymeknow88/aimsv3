import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { ArrowLeft, UserPlus, Save, Loader2, FileText, Upload } from "lucide-react";
import axios from "axios";
import ConfirmationModal from "@/Components/ConfirmationModal";
import PageLoader from "@/Components/PageLoader";
import FileDropzone from "@/Components/FileDropzone";

const S = {
    label: {
        fontSize: "10.5px",
        fontWeight: 700,
        color: "var(--text-secondary)",
        marginBottom: "6px",
        display: "block",
    },
    input: {
        width: "100%",
        padding: "8px 12px",
        border: "1px solid var(--border-color)",
        borderRadius: "6px",
        fontSize: "12px",
        outline: "none",
        backgroundColor: "#fff",
        boxSizing: "border-box",
    },
    title: {
        fontSize: "13px",
        fontWeight: 700,
        color: "var(--primary)",
        marginBottom: "16px",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "8px",
        marginTop: 0,
    },
    error: {
        fontSize: "11px",
        color: "var(--danger, #ef4444)",
        marginTop: "4px",
    },
};

const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

export default function PjoCreate() {
    const [form, setForm] = useState({
        name: "",
        number_pjo: "",
        company_id: "",
        phone: "",
        email: "",
        date_of_birth: "",
        date_submission: "",
        ccow_id: "",
        submission: "",
    });
    const [companies, setCompanies] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [masterLoading, setMasterLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/csms/master-data")
            .then((res) => setCompanies(res.data?.result?.companies ?? []))
            .finally(() => setMasterLoading(false));
    }, []);

    const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

    const handleFileDrop = (files) =>
        setSelectedFiles((prev) => [...prev, ...files]);

    const removeFile = (idx) =>
        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = () => {
        setSaving(true);
        setErrors({});
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v) fd.append(k, v);
        });
        selectedFiles.forEach((file) => {
            fd.append("files[]", file);
        });

        axios
            .post("/api/csms/pjos", fd)
            .then(() => {
                window.location.href = "/csms/pjo/lists";
            })
            .catch((err) => {
                if (err.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                }
            })
            .finally(() => setSaving(false));
    };

    if (masterLoading) {
        return (
            <>
                <Head title="Tambah PJO Baru" />
                <PageLoader title="Memuat data master..." />
            </>
        );
    }

    const ccows = companies.filter((c) => c.type === "Internal");
    const regularCompanies = companies.filter((c) => c.type !== "Internal");

    return (
        <div
            style={{
                backgroundColor: "var(--bg-color)",
                minHeight: "100vh",
                padding: "40px 20px",
                boxSizing: "border-box",
            }}
        >
            <Head title="Tambah PJO Baru" />

            {/* Top Bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "12px",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                <a
                    href="/csms/pjo/lists"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--primary)",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontSize: "12px",
                    }}
                >
                    <ArrowLeft size={16} /> Kembali ke PJO
                </a>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UserPlus size={16} color="#fff" />
                    </div>
                    <div>
                        <h2
                            style={{
                                fontSize: "15px",
                                fontWeight: 800,
                                color: "var(--text-primary)",
                                margin: 0,
                            }}
                        >
                            Tambah PJO Baru
                        </h2>
                        <p
                            style={{
                                fontSize: "11px",
                                color: "var(--text-secondary)",
                                margin: 0,
                            }}
                        >
                            Isi data Penanggung Jawab Operasional kontraktor
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: "900px",
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow:
                            "var(--shadow-premium, 0 4px 24px rgba(0,0,0,0.06))",
                    }}
                >
                    {/* Section: Data PJO */}
                    <div style={{ marginBottom: "32px" }}>
                        <h4 style={S.title}>Informasi PJO</h4>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>
                                        Perusahaan{" "}
                                        <span style={{ color: "#ef4444" }}>
                                            *
                                        </span>
                                    </label>
                                    <select
                                        value={form.company_id}
                                        onChange={(e) =>
                                            set("company_id", e.target.value)
                                        }
                                        style={{
                                            ...S.input,
                                            borderColor: errors.company_id
                                                ? "#ef4444"
                                                : "var(--border-color)",
                                        }}
                                    >
                                        <option value="">
                                            -- Pilih Perusahaan --
                                        </option>
                                        {regularCompanies.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_id && (
                                        <span style={S.error}>
                                            {errors.company_id[0]}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label style={S.label}>
                                        CCOW{" "}
                                        <span style={{ color: "#ef4444" }}>
                                            *
                                        </span>
                                    </label>
                                    <select
                                        value={form.ccow_id}
                                        onChange={(e) =>
                                            set("ccow_id", e.target.value)
                                        }
                                        style={{
                                            ...S.input,
                                            borderColor: errors.ccow_id
                                                ? "#ef4444"
                                                : "var(--border-color)",
                                        }}
                                    >
                                        <option value="">
                                            -- Pilih CCOW --
                                        </option>
                                        {ccows.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ccow_id && (
                                        <span style={S.error}>
                                            {errors.ccow_id[0]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>
                                        No. PJO{" "}
                                        <span style={{ color: "#ef4444" }}>
                                            *
                                        </span>
                                    </label>
                                    <input
                                        value={form.number_pjo}
                                        onChange={(e) =>
                                            set("number_pjo", e.target.value)
                                        }
                                        style={{
                                            ...S.input,
                                            borderColor: errors.number_pjo
                                                ? "#ef4444"
                                                : "var(--border-color)",
                                        }}
                                        placeholder="PJO-XXXX"
                                    />
                                    {errors.number_pjo && (
                                        <span style={S.error}>
                                            {errors.number_pjo[0]}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label style={S.label}>
                                        Nama Lengkap{" "}
                                        <span style={{ color: "#ef4444" }}>
                                            *
                                        </span>
                                    </label>
                                    <input
                                        value={form.name}
                                        onChange={(e) =>
                                            set("name", e.target.value)
                                        }
                                        style={{
                                            ...S.input,
                                            borderColor: errors.name
                                                ? "#ef4444"
                                                : "var(--border-color)",
                                        }}
                                        placeholder="Nama PJO"
                                    />
                                    {errors.name && (
                                        <span style={S.error}>
                                            {errors.name[0]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>
                                        Pengajuan (Submission)
                                    </label>
                                    <input
                                        value={form.submission}
                                        onChange={(e) =>
                                            set("submission", e.target.value)
                                        }
                                        style={S.input}
                                        placeholder="Submission / Pengajuan"
                                    />
                                </div>
                                <div>
                                    <label style={S.label}>Telepon</label>
                                    <input
                                        value={form.phone}
                                        onChange={(e) =>
                                            set("phone", e.target.value)
                                        }
                                        style={S.input}
                                        placeholder="+62xxx"
                                    />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            set("email", e.target.value)
                                        }
                                        style={S.input}
                                        placeholder="email@perusahaan.com"
                                    />
                                </div>
                                <div>
                                    <label style={S.label}>Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        value={form.date_of_birth}
                                        onChange={(e) =>
                                            set("date_of_birth", e.target.value)
                                        }
                                        style={S.input}
                                    />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>
                                        Tanggal Pengajuan
                                    </label>
                                    <input
                                        type="date"
                                        value={form.date_submission}
                                        onChange={(e) =>
                                            set(
                                                "date_submission",
                                                e.target.value,
                                            )
                                        }
                                        style={S.input}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    borderTop: "1px dashed var(--border-color)",
                                    paddingTop: "16px",
                                    marginTop: "10px",
                                }}
                            >
                                <label style={{ ...S.label, marginBottom: "8px" }}>
                                    Upload File Berkas Pendukung
                                </label>
                                <FileDropzone
                                    onFileDrop={handleFileDrop}
                                    accept=".pdf,.png,.jpeg,.jpg,.doc,.docx"
                                />
                                {selectedFiles.length > 0 && (
                                    <div
                                        style={{
                                            marginTop: "8px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                        }}
                                    >
                                        {selectedFiles.map((f, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "8px",
                                                    padding: "6px 10px",
                                                    backgroundColor: "#fff",
                                                    border: "1px solid var(--border-color)",
                                                    borderRadius: "6px",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        flex: 1,
                                                        color: "#334155",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        minWidth: 0,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <Upload size={10} /> {f.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    style={{
                                                        flexShrink: 0,
                                                        border: "1px solid #fca5a5",
                                                        background: "#fef2f2",
                                                        color: "#ef4444",
                                                        cursor: "pointer",
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        padding: "2px 8px",
                                                        borderRadius: "4px",
                                                        lineHeight: "16px",
                                                    }}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                            paddingTop: "16px",
                            borderTop: "1px solid var(--border-color)",
                        }}
                    >
                        <a
                            href="/csms/pjo/lists"
                            style={{
                                padding: "9px 20px",
                                border: "1px solid var(--border-color)",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                backgroundColor: "#fff",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                        >
                            Batal
                        </a>
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={saving}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "9px 20px",
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer",
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? (
                                <Loader2
                                    size={13}
                                    style={{
                                        animation: "spin 1s linear infinite",
                                    }}
                                />
                            ) : (
                                <Save size={13} />
                            )}
                            {saving ? "Menyimpan..." : "Simpan PJO"}
                        </button>
                        <ConfirmationModal
                            isOpen={showConfirm}
                            type="draft"
                            confirmText="Simpan"
                            cancelText="Batal"
                            loading={saving}
                            onConfirm={handleSubmit}
                            onCancel={() => setShowConfirm(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
