
import { Role } from '../types';

export interface FilterState {
  query: string;
  platforms: string[];
  categories: string[];
  countries: string[];
  verification: string[]; // 'verified', 'unverified', 'premium'
  minPrice: string; // Using string for input handling, convert to number for logic
  maxPrice: string;
  minSize: string;
  maxSize: string;
  sort: 'relevance' | 'newest' | 'rating' | 'price_asc' | 'price_desc';
}

export const INITIAL_FILTERS: FilterState = {
  query: '',
  platforms: [],
  categories: [],
  countries: [],
  verification: [],
  minPrice: '',
  maxPrice: '',
  minSize: '',
  maxSize: '',
  sort: 'relevance'
};

export const parseUrlParams = (searchString: string): FilterState => {
  const params = new URLSearchParams(searchString);
  
  return {
    query: params.get('q') || '',
    platforms: params.get('platforms')?.split(',').filter(Boolean) || [],
    categories: params.get('categories')?.split(',').filter(Boolean) || [],
    countries: params.get('countries')?.split(',').filter(Boolean) || [],
    verification: params.get('verification')?.split(',').filter(Boolean) || [],
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    minSize: params.get('minSize') || '',
    maxSize: params.get('maxSize') || '',
    sort: (params.get('sort') as any) || 'relevance'
  };
};

export const toUrlParams = (filters: FilterState): string => {
  const params = new URLSearchParams();
  
  if (filters.query) params.set('q', filters.query);
  if (filters.platforms.length > 0) params.set('platforms', filters.platforms.join(','));
  if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
  if (filters.countries.length > 0) params.set('countries', filters.countries.join(','));
  if (filters.verification.length > 0) params.set('verification', filters.verification.join(','));
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.minSize) params.set('minSize', filters.minSize);
  if (filters.maxSize) params.set('maxSize', filters.maxSize);
  if (filters.sort !== 'relevance') params.set('sort', filters.sort);
  
  return params.toString();
};

// --- SAVED VIEWS (LOCAL STORAGE) ---
export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: number;
}

const STORAGE_KEY = 'cm_saved_views';

export const getSavedViews = (): SavedView[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load saved views", e);
    return [];
  }
};

export const saveView = (name: string, filters: FilterState): SavedView[] => {
  try {
    const current = getSavedViews();
    const newView: SavedView = {
      id: `view_${Date.now()}`,
      name,
      filters,
      createdAt: Date.now()
    };
    const updated = [newView, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const deleteView = (id: string): SavedView[] => {
  try {
    const current = getSavedViews();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};
