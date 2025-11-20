
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
    title: 'Leader Business Development',
    headerTitleVi: 'Lâm Ngọc Vũ',
    footerRoleVi: 'Leader Team Sale 1 – Công ty Long Hoàng Logistics',
    bio: 'Kinh nghiệm nhiều năm trong lĩnh vực Logistics.\nChuyên về FCL, LCL và vận chuyển hàng không.\nCung cấp trọn gói dịch vụ: Tư vấn – Báo giá – Đặt chỗ – Theo dõi lô hàng.\nCam kết giao hàng đúng tiến độ, tối ưu chi phí.\nSẵn sàng hỗ trợ 24/7.',
    
    titleEn: 'Leader Business Development',
    headerTitleEn: 'Mr. Andy',
    footerRoleEn: 'Leader Team Sale 1 – Long Hoang Logistics Company',
    bioEn: 'Many years of experience in the Logistics industry.\nSpecialized in FCL, LCL, and Air Freight.\nProviding end-to-end services: Consulting – Quotation – Booking – Shipment Tracking.\nCommitted to on-time delivery and cost optimization.\nAvailable 24/7 for support.',
    
    phoneNumber: '0972133680',
    zaloNumber: '0972133680',
    avatarUrl: 'https://i.ibb.co/4RKTydDT/Andy.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    socialLinks: [
        { 
            id: 's1', 
            platform: 'facebook', 
            label: 'Facebook', 
            url: 'https://www.facebook.com/share/1BtMe8vCaB/?mibextid=wwXIfr',
            iconUrl: 'https://i.ibb.co/67VF7N5R/Facebook.png'
        },
        { 
            id: 's2', 
            platform: 'zalo', 
            label: 'Zalo', 
            url: 'https://zalo.me/0972133680',
            iconUrl: 'https://i.ibb.co/d4nRhVQV/Zalo.png'
        }
    ],
    projects: []
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
    title: 'Interior Designer',
    headerTitleVi: 'Jaden Nguyen',
    footerRoleVi: 'Designer tại Studio X',
    bio: 'Creating spaces that breathe.',
    phoneNumber: '0909888777',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jaden',
    coverUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    socialLinks: [],
    projects: []
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
    title: 'Project Manager',
    headerTitleVi: 'Tan Hoang',
    footerRoleVi: 'PM tại Tech Corp',
    bio: 'Everything on time, under budget.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tan',
    socialLinks: [],
    projects: []
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

export const addProfile = (profileData: Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>): WebNfcProfile => {
  const profiles = getProfiles();
  
  // Clean slug input to ensure consistency
  let slug = profileData.slug.trim();
  // Remove generic URL parts if user pasted full URL
  slug = slug.replace('https://', '').replace('http://', '').replace(BASE_URL_PREFIX, '');
  
  if (!slug.endsWith('.github.io')) {
    slug += '.github.io';
  }

  const newProfile: WebNfcProfile = {
    id: Date.now().toString(),
    ...profileData,
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
