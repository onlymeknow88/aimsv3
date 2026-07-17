import { useState, useCallback } from 'react';

export default function useDraft() {
    const [search, setSearch] = useState('');
    return { search, setSearch };
}
