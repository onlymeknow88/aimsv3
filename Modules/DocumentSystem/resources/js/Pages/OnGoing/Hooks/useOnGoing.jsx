import { useState, useCallback } from 'react';

export default function useOnGoing() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const openDrawer = useCallback((doc) => { setSelectedDoc(doc); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedDoc(null); }, []);

    return { drawerOpen, selectedDoc, openDrawer, closeDrawer };
}
