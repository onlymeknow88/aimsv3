import { useState, useEffect } from 'react';

export default function useMaster() {
    const getTabFromUrl = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') || 'modules';
        }
        return 'modules';
    };

    const [activeTab, setActiveTab] = useState(getTabFromUrl());

    useEffect(() => {
        const handleUrlChange = () => {
            setActiveTab(getTabFromUrl());
        };
        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    // Sync tab when window location changes manually
    useEffect(() => {
        setActiveTab(getTabFromUrl());
    }, [typeof window !== 'undefined' ? window.location.search : '']);

    return { activeTab, setActiveTab };
}
