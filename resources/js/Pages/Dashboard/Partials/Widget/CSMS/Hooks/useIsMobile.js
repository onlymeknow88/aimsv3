import { useEffect, useState } from 'react';

/**
 * useIsMobile
 * Returns true when the viewport width is <= breakpoint (px).
 * Shared across all CSMS widget components.
 */
export default function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
    );

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);

    return isMobile;
}