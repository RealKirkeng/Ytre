'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    theme?: string;
    font?: 'default' | 'serif' | 'opensans' | 'hyperlegible' | 'comic';
    isAdmin: boolean;
}

let cachedUser: AuthUser | null | undefined = undefined; // undefined = not yet fetched

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null | undefined>(cachedUser);
    const [loading, setLoading] = useState(cachedUser === undefined);

    useEffect(() => {
        if (cachedUser !== undefined) { setUser(cachedUser); setLoading(false); return; }
        fetch('/api/auth/me', { cache: 'no-store' })
            .then(r => r.json())
            .then((data: AuthUser | null) => {
                cachedUser = data;
                setUser(data);
                setLoading(false);
            })
            .catch(() => { cachedUser = null; setLoading(false); });
    }, []);

    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' });
        cachedUser = null;
        setUser(null);
    }, []);

    const refreshUser = useCallback(() => {
        cachedUser = undefined;
        setLoading(true);
        fetch('/api/auth/me', { cache: 'no-store' })
            .then(r => r.json())
            .then((data: AuthUser | null) => { cachedUser = data; setUser(data); setLoading(false); })
            .catch(() => { cachedUser = null; setUser(null); setLoading(false); });
    }, []);

    return { user: user ?? null, loading, logout, refreshUser };
}
