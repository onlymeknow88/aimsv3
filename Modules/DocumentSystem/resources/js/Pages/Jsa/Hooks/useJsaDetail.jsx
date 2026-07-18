import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useJsaDetail(id) {
    const [document, setDocument] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const fetchJsaDetails = useCallback(() => {
        setLoadingData(true);
        axios.get(`/api/document-system/jsa/${id}`)
            .then(res => {
                const data = res.data?.result;
                if (data) {
                    setDocument(data.document);
                }
            })
            .catch(err => console.error("Error loading JSA details", err))
            .finally(() => setLoadingData(false));
    }, [id]);

    useEffect(() => {
        fetchJsaDetails();
    }, [fetchJsaDetails]);

    return {
        document,
        loadingData,
    };
}
