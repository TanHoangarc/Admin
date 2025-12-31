
import { AuthUser, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'nfc_auth_user';
const ACCOUNTS_STORAGE_KEY = 'nfc_accounts';

// Default accounts configuration
const DEFAULT_ACCOUNTS = [
    { id: '1', username: 'tanhoangarc', password: 'Hoang@2609#', role: 'admin' as UserRole, allowedProfileIds: [] },
    { id: '2', username: 'admin', password: 'admin123', role: 'admin' as UserRole, allowedProfileIds: [] },
    { id: '3', username: 'sales_andy', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['1'] }, 
    { id: '4', username: 'sales_jaden', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['2'] },
    // Updated account credential
    { id: '5', username: 'account', password: 'Jwc123', role: 'account' as UserRole, allowedProfileIds: [] }
];

// Initialize and Sync accounts in localStorage
const initializeAccounts = () => {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    // Parse stored accounts or start with defaults
    let accounts = stored ? JSON.parse(stored) : [...DEFAULT_ACCOUNTS];

    // STRICTLY enforce the 'account' user credentials from code (ID: 5)
    // This ensures that password changes in code overwrite old localStorage data.
    const codeAccountUser = DEFAULT_ACCOUNTS.find(a => a.id === '5');
    if (codeAccountUser) {
        const existingIndex = accounts.findIndex((a: any) => a.id === '5' || a.username === 'account');
        if (existingIndex !== -1) {
            // Overwrite existing entry with code version
            accounts[existingIndex] = codeAccountUser;
        } else {
            // Add if missing
            accounts.push(codeAccountUser);
        }
        // Save back to storage immediately
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }
    
    // If storage was empty, we need to save the full defaults
    if (!stored) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
    }

    return accounts;
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
