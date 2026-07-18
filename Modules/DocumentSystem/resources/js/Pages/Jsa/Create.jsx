import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import SearchableSelect from '../Maker/Partials/Components/SearchableSelect';
import SummernoteEditor from '../Maker/Partials/Components/SummernoteEditor';
import FileDropzone from '../Maker/Partials/Components/FileDropzone';
import InvitedPeopleInput from '../Maker/Partials/Components/InvitedPeopleInput';
import ConfirmationModal from '../Maker/Partials/Components/ConfirmationModal';
import useMaker from '../Maker/Hooks/useMaker';

export default function Create({ document = null }) {
    const isEdit = !!document;
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'draft' });

    const {
        loading,
        companies, departments, pjs,
        company, setCompany,
        department, setDepartment,
        pj, setPj,
        title, setTitle,
        description, setDescription,
        invitedEmails, setInvitedEmails,
        files, setFiles,
        docCreated, setDocCreated,
        handleSave
    } = useMaker(document);

    // Override handleSave for JSA API
    const handleJsaSave = async (statusType) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('work_type', title); // Map work_type to title/work_type
        formData.append('location', 'Office'); // Default/placeholder location
        formData.append('status', statusType === 'draft' ? '1' : '5'); // 1 = Draft, 5 = Active

        try {
            const url = isEdit 
                ? `/api/document-system/jsa/${document.id}` 
                : '/api/document-system/jsa';
            
            await axios.post(url, formData);
            window.location.href = '/document-system/jsa';
        } catch (err) {
            console.error('Failed to save JSA', err);
            alert('Gagal menyimpan JSA.');
        }
    };

    const handleConfirmSave = async () => {
        try {
            await handleJsaSave(confirmModal.type);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    const triggerSave = (type) => {
        setConfirmModal({ isOpen: true, type });
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title={isEdit ? "Edit JSA" : "Create New JSA"} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', maxWidth: '800px', margin: '0 auto 24px auto' }}>
                <a href="/document-system/jsa" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke JSA
                </a>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Siklus Pembuatan JSA Baru</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium)' }}>

                    {/* Owner Info */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Owner Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>COMPANY</label>
                                <SearchableSelect options={companies} value={company} onChange={setCompany} placeholder="Pilih Perusahaan..." />
                            </div>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>DEPARTMENT</label>
                                <SearchableSelect options={departments} value={department} onChange={setDepartment} placeholder="Pilih Departemen..." />
                            </div>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>PENANGGUNG JAWAB</label>
                                <SearchableSelect options={pjs} value={pj} onChange={setPj} placeholder="Pilih Penanggung Jawab..." />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Document */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Detailed Document
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>TITLE</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    placeholder="Masukkan Judul Dokumen..." 
                                    style={{ width: '100%', height: '40px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px', fontSize: '12px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>DATE OF CREATE DOCUMENT</label>
                                <input 
                                    type="date" 
                                    value={docCreated} 
                                    onChange={e => setDocCreated(e.target.value)} 
                                    style={{ width: '100%', height: '40px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px', fontSize: '12px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invited People */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Invited People
                        </h3>
                        <InvitedPeopleInput invitedEmails={invitedEmails} setInvitedEmails={setInvitedEmails} />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Description
                        </h3>
                        <SummernoteEditor value={description} onChange={setDescription} />
                    </div>

                    {/* Attachment */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Attachment
                        </h3>
                        <FileDropzone files={files} setFiles={setFiles} />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <a href="/document-system/jsa" style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 20px', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                            Cancel
                        </a>
                        <button onClick={() => triggerSave('draft')} style={{ height: '40px', padding: '0 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Save as Draft
                        </button>
                        <button onClick={() => triggerSave('submit')} style={{ height: '40px', padding: '0 20px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Submit JSA
                        </button>
                    </div>

                </div>
            </div>

            <ConfirmationModal 
                isOpen={confirmModal.isOpen} 
                type={confirmModal.type} 
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                onConfirm={handleConfirmSave} 
            />
        </div>
    );
}
