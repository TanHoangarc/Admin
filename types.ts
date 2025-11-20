
export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'zalo' | 'linkedin' | 'website' | 'other' | 'whatsapp' | 'wechat' | 'email' | 'map' | 'momo' | 'bank';
  label: string;
  url: string;
  iconUrl?: string;
  qrImageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  detailImageUrls?: string[];
}

export interface WebNfcProfile {
  id: string;
  name: string; // e.g., "Andy"
  slug: string; // e.g., "Andy.github.io" - used for URL construction
  fullUrl: string;
  
  // Stats
  visits: number;
  lastActive: string;
  interactions: number;
  status: 'active' | 'maintenance';

  // Content for Generating the Page
  title?: string; // e.g. "Senior Architect"
  bio?: string;
  
  // English Content
  titleEn?: string;
  bioEn?: string;

  phoneNumber?: string;
  zaloNumber?: string;
  
  avatarUrl?: string;
  coverUrl?: string;
  socialLinks: SocialLink[];
  projects?: Project[];
}

export interface VisitData {
  name: string;
  visits: number;
  interactions: number;
}

export const BASE_URL_PREFIX = "https://tanhoangarc.github.io/";
