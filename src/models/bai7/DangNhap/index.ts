import { useState, useCallback, useEffect } from 'react';
import type { Account } from '@/services/Bai7';
import { mockAccounts } from '@/services/Bai7';

const STORAGE_KEY = 'bai7-current-user';

export default () => {
    const [currentUser, setCurrentUser] = useState<Account | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedUsername = window.localStorage.getItem(STORAGE_KEY);
        if (savedUsername) {
            const acc = mockAccounts.find(a => a.username === savedUsername);
            if (acc) setCurrentUser(acc);
        }
    }, []);

    const login = useCallback((username: string, password?: string) => {
        const acc = mockAccounts.find(a => a.username === username && a.password === password);
        if (acc) {
            setCurrentUser(acc);
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, acc.username);
            }
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    return { currentUser, login, logout };
};
