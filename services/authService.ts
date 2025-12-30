
import { AuthUser, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'nfc_auth_user';
const ACCOUNTS_STORAGE_KEY = 'nfc_accounts';

// Hardcoded specific accounts as requested
// IDs correspond to mockService.ts: '1' (Andy), '2' (Jaden), '3' (TanHoang)
const SYSTEM_ACCOUNTS = [
    { username: 'tanhoangarc', password: 'Hoang@2609#', role: 'admin' as UserRole },
    { username: 'admin', password: 'admin123', role: 'admin' as UserRole },
    // Sales Accounts (assigned specific profiles)
    { username: 'sales_andy', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['1'] }, 
    { username: 'sales_jaden', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['2'] },
    { username: 'sales_all', password: '123', role: 'sales' as UserRole, allowedProfileIds: ['1', '2', '3'] },
    // Account Role (No access to Manage Pages)
    { username: 'account_user', password: '123', role: 'account' as UserRole }
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
    let account: any = SYSTEM_ACCOUNTS.find(acc => acc.username === username && acc.password === password);

    // 2. Check Created Accounts (LocalStorage) - defaulting created users to 'sales' with no profiles or 'account' based on logic? 
    // For now, let's keep created users as 'account' role for safety, or 'sales' with no access.
    // Let's assume signups are 'account' role by default in this new logic.
    if (!account) {
        const createdAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
        account = createdAccounts.find((acc: any) => acc.username === username && acc.password === password);
    }

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
    // Check if exists in system
    if (SYSTEM_ACCOUNTS.find(acc => acc.username === username)) return false;

    const createdAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
    
    // Check if exists in local storage
    if (createdAccounts.find((acc: any) => acc.username === username)) return false;

    // Default new signups to 'account' role (least privilege)
    const newAccount = { username, password, role: 'account' as UserRole };
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