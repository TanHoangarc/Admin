
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
  name: string; // e.g., "Andy" - Internal Name / Slug base
  slug: string; // e.g., "Andy.github.io" - used for URL construction
  fullUrl: string;
  
  // Stats
  visits: number;
  lastActive: string;
  interactions: number;
  status: 'active' | 'maintenance';

  // Content for Generating the Page
  // Vietnamese
  title?: string; // Subtitle (Chức danh)
  bio?: string;   // Description
  headerTitleVi?: string; // NEW: Tên tiêu đề ở trên cùng
  footerRoleVi?: string;  // NEW: Chức vụ ở cuối cùng
  
  // English Content
  titleEn?: string; // Subtitle (Job Title)
  bioEn?: string;   // Description
  headerTitleEn?: string; // NEW: Header Title
  footerRoleEn?: string;  // NEW: Footer Role

  phoneNumber?: string;
  zaloNumber?: string;
  
  avatarUrl?: string;
  coverUrl?: string;
  mainQrUrl?: string; // NEW: Explicit QR Code Image URL
  socialLinks: SocialLink[];
  projects?: Project[];
}

export interface VisitData {
  name: string;
  visits: number;
  interactions: number;
}

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  username: string;
  role: UserRole;
  isLoggedIn: boolean;
}

export const BASE_URL_PREFIX = "https://tanhoangarc.github.io/";
