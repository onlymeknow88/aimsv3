import React from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InvitedPeopleInput from './Partials/Components/InvitedPeopleInput';
import FileDropzone from './Partials/Components/FileDropzone';
import SearchableSelect from './Partials/Components/SearchableSelect';
import SummernoteEditor from './Partials/Components/SummernoteEditor';
import useMaker from './Hooks/useMaker';

export default function Create() {
    const {
        loading,
        companies, departments, pjs, modules, categories, mappings, activeSops,
        company, setCompany,
        department, setDepartment,
        pj, setPj,
        module, setModule,
        category, setCategory,
        mapping, setMapping,
        uploadType, setUploadType,
        documentLevel, setDocumentLevel,
        sopNumber, setSopNumber,
        winNumber, setWinNumber,
        title, setTitle,
        description, setDescription,
        invitedEmails, setInvitedEmails,
        files, setFiles,
        parentDocumentId, setParentDocumentId,
        docCreated, setDocCreated,
        handleSave
    } = useMaker();

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title="Create New Document" />

            {/* Header Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', maxWidth: '800px', margin: '0 auto 24px auto' }}>
                <a href="/document-system/active" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Active Document
                </a>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Siklus Pembuatan Dokumen Baru</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium)' }}>

                    {/* Section 1: Owner Info */}
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

                    {/* Section 2: Mapping Info */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Mapping Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>MODULE</label>
                                <SearchableSelect options={modules} value={module} onChange={setModule} placeholder="Pilih Modul..." />
                            </div>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
                                <SearchableSelect options={categories} value={category} onChange={setCategory} placeholder="Pilih Kategori..." />
                            </div>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>MAPPING</label>
                                <SearchableSelect options={mappings} value={mapping} onChange={setMapping} placeholder="Pilih Mapping..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Document Content */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Document
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>JENIS UPLOAD</label>
                                <select value={uploadType} onChange={e => setUploadType(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                    <option value="">Select Jenis Upload</option>
                                    <option value="document">📄 Dokumen (PDF/Word)</option>
                                    <option value="record">🎥 Rekaman</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>DOCUMENT LEVEL</label>
                                <select value={documentLevel} onChange={e => setDocumentLevel(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                    <option value="">Select Document Level</option>
                                    <option value="SOP">SOP (Standard Operating Procedure)</option>
                                    <option value="TS">TS (Technical Standard)</option>
                                    <option value="MN">MN (Manual)</option>
                                    <option value="WIN">WIN (Work Instruction)</option>
                                    <option value="FORM">FORM (Formulir)</option>
                                </select>
                            </div>

                            {uploadType === 'document' && documentLevel === 'WIN' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>SOP NUMBER</label>
                                        <select
                                            value={parentDocumentId}
                                            onChange={e => {
                                                const selectedId = e.target.value;
                                                setParentDocumentId(selectedId);
                                                const selectedSop = activeSops.find(s => s.id == selectedId);
                                                if (selectedSop) {
                                                    setSopNumber(selectedSop.sop_number);
                                                } else {
                                                    setSopNumber('');
                                                }
                                            }}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}
                                        >
                                            <option value="">Choose document</option>
                                            {activeSops.map(sopItem => (
                                                <option key={sopItem.id} value={sopItem.id}>
                                                    {sopItem.full_code} {sopItem.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                            WIN NUMBER
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', overflow: 'hidden' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', backgroundColor: '#e2e8f0', color: '#475569', fontSize: '11px', fontWeight: 600, borderRight: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                                WIN-{companies.find(c => c.id === company)?.code || 'MAC'}-{departments.find(d => d.id === department)?.document_code || ''}-
                                            </span>
                                            <input
                                                value={winNumber}
                                                onChange={e => setWinNumber(e.target.value)}
                                                required
                                                placeholder="Number"
                                                style={{ width: '100%', padding: '10px 12px', border: 'none', outline: 'none', fontSize: '11px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {uploadType === 'document' && documentLevel === 'SOP' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                            DOCUMENT NUMBER
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', overflow: 'hidden' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', backgroundColor: '#e2e8f0', color: '#475569', fontSize: '11px', fontWeight: 600, borderRight: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                                {companies.find(c => c.id === company)?.code || 'MAC'}-{departments.find(d => d.id === department)?.document_code || ''}-
                                            </span>
                                            <input
                                                value={sopNumber}
                                                onChange={e => setSopNumber(e.target.value)}
                                                required
                                                placeholder="e.g. 001"
                                                style={{ width: '100%', padding: '10px 12px', border: 'none', outline: 'none', fontSize: '11px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Section 3: Detailed Document */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Detailed Document
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Title</label>
                                <input 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    required 
                                    placeholder="Document title" 
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} 
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Date of Create Document</label>
                                <input 
                                    type="date"
                                    value={docCreated} 
                                    onChange={e => setDocCreated(e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Invited People */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Invited People
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <SearchableSelect options={pjs} value={invitedEmails} onChange={setInvitedEmails} placeholder="Select Employee" isMulti={true} />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Description */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Description
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <SummernoteEditor value={description} onChange={setDescription} placeholder="Tuliskan deskripsi singkat mengenai isi dokumen..." />
                        </div>
                    </div>

                    {/* Section 6: Upload File */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            Upload File Lampiran
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <FileDropzone onFileDrop={setFiles} />
                            {files.length > 0 && (
                                <div style={{ marginTop: '8px', fontSize: '10.5px', color: 'var(--success)' }}>
                                    ✓ {files.length} file dipilih: {files.map(f => f.name).join(', ')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <a href="/document-system/maker" style={{ padding: '10px 20px', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}>
                            Cancel
                        </a>
                        <button onClick={() => handleSave('draft')} disabled={loading || !title} style={{ padding: '10px 20px', border: '1px solid var(--primary)', background: '#fff', color: 'var(--primary)', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            Save as Draft
                        </button>
                        <button onClick={() => handleSave('review')} disabled={loading || !title} style={{ padding: '10px 24px', border: 'none', background: 'var(--primary)', color: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            Submit for Review
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
