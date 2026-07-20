import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useDetail(id) {
    const [document, setDocument] = useState(null);
    const [canApproveL1, setCanApproveL1] = useState(false);
    const [canApproveL2, setCanApproveL2] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const fetchDocumentDetails = useCallback(() => {
        setLoadingData(true);
        axios.get(`/api/document-system/documents/${id}`)
            .then(res => {
                const data = res.data?.result;
                if (data) {
                    setDocument(data.document);
                    setCanApproveL1(data.canApproveL1);
                    setCanApproveL2(data.canApproveL2);
                }
            })
            .catch(err => console.error("Error loading document details", err))
            .finally(() => setLoadingData(false));
    }, [id]);

    useEffect(() => {
        fetchDocumentDetails();
    }, [fetchDocumentDetails]);

    const handleApprove = useCallback(() => {
        if (!document) return;
        const level = String(document.status) === '1' ? 1 : 2;

        setLoading(true);
        // Level 2 triggers watermarking which can take a few seconds
        setLoadingMessage(level === 2
            ? 'Memproses watermark & menerbitkan dokumen...'
            : 'Memproses persetujuan...'
        );

        axios.post(`/api/document-system/documents/approve/${document.id}`, {
            level,
            notes
        })
        .then(() => {
            fetchDocumentDetails();
        })
        .catch(err => {
            alert('Gagal memproses persetujuan.');
            console.error(err);
        })
        .finally(() => {
            setLoading(false);
            setLoadingMessage('');
            setNotes('');
        });
    }, [document, notes, fetchDocumentDetails]);

    const [rejectFiles, setRejectFiles] = useState([]);

    const handleReject = useCallback(() => {
        if (!document) return;
        if (!notes.trim()) {
            alert('Catatan/Alasan return wajib diisi untuk menolak dokumen.');
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('reason', notes);
        rejectFiles.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        axios.post(`/api/document-system/documents/reject/${document.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
            fetchDocumentDetails();
            setRejectFiles([]);
        })
        .catch(err => {
            alert('Gagal memproses penolakan.');
            console.error(err);
        })
        .finally(() => {
            setLoading(false);
            setNotes('');
            setIsRejectModalOpen(false);
        });
    }, [document, notes, rejectFiles, fetchDocumentDetails]);

    const showApproval = document ? (
        (canApproveL1 && String(document.status) === '1') || // level 1 and waiting review
        (canApproveL2 && (String(document.status) === '3' || String(document.status) === '6')) // level 2 and rooting or prepare rooting
    ) : false;

    const handleDeleteAttachment = useCallback((attachmentId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus lampiran ini?')) return;

        axios.delete(`/api/document-system/attachments/${attachmentId}`)
            .then(() => {
                fetchDocumentDetails();
            })
            .catch(err => {
                alert('Gagal menghapus lampiran.');
                console.error(err);
            });
    }, [fetchDocumentDetails]);

    return {
        document,
        canApproveL1,
        canApproveL2,
        loadingData,
        notes,
        setNotes,
        loading,
        loadingMessage,
        isRejectModalOpen,
        setIsRejectModalOpen,
        rejectFiles,
        setRejectFiles,
        handleApprove,
        handleReject,
        showApproval,
        handleDeleteAttachment
    };
}
