import DashboardPortalLayout from "../../Layouts/DashboardPortalLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import { Video, Image, BarChart2, Newspaper, ArrowRight, Check, AlertCircle } from "lucide-react";
import axios from "axios";

import { Switch } from "@/Components/ui/switch";

export default function DashboardIndex({ widgets = [] }) {
    const [settings, setSettings] = useState(widgets);
    const [message, setMessage] = useState(null);

    const stats = [
        {
            title: "SlideShow Manager",
            description: "Kelola tayangan slideshow gambar dan video untuk halaman utama.",
            icon: <Video size={24} style={{ color: "var(--primary)" }} />,
            link: "/dashboard-portal/slideshow",
            bg: "linear-gradient(135deg, rgba(21, 59, 115, 0.05) 0%, rgba(21, 59, 115, 0.01) 100%)",
            borderColor: "rgba(21, 59, 115, 0.15)",
        },
        {
            title: "Banner Manager",
            description: "Kelola banner promosi dan informasi penting di portal.",
            icon: <Image size={24} style={{ color: "#0ea5e9" }} />,
            link: "/dashboard-portal/banner",
            bg: "linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(14, 165, 233, 0.01) 100%)",
            borderColor: "rgba(14, 165, 233, 0.15)",
        },
        {
            title: "General KPI",
            description: "Pantau dan perbarui metrik KPI utama performa perusahaan.",
            icon: <BarChart2 size={24} style={{ color: "#10b981" }} />,
            link: "/dashboard-portal/general",
            bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.01) 100%)",
            borderColor: "rgba(16, 185, 129, 0.15)",
        },
        {
            title: "News & Update",
            description: "Publikasikan artikel, berita, dan pengumuman terbaru.",
            icon: <Newspaper size={24} style={{ color: "#f59e0b" }} />,
            link: "/dashboard-portal/news-and-update",
            bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.01) 100%)",
            borderColor: "rgba(245, 158, 11, 0.15)",
        },
    ];

    const handleToggle = async (id, currentVal) => {
        const newVal = currentVal === "true" ? "false" : "true";
        
        // 1. Optimistic Update (update UI instantly)
        setSettings(prev =>
            prev.map(item => (item.id === id ? { ...item, val: newVal } : item))
        );
        setMessage(null);

        try {
            await axios.post("/api/dashboard-portal/settings", {
                id: id,
                val: newVal
            });
            
            setMessage({ type: "success", text: `Widget "${formatWidgetName(id)}" berhasil diperbarui.` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error(err);
            // 2. Revert to original value if request fails
            setSettings(prev =>
                prev.map(item => (item.id === id ? { ...item, val: currentVal } : item))
            );
            setMessage({ type: "error", text: `Gagal memperbarui widget "${formatWidgetName(id)}".` });
        }
    };

    const formatWidgetName = (id) => {
        return id
            .split("_")
            .map(word => {
                if (word === 'k3lh') return 'K3LH';
                if (word === 'coe') return 'CoE';
                if (word === 'ds') return 'Document System';
                if (word === 'fls') return 'Field Leadership';
                if (word === 'csms') return 'CSMS';
                if (word === 'sap') return 'SAP';
                if (word === 'ytd') return 'YTD';
                if (word === 'mtd') return 'MTD';
                if (word === 'mcu') return 'MCU';
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    };

    return (
        <DashboardPortalLayout>
            <Head title="Dashboard Portal" />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 0" }}>
                {/* Welcome Banner */}
                <div style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)",
                    borderRadius: "16px",
                    padding: "32px",
                    color: "#fff",
                    marginBottom: "32px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px 0" }}>
                        Selamat Datang di Admin Panel Dashboard Portal 🛡️
                    </h2>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", margin: 0, maxWidth: "600px", lineHeight: "1.6" }}>
                        Kelola konten portal utama AIMS dengan mudah. Mulai dari memperbarui slideshow interaktif, memasang banner promosi, menyunting data KPI perusahaan, hingga mempublikasikan artikel berita terbaru.
                    </p>
                </div>

                {/* Grid Menu */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}>
                    {stats.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.link}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                padding: "24px",
                                background: item.bg,
                                border: `1px solid ${item.borderColor}`,
                                borderRadius: "12px",
                                textDecoration: "none",
                                transition: "all 0.2s ease-in-out",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
                                height: "200px"
                            }}
                            className="dashboard-card"
                        >
                            <div>
                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                    marginBottom: "16px"
                                }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
                                    {item.title}
                                </h4>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                                    {item.description}
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "var(--primary)", marginTop: "16px" }}>
                                Kelola Konten <ArrowRight size={12} />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Section Widget Toggle */}
                <div style={{
                    backgroundColor: "#fff",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "var(--shadow-sm)"
                }}>
                    <div style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                            Konfigurasi Widget Main Dashboard
                        </h3>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                            Aktifkan atau nonaktifkan tampilan widget pada beranda utama sistem.
                        </p>
                    </div>

                    {/* Alert Message */}
                    {message && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            marginBottom: "20px",
                            backgroundColor: message.type === "success" ? "#ecfdf5" : "#fef2f2",
                            color: message.type === "success" ? "#047857" : "#b91c1c",
                            border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`
                        }}>
                            {message.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "16px"
                    }}>
                        {settings.map((widget) => {
                            const isActive = widget.val === "true";

                            return (
                                <div
                                    key={widget.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "16px 20px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border-color)",
                                        backgroundColor: isActive ? "#fff" : "#f8fafc",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <div style={{ flex: 1, marginRight: "12px" }}>
                                        <span style={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)"
                                        }}>
                                            {formatWidgetName(widget.id)}
                                        </span>
                                        <span style={{
                                            display: "block",
                                            fontSize: "10px",
                                            color: "var(--text-muted)",
                                            marginTop: "2px"
                                        }}>
                                            {widget.id}
                                        </span>
                                    </div>

                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={() => handleToggle(widget.id, widget.val)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .dashboard-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
                    background: #fff !important;
                    border-color: var(--primary) !important;
                }
            `}} />
        </DashboardPortalLayout>
    );
}
