import { AlertTriangle, X } from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";

export default function CompanyModal({
    isOpen,
    onClose,
    onSubmit,
    editId,
    form,
    setField,
    users = [],
    allCompanies = [],
    submitting,
    formError,
}) {
    if (!isOpen) return null;

    // Filter parent options to exclude the company itself
    const parentOptions = allCompanies.filter(c => c.id !== editId);

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
                                background:
                                    "linear-gradient(135deg, #1d4ed8, #153B73)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        ></div>
                        <h3
                            style={{
                                fontSize: "15px",
                                fontWeight: 800,
                                color: "#0f172a",
                                margin: 0,
                            }}
                        >
                            {editId ? "Edit Perusahaan" : "Tambah Perusahaan Baru"}
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
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f1f5f9")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                "transparent")
                        }
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
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
                            <span>{formError}</span>
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {/* KTT / PJO (Searchable Select) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                KTT / PJO
                            </label>
                            <SearchableSelect
                                options={users.map(u => ({ id: u.id, name: u.name, email: u.email }))}
                                value={form.user_id}
                                onChange={(val) => setField("user_id", val)}
                                placeholder="Pilih KTT / PJO..."
                            />
                        </div>

                        {/* Company name * */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="company_name"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Company name <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <input
                                id="company_name"
                                type="text"
                                value={form.company_name}
                                onChange={(e) => setField("company_name", e.target.value)}
                                placeholder="Masukkan nama perusahaan"
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

                        {/* Document code */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="document_code"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Document code
                            </label>
                            <input
                                id="document_code"
                                type="text"
                                value={form.document_code}
                                onChange={(e) => setField("document_code", e.target.value)}
                                placeholder="Masukkan kode dokumen"
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

                        {/* Address * */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="address"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Address <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <textarea
                                id="address"
                                value={form.address}
                                onChange={(e) => setField("address", e.target.value)}
                                placeholder="Masukkan alamat"
                                required
                                rows={3}
                                style={{
                                    padding: "10px 14px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    outline: "none",
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {/* Email * */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="email"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Email <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                placeholder="alamat@email.com"
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

                        {/* Phone number * */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="phone_number"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Phone number <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <input
                                id="phone_number"
                                type="text"
                                value={form.phone_number}
                                onChange={(e) => setField("phone_number", e.target.value)}
                                placeholder="Masukkan nomor telepon"
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

                        {/* Type * (select option) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="type"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Type <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <select
                                id="type"
                                value={form.type}
                                onChange={(e) => setField("type", e.target.value)}
                                required
                                style={{
                                    padding: "10px 14px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    outline: "none",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">— Select an option —</option>
                                <option value="Internal">Internal</option>
                                <option value="External">External</option>
                            </select>
                        </div>

                        {/* Parent (select option) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor="parent"
                                style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}
                            >
                                Parent
                            </label>
                            <select
                                id="parent"
                                value={form.parent_company_id}
                                onChange={(e) => setField("parent_company_id", e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    outline: "none",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">— Select an option —</option>
                                {parentOptions.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.company_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer Actions */}
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
                            {submitting
                                ? editId
                                    ? "Menyimpan..."
                                    : "Membuat..."
                                : editId
                                  ? "Simpan Perubahan"
                                  : "Buat Perusahaan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
