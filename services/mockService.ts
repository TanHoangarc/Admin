import { WebNfcProfile, BASE_URL_PREFIX } from '../types';

// Initial mock data based on user request
const INITIAL_DATA: WebNfcProfile[] = [
  {
    id: '1',
    name: 'Andy',
    slug: 'Andy.github.io',
    fullUrl: `${BASE_URL_PREFIX}Andy.github.io/`,
    visits: 1240,
    interactions: 340,
    lastActive: '2023-10-25',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jaden',
    slug: 'Jaden.github.io',
    fullUrl: `${BASE_URL_PREFIX}Jaden.github.io/`,
    visits: 850,
    interactions: 120,
    lastActive: '2023-10-26',
    status: 'active',
  },
  {
    id: '3',
    name: 'TanHoang',
    slug: 'Tan.github.io',
    fullUrl: `${BASE_URL_PREFIX}Tan.github.io/`,
    visits: 2100,
    interactions: 890,
    lastActive: '2023-10-24',
    status: 'active',
  }
];

const STORAGE_KEY = 'nfc_admin_data';

export const getProfiles = (): WebNfcProfile[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const addProfile = (name: string, slugRaw: string): WebNfcProfile => {
  const profiles = getProfiles();
  
  // Clean slug input to ensure consistency
  let slug = slugRaw.trim();
  if (!slug.endsWith('.github.io')) {
    slug += '.github.io';
  }

  const newProfile: WebNfcProfile = {
    id: Date.now().toString(),
    name,
    slug,
    fullUrl: `${BASE_URL_PREFIX}${slug}/`,
    visits: 0,
    interactions: 0,
    lastActive: new Date().toISOString().split('T')[0],
    status: 'active',
  };

  const updated = [...profiles, newProfile];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newProfile;
};

export const deleteProfile = (id: string): void => {
  const profiles = getProfiles();
  const updated = profiles.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateProfile = (id: string, updates: Partial<WebNfcProfile>): void => {
    const profiles = getProfiles();
    const updated = profiles.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}