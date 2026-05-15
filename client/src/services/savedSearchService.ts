import { api } from './api';
import { FilterState } from '../types/search';

export interface SavedSearch {
  id:         number;
  name:       string;
  filters:    Partial<FilterState>;
  created_at: string;
}

export const savedSearchService = {
  getAll: () => api.get<SavedSearch[]>('/saved-searches'),

  save: (name: string, filters: Partial<FilterState>) =>
    api.post<SavedSearch>('/saved-searches', { name, filters }),

  delete: (id: number) => api.delete<{ success: boolean }>(`/saved-searches/${id}`),
};
