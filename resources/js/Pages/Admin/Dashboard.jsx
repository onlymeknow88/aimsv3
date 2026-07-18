import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Users, Landmark, Layers, MapPin, Settings } from 'lucide-react';

export default function Dashboard({ stats = {} }) {
    const statCards = [
        { name: 'Total Users & Employees', value: stats.users ?? 0, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        { name: 'AIMS System Roles', value: stats.roles ?? 0, icon: Shield, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
        { name: 'Business Entities', value: stats.entities ?? 0, icon: Layers, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
        { name: 'Active Companies', value: stats.companies ?? 0, icon: Landmark, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Departments', value: stats.departments ?? 0, icon: Settings, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { name: 'Locations & Sections', value: stats.sections ?? 0, icon: MapPin, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
    ];

    return (
        <AdminLayout title="Backoffice Dashboard">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Backoffice Control Panel</h1>
                    <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Ringkasan statistik data master sistem administrasi terintegrasi AIMS.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {statCards.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{c.name}</span>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{c.value}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
