
import { AuthUser, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'nfc_auth_user';
const ACCOUNTS_STORAGE_KEY = 'nfc_accounts';

// Hardcoded specific accounts as requested
const SYSTEM_ACCOUNTS = [
    { username: 'tanhoangarc', password: 'Hoang@2609#', role: 'admin' as UserRole },
    { username: '0972133680', password: 'Jwc@123', role: 'user' as UserRole }
];

export const getStoredUser = (): AuthUser | null => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
};

export const login = (username: string, password: string, remember: boolean): AuthUser | null => {
    // 1. Check System Accounts
    let account = SYSTEM_ACCOUNTS.find(acc => acc.username === username && acc.password === password);

    // 2. Check Created Accounts (LocalStorage)
    if (!account) {
        const createdAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
        account = createdAccounts.find((acc: any) => acc.username === username && acc.password === password);
    }

    if (account) {
        const user: AuthUser = {
            username: account.username,
            role: account.role,
            isLoggedIn: true
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
    // Check if exists in system
    if (SYSTEM_ACCOUNTS.find(acc => acc.username === username)) return false;

    const createdAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
    
    // Check if exists in local storage
    if (createdAccounts.find((acc: any) => acc.username === username)) return false;

    const newAccount = { username, password, role: 'user' as UserRole };
    createdAccounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(createdAccounts));
    
    return true;
};

export const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

export const checkSession = (): AuthUser | null => {
    // Check Local Storage (Remember Me)
    const local = localStorage.getItem(AUTH_STORAGE_KEY);
    if (local) return JSON.parse(local);

    // Check Session Storage (One time login)
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (session) return JSON.parse(session);

    return null;
};
