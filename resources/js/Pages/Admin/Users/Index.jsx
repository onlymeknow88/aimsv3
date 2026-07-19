import {
    AlertCircle,
    AlertTriangle,
    Briefcase,
    Plus,
    RefreshCw,
    Search,
    UserCheck,
    Users,
    X,
} from "lucide-react";

import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import SearchableSelect from "@/Components/SearchableSelect";
import UsersTable from "./Partials/UsersTable";
import useUsers from "./Hooks/useUsers";

// ─── Toggle Switch Component ──────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                backgroundColor: checked ? "#f0f9ff" : "#f8fafc",
                borderRadius: "10px",
                border: `1.5px solid ${checked ? "#7dd3fc" : "#e2e8f0"}`,
                transition: "all 0.2s",
                cursor: "pointer",
            }}
            onClick={() => onChange(!checked)}
        >
            <div>
                <div
                    style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#0f172a",
                    }}
                >
                    {label}
                </div>
                {description && (
                    <div
                        style={{
                            fontSize: "11.5px",
                            color: "#64748b",
                            marginTop: "2px",
                        }}
                    >
                        {description}
                    </div>
                )}
            </div>
            {/* Switch pill */}
            <div
                style={{
                    position: "relative",
                    width: "42px",
                    height: "24px",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: "42px",
                        height: "24px",
                        borderRadius: "99px",
                        backgroundColor: checked ? "#2563eb" : "#cbd5e1",
                        transition: "background-color 0.2s",
                        cursor: "pointer",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "3px",
                        left: checked ? "21px" : "3px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                        transition: "left 0.2s ease",
                    }}
                />
            </div>
        </div>
    );
}

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, color = "#1d4ed8" }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
                paddingBottom: "8px",
                borderBottom: "1.5px solid #f1f5f9",
            }}
        >
            <Icon size={15} style={{ color }} />
            <span
                style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }}
            >
                {title}
            </span>
        </div>
    );
}

// ─── Form field helpers ────────────────────────────────────────────────────────
const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
};
const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.15s",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };
const onFocus = (e) => (e.target.style.borderColor = "#2563eb");
const onBlur = (e) => (e.target.style.borderColor = "#e2e8f0");

function Field({ label, required, children }) {
    return (
        <div>
            <label style={labelStyle}>
                {label}
                {required && (
                    <span style={{ color: "#ef4444", marginLeft: "3px" }}>
                        *
                    </span>
                )}
            </label>
            {children}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Index() {
    const {
        users,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        master,
        loading,
        error,
        search,
        setSearch,
        fetchUsers,
        modalOpen,
        editId,
        form,
        setField,
        submitting,
        formError,
        expandedModules,
        toggleModule,
        toggleRole,
        openCreate,
        openEdit,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useUsers();

    const {
        companies = [],
        departments = [],
        sections = [],
        roles = [],
        modules = [],
    } = master;

    const filteredSections = form.department_id
        ? sections.filter(
              (s) => String(s.department_id) === String(form.department_id),
          )
        : sections;

    const hasEmployee = !!users.filter((u) => u.employee).length;

    return (
        <AdminLayout title="Users & Employees">
            <div style={{ margin: "0 auto" }}>
                {/* ── Header ──────────────────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "24px",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "4px",
                            }}
                        >
                            <div
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "10px",
                                    background:
                                        "linear-gradient(135deg, #1d4ed8, #153B73)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Users size={18} style={{ color: "#fff" }} />
                            </div>
                            <h1
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    margin: 0,
                                }}
                            >
                                Users & Employees
                            </h1>
                        </div>
                        <p
                            style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginLeft: "50px",
                            }}
                        >
                            Manajemen akun login dan data karyawan.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <Search
                                size={14}
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8",
                                }}
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari user, email, jabatan..."
                                style={{
                                    ...inputStyle,
                                    paddingLeft: "34px",
                                    width: "220px",
                                }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>
                        <button
                            onClick={fetchUsers}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "9px 14px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                                color: "#475569",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                        <button
                            onClick={openCreate}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background:
                                    "linear-gradient(135deg, #1d4ed8, #153B73)",
                                color: "#fff",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 3px 10px rgba(21,59,115,0.25)",
                            }}
                        >
                            <Plus size={16} /> Tambah User
                        </button>
                    </div>
                </div>

                {/* ── Stats bar ───────────────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        {
                            label: "Total User",
                            value: pagination.total,
                            color: "#1d4ed8",
                            bg: "#eff6ff",
                        },
                        {
                            label: "Dengan Data Employee",
                            value: users.filter((u) => u.employee).length,
                            color: "#10b981",
                            bg: "#f0fdf4",
                        },
                        {
                            label: "Memiliki Role",
                            value: users.filter(
                                (u) => u.document_roles?.length > 0,
                            ).length,
                            color: "#8b5cf6",
                            bg: "#f5f3ff",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            style={{
                                flex: "1 1 140px",
                                backgroundColor: s.bg,
                                borderRadius: "10px",
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                border: `1px solid ${s.color}20`,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 900,
                                    color: s.color,
                                }}
                            >
                                {s.value}
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: s.color,
                                    fontWeight: 600,
                                    opacity: 0.85,
                                }}
                            >
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Error ───────────────────────────────────────────── */}
                {error && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            marginBottom: "20px",
                            color: "#dc2626",
                            fontSize: "13px",
                        }}
                    >
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {/* ── Table ───────────────────────────────────────────── */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                >
                    <UsersTable
                        users={users}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        pagination={pagination}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={setLimit}
                    />
                </div>

                {!loading && users.length > 0 && (
                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "#94a3b8",
                            textAlign: "right",
                        }}
                    >
                        Menampilkan {pagination.total} user
                    </p>
                )}
            </div>

            {/* ── Modal ───────────────────────────────────────────────── */}
            {modalOpen && (
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
                            maxWidth: "1200px",
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
                                >
                                    <Users
                                        size={15}
                                        style={{ color: "#fff" }}
                                    />
                                </div>
                                <h3
                                    style={{
                                        fontSize: "15px",
                                        fontWeight: 800,
                                        color: "#0f172a",
                                        margin: 0,
                                    }}
                                >
                                    {editId
                                        ? "Edit Akun User"
                                        : "Tambah User Baru"}
                                </h3>
                            </div>
                            <button
                                onClick={closeModal}
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
                                    (e.currentTarget.style.backgroundColor =
                                        "#f1f5f9")
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
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                minHeight: 0,
                            }}
                        >
                            <div
                                style={{
                                    padding: "20px 24px",
                                    overflowY: "auto",
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                {/* Form error */}
                                {formError && (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "8px",
                                            backgroundColor: "#fef2f2",
                                            border: "1px solid #fecaca",
                                            borderRadius: "8px",
                                            padding: "10px 14px",
                                            color: "#dc2626",
                                            fontSize: "13px",
                                        }}
                                    >
                                        <AlertTriangle
                                            size={14}
                                            style={{
                                                marginTop: "1px",
                                                flexShrink: 0,
                                            }}
                                        />{" "}
                                        {formError}
                                    </div>
                                )}

                                {/* ── Section: Account ─────────────────────────────── */}
                                <div>
                                    <SectionTitle
                                        icon={Users}
                                        title="Informasi Akun"
                                    />
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "12px",
                                        }}
                                    >
                                        <Field label="Nama Lengkap" required>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) =>
                                                    setField(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Budi Santoso"
                                                style={inputStyle}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                            />
                                        </Field>
                                        <Field label="Email" required>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) =>
                                                    setField(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="budi@example.com"
                                                style={inputStyle}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                            />
                                        </Field>
                                        <Field
                                            label={
                                                editId
                                                    ? "Password (kosongkan jika tidak diubah)"
                                                    : "Password"
                                            }
                                            required={!editId}
                                        >
                                            <input
                                                type="password"
                                                required={!editId}
                                                value={form.password}
                                                onChange={(e) =>
                                                    setField(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    editId
                                                        ? "••••••••"
                                                        : "Min. 8 karakter"
                                                }
                                                style={inputStyle}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                            />
                                        </Field>
                                    </div>
                                </div>

                                {/* ── Section: Roles ───────────────────────────────── */}
                                <div>
                                    <SectionTitle
                                        icon={UserCheck}
                                        title="Peran & Akses Modul"
                                        // color="#8b5cf6"
                                    />
                                    <div
                                        style={{
                                            backgroundColor: "#fafafa",
                                            borderRadius: "10px",
                                            border: "1px solid #e2e8f0",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                        }}
                                    >
                                        {modules.map((mod) => {
                                            const modRoles = roles.filter(
                                                (r) => r.module_id === mod.id,
                                            );
                                            const isExpanded =
                                                expandedModules.includes(
                                                    mod.id,
                                                );
                                            const activeRoles =
                                                form.role_ids.filter((rid) =>
                                                    modRoles.some(
                                                        (r) => r.id === rid,
                                                    ),
                                                );
                                            return (
                                                <div
                                                    key={mod.id}
                                                    style={{
                                                        borderBottom:
                                                            "1px dashed #e2e8f0",
                                                        paddingBottom: "10px",
                                                    }}
                                                >
                                                    <label
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "8px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isExpanded}
                                                            onChange={() =>
                                                                toggleModule(
                                                                    mod.id,
                                                                )
                                                            }
                                                            style={{
                                                                accentColor:
                                                                    "#2563eb",
                                                                width: "15px",
                                                                height: "15px",
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight: 800,
                                                                color: "#1d4ed8",
                                                                textTransform:
                                                                    "uppercase",
                                                                letterSpacing:
                                                                    "0.04em",
                                                            }}
                                                        >
                                                            {mod.name}
                                                        </span>
                                                        {activeRoles.length >
                                                            0 && (
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    fontWeight: 700,
                                                                    backgroundColor:
                                                                        "#dbeafe",
                                                                    color: "#1d4ed8",
                                                                    padding:
                                                                        "1px 7px",
                                                                    borderRadius:
                                                                        "99px",
                                                                }}
                                                            >
                                                                {
                                                                    activeRoles.length
                                                                }{" "}
                                                                aktif
                                                            </span>
                                                        )}
                                                    </label>
                                                    {isExpanded && (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: "8px",
                                                                marginTop:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "23px",
                                                            }}
                                                        >
                                                            {modRoles.length ===
                                                            0 ? (
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "11.5px",
                                                                        color: "#94a3b8",
                                                                        fontStyle:
                                                                            "italic",
                                                                    }}
                                                                >
                                                                    Belum ada
                                                                    role
                                                                </span>
                                                            ) : (
                                                                modRoles.map(
                                                                    (role) => {
                                                                        const active =
                                                                            form.role_ids.includes(
                                                                                role.id,
                                                                            );
                                                                        return (
                                                                            <label
                                                                                key={
                                                                                    role.id
                                                                                }
                                                                                style={{
                                                                                    display:
                                                                                        "inline-flex",
                                                                                    alignItems:
                                                                                        "center",
                                                                                    gap: "7px",
                                                                                    fontSize:
                                                                                        "12.5px",
                                                                                    cursor: "pointer",
                                                                                    backgroundColor:
                                                                                        active
                                                                                            ? "#eff6ff"
                                                                                            : "#fff",
                                                                                    border: `1.5px solid ${active ? "#2563eb" : "#e2e8f0"}`,
                                                                                    color: active
                                                                                        ? "#1d4ed8"
                                                                                        : "#475569",
                                                                                    padding:
                                                                                        "6px 12px",
                                                                                    borderRadius:
                                                                                        "8px",
                                                                                    transition:
                                                                                        "all 0.15s",
                                                                                    fontWeight:
                                                                                        active
                                                                                            ? 700
                                                                                            : 500,
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        active
                                                                                    }
                                                                                    onChange={() =>
                                                                                        toggleRole(
                                                                                            role.id,
                                                                                        )
                                                                                    }
                                                                                    style={{
                                                                                        accentColor:
                                                                                            "#2563eb",
                                                                                        width: "13px",
                                                                                        height: "13px",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                />
                                                                                {
                                                                                    role.name
                                                                                }
                                                                            </label>
                                                                        );
                                                                    },
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Section: Employee Toggle ─────────────────────── */}
                                <div>
                                    <SectionTitle
                                        icon={Briefcase}
                                        title="Data Karyawan"
                                        // color="#10b981"
                                    />
                                    <Toggle
                                        checked={form.with_employee}
                                        onChange={(val) =>
                                            setField("with_employee", val)
                                        }
                                        label="Tambahkan Data Karyawan"
                                        description="Aktifkan untuk mengisi data perusahaan, jabatan, dan informasi personal karyawan."
                                    />
                                </div>

                                {/* ── Employee Form (conditional) ──────────────────── */}
                                {form.with_employee && (
                                    <div
                                        style={{
                                            backgroundColor: "#f0fdf4",
                                            borderRadius: "12px",
                                            border: "1px solid #bbf7d0",
                                            padding: "18px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "14px",
                                        }}
                                    >
                                        {/* Afiliasi */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "12px",
                                            }}
                                        >
                                            <Field label="Perusahaan">
                                                <SearchableSelect
                                                    options={companies.map(
                                                        (c) => ({
                                                            id: c.id,
                                                            name: c.company_name,
                                                        }),
                                                    )}
                                                    value={form.company_id}
                                                    onChange={(val) => {
                                                        setField(
                                                            "company_id",
                                                            val,
                                                        );
                                                    }}
                                                    placeholder="Pilih perusahaan..."
                                                    isMulti={false}
                                                />
                                                {/* <select
                                                    value={form.company_id}
                                                    onChange={(e) => {
                                                        setField(
                                                            "company_id",
                                                            e.target.value,
                                                        );
                                                        setField(
                                                            "department_id",
                                                            "",
                                                        );
                                                    }}
                                                    style={selectStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                >
                                                    <option value="">
                                                        — Pilih —
                                                    </option>
                                                    {companies.map((c) => (
                                                        <option
                                                            key={c.id}
                                                            value={c.id}
                                                        >
                                                            {c.company_name}
                                                        </option>
                                                    ))}
                                                </select> */}
                                            </Field>
                                            <Field label="Departemen">
                                                <SearchableSelect
                                                    options={departments.map(
                                                        (d) => ({
                                                            id: d.id,
                                                            name: d.name,
                                                        }),
                                                    )}
                                                    value={form.department_id}
                                                    onChange={(val) =>
                                                        setField(
                                                            "department_id",
                                                            val,
                                                        )
                                                    }
                                                    placeholder="Pilih departemen..."
                                                    isMulti={false}
                                                />
                                                {/* <select
                                                    value={form.department_id}
                                                    onChange={(e) =>
                                                        setField(
                                                            "department_id",
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={selectStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                >
                                                    <option value="">
                                                        — Pilih —
                                                    </option>
                                                    {departments.map((d) => (
                                                        <option
                                                            key={d.id}
                                                            value={d.id}
                                                        >
                                                            {d.name}
                                                        </option>
                                                    ))}
                                                </select> */}
                                            </Field>
                                        </div>

                                        {/* Identitas karyawan */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "12px",
                                            }}
                                        >
                                            <Field label="No. MinePermit / Employee Number">
                                                <input
                                                    type="text"
                                                    value={form.emp_number}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_number",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: EMP-001"
                                                    style={inputStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                />
                                            </Field>
                                            <Field label="No. KTP / ID">
                                                <input
                                                    type="text"
                                                    value={form.emp_id_number}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_id_number",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: 3271..."
                                                    style={inputStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                />
                                            </Field>
                                        </div>

                                        {/* Personal */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr 1fr",
                                                gap: "12px",
                                            }}
                                        >
                                            <Field label="Jenis Kelamin">
                                                <select
                                                    value={form.emp_gender}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_gender",
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={selectStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                >
                                                    <option value="">
                                                        — Pilih —
                                                    </option>
                                                    <option value="male">
                                                        Male
                                                    </option>
                                                    <option value="female">
                                                        Female
                                                    </option>
                                                </select>
                                            </Field>
                                            <Field label="Marital Status">
                                                <select
                                                    value={form.emp_marital}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_marital",
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={selectStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                >
                                                    <option value="">
                                                        — Pilih —
                                                    </option>
                                                    <option value="single">
                                                        Belum Menikah
                                                    </option>
                                                    <option value="married">
                                                        Menikah
                                                    </option>
                                                    <option value="divorced">
                                                        Cerai
                                                    </option>
                                                </select>
                                            </Field>
                                            <Field label="Status">
                                                <select
                                                    value={form.emp_status}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_status",
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={selectStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                >
                                                    <option value="">
                                                        — Pilih —
                                                    </option>
                                                    <option value="active">
                                                        Active
                                                    </option>
                                                    <option value="inactive">
                                                        Inactive
                                                    </option>
                                                    <option value="candidate">
                                                        Candidate
                                                    </option>
                                                </select>
                                            </Field>
                                            <Field label="Tanggal Lahir">
                                                <input
                                                    type="date"
                                                    value={form.emp_dob}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_dob",
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={inputStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                />
                                            </Field>
                                            <Field label="Gol. Darah">
                                                <select
                                                    value={form.emp_blood_type}
                                                    onChange={(e) =>
                                                        setField(
                                                            "emp_blood_type",
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={selectStyle}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                >
                                                    <option value="">—</option>
                                                    {[
                                                        "A",
                                                        "B",
                                                        "AB",
                                                        "O",
                                                        "A+",
                                                        "A-",
                                                        "B+",
                                                        "B-",
                                                        "AB+",
                                                        "AB-",
                                                        "O+",
                                                        "O-",
                                                    ].map((b) => (
                                                        <option
                                                            key={b}
                                                            value={b}
                                                        >
                                                            {b}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div
                                style={{
                                    padding: "14px 24px",
                                    borderTop: "1px solid #f1f5f9",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                    backgroundColor: "#fafafa",
                                    flexShrink: 0,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        padding: "9px 18px",
                                        borderRadius: "8px",
                                        border: "1.5px solid #e2e8f0",
                                        backgroundColor: "#fff",
                                        color: "#475569",
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
                                        padding: "9px 24px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: submitting
                                            ? "#93c5fd"
                                            : "linear-gradient(135deg, #1d4ed8, #153B73)",
                                        color: "#fff",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        cursor: submitting
                                            ? "not-allowed"
                                            : "pointer",
                                        boxShadow: submitting
                                            ? "none"
                                            : "0 3px 10px rgba(21,59,115,0.25)",
                                    }}
                                >
                                    {submitting
                                        ? "Menyimpan..."
                                        : editId
                                          ? "Perbarui User"
                                          : "Simpan User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
