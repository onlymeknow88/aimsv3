import React from 'react';
import FileDropzone from '@/Components/FileDropzone';

// Daftar kolom lampiran proposal — sama persis dengan Detail.jsx
// (ATTACH_FIELDS) dan kolom ko_attachments di API updateAttachments.
export const ATTACH_FIELDS = [
    ['stnk', 'STNK'], ['nota_pajak', 'Nota Pajak'], ['surat_pengantar', 'Surat Pengantar'],
    ['re_manufacture', 'Re-Manufacture'], ['oem', 'OEM'], ['dokumen_sertifikat', 'Dokumen Sertifikat'],
    ['inspeksi_p3k', 'Inspeksi P3K'], ['kir', 'KIR'], ['uji_pjit', 'Uji PJIT'],
    ['pra_komisioning', 'Pra Komisioning'], ['setting_radio', 'Setting Radio'], ['slo', 'SLO'],
    ['komisioning_internal', 'Komisioning Internal'], ['com', 'COM'],
];

const label = { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' };

// Grid input berkas lampiran. Dipakai form Create & Edit agar berkas bisa
// diunggah langsung saat buat/edit proposal (tanpa mampir ke Detail).
// files: {field: File}, existing: {field: url-string} opsional (mode Edit).
export default function AttachmentInputs({ files = {}, onPick, existing = {} }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
            {ATTACH_FIELDS.map(([key, text]) => (
                <div key={key}>
                    <label style={label}>{text}</label>
                    {existing?.[key] && !files[key] && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Saat ini: {String(existing[key]).split('/').pop()}
                        </div>
                    )}
                    <FileDropzone
                        accept=".pdf"
                        onFileDrop={(dropped) => {
                            if (dropped.length && onPick) onPick(key, dropped[0]);
                        }}
                    />
                    {files[key] && (
                        <div style={{ fontSize: '11px', color: 'var(--success, #2FBF71)', marginTop: '4px' }}>Baru: {files[key].name}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Bangun FormData untuk PUT /api/ko/proposals/:id/attachments
// (parity Detail.jsx saveAttachments).
export function buildAttachmentFormData(files = {}, existing = {}) {
    const fd = new FormData();
    ATTACH_FIELDS.forEach(([k]) => {
        if (files[k]) {
            fd.append(`file_${k}`, files[k]);
        } else {
            fd.append(k, existing?.[k] ?? '');
        }
    });
    fd.append('_method', 'PUT');
    return fd;
}
