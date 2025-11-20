export interface WebNfcProfile {
  id: string;
  name: string; // e.g., "Andy"
  slug: string; // e.g., "Andy.github.io" - used for URL construction
  fullUrl: string;
  visits: number;
  lastActive: string;
  interactions: number;
  status: 'active' | 'maintenance';
}

export interface VisitData {
  name: string;
  visits: number;
  interactions: number;
}

export const BASE_URL_PREFIX = "https://tanhoangarc.github.io/";