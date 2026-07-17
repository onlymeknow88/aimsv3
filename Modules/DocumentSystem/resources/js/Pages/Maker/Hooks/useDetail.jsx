import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useDetail(id) {
    const [document, setDocument] = useState(null);
    const [canApproveL1, setCanApproveL1] = useState(false);
    const [canApproveL2, setCanApproveL2] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
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
            setNotes('');
        });
    }, [document, notes, fetchDocumentDetails]);

    const handleReject = useCallback(() => {
        if (!document) return;
        if (!notes.trim()) {
            alert('Catatan/Alasan return wajib diisi untuk menolak dokumen.');
            return;
        }
        setLoading(true);
        axios.post(`/api/document-system/documents/reject/${document.id}`, {
            reason: notes
        })
        .then(() => {
            fetchDocumentDetails();
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
    }, [document, notes, fetchDocumentDetails]);

    const showApproval = document ? (
        (canApproveL1 && String(document.status) === '1') || // level 1 and waiting review
        (canApproveL2 && (String(document.status) === '3' || String(document.status) === '6')) // level 2 and rooting or prepare rooting
    ) : false;

    return {
        document,
        canApproveL1,
        canApproveL2,
        loadingData,
        notes,
        setNotes,
        loading,
        isRejectModalOpen,
        setIsRejectModalOpen,
        handleApprove,
        handleReject,
        showApproval
    };
}
