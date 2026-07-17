import { useState, useCallback } from 'react';

export default function useObsolete() {
    const [search, setSearch] = useState('');
    return { search, setSearch };
}
