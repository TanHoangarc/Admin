
import { AuthUser, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'nfc_auth_user';
const ACCOUNTS_STORAGE_KEY = 'nfc_accounts';

// Default accounts to initialize if storage is empty
const DEFAULT_ACCOUNTS = [
    { id: '1', username: 'tanhoangarc', password: 'Hoang@2609#', role: 'admin' as UserRole, allowedProfileIds: [] },
    { id: '2', username: 'admin', password: 'admin123', role: 'admin' as UserRole, allowedProfileIds: [] },
    { id: '3', username: 'sales_andy', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['1'] }, 
    { id: '4', username: 'sales_jaden', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['2'] },
    { id: '5', username: 'account', password: 'Jwc123', role: 'account' as UserRole, allowedProfileIds: [] }
];

// Initialize accounts in localStorage
const initializeAccounts = () => {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
    }
    return JSON.parse(stored);
};

export const getStoredUser = (): AuthUser | null => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
};

export const getAccounts = (): any[] => {
    return initializeAccounts();
};

export const createAccount = (accountData: any) => {
    const accounts = getAccounts();
    if (accounts.find((a: any) => a.username === accountData.username)) {
        return false; // User exists
    }
    const newAccount = { ...accountData, id: Date.now().toString() };
    const updated = [...accounts, newAccount];
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
    return newAccount;
};

export const updateAccount = (id: string, updates: any) => {
    const accounts = getAccounts();
    const updated = accounts.map((a: any) => a.id === id ? { ...a, ...updates } : a);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
};

export const deleteAccount = (id: string) => {
    const accounts = getAccounts();
    const updated = accounts.filter((a: any) => a.id !== id);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
};

export const login = (username: string, password: string, remember: boolean): AuthUser | null => {
    const accounts = getAccounts();
    const account = accounts.find((acc: any) => acc.username === username && acc.password === password);

    if (account) {
        const user: AuthUser = {
            username: account.username,
            role: account.role,
            isLoggedIn: true,
            allowedProfileIds: account.allowedProfileIds || []
        };

        if (remember) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        }
        return user;
    }

    return null;
};

export const signup = (username: string, password: string): boolean => {
    return !!createAccount({ username, password, role: 'account', allowedProfileIds: [] });
};

export const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

export const checkSession = (): AuthUser | null => {
    const local = localStorage.getItem(AUTH_STORAGE_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (session) return JSON.parse(session);
    return null;
};
