import { api } from './api';

export interface LocationSuggestion {
  label: string;
  type: 'city' | 'locality' | 'landmark';
}

export const searchService = {
  getSuggestions: (query: string) =>
    api.get<LocationSuggestion[]>(`/search/suggestions?q=${encodeURIComponent(query)}`),

  getPopularSearches: () =>
    api.get<string[]>('/search/popular'),

  trackSearch: (query: string) =>
    api.post<{ success: boolean }>('/search/track', { query }).catch(() => null),
};
