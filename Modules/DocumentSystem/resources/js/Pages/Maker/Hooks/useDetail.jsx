import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useDetail(id) {
    const [document, setDocument] = useState(null);
    const [canApproveL1, setCanApproveL1] = useState(false);
    const [canApproveL2, setCanApproveL2] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [notes, setNotes] = useState('');
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingRouting, setLoadingRouting] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
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
        setLoadingApprove(true);
        setLoadingMessage('Memproses watermark & menerbitkan dokumen...');
        axios.post(`/api/document-system/documents/approve/${document.id}`, { level: 1, notes })
        .then(() => { fetchDocumentDetails(); })
        .catch(err => { alert('Gagal memproses persetujuan.'); console.error(err); })
        .finally(() => { setLoadingApprove(false); setLoadingMessage(''); setNotes(''); });
    }, [document, notes, fetchDocumentDetails]);

    const handleRouting = useCallback(() => {
        if (!document) return;
        setLoadingRouting(true);
        setLoadingMessage('Meneruskan dokumen untuk persetujuan...');
        axios.post(`/api/document-system/documents/route/${document.id}`, { notes })
            .then(() => { fetchDocumentDetails(); })
            .catch(err => { alert('Gagal meneruskan dokumen.'); console.error(err); })
            .finally(() => { setLoadingRouting(false); setLoadingMessage(''); setNotes(''); });
    }, [document, notes, fetchDocumentDetails]);

    const [isConfirmRoutingOpen, setIsConfirmRoutingOpen] = useState(false);

    const [rejectFiles, setRejectFiles] = useState([]);

    const handleReject = useCallback(() => {
        if (!document) return;
        if (!notes.trim()) {
            alert('Catatan/Alasan return wajib diisi untuk menolak dokumen.');
            return;
        }
        setLoadingReject(true);

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
            setLoadingReject(false);
            setNotes('');
            setIsRejectModalOpen(false);
        });
    }, [document, notes, rejectFiles, fetchDocumentDetails]);

    const showApproval = document ? (
        canApproveL1 && (String(document.status) === '1' || String(document.status) === '3')
    ) : false;

    const handleDeleteAttachment = useCallback((attachmentId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus lampiran ini?')) return;

        axios.post(`/api/document-system/attachments/${attachmentId}/delete`, {})
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
        loadingApprove,
        loadingRouting,
        loadingReject,
        loadingMessage,
        isRejectModalOpen,
        setIsRejectModalOpen,
        isConfirmRoutingOpen,
        setIsConfirmRoutingOpen,
        rejectFiles,
        setRejectFiles,
        handleApprove,
        handleRouting,
        handleReject,
        showApproval,
        handleDeleteAttachment
    };
}
