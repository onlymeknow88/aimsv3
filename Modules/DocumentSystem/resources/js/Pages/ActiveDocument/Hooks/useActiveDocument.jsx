import { useState, useCallback } from 'react';
import axios from 'axios';

export default function useActiveDocument() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);

    const openPreview = useCallback((doc) => {
        setPreviewDoc(doc);
    }, []);

    const closePreview = useCallback(() => {
        setPreviewDoc(null);
    }, []);

    const downloadFile = useCallback(async (attachmentId, fileName) => {
        try {
            const response = await axios.get(`/api/document-system/attachments/${attachmentId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed', err);
        }
    }, []);

    return { search, setSearch, loading, previewDoc, openPreview, closePreview, downloadFile };
}
