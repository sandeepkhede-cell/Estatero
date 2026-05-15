import { api } from './api';

export interface Project {
  id:             number;
  builder_id:     number;
  name:           string;
  description:    string | null;
  location:       string | null;
  city:           string | null;
  image:          string | null;
  status:         'ongoing' | 'completed' | 'upcoming';
  property_count: number;
  created_at:     string;
}

export interface CreateProjectInput {
  name:         string;
  description?: string;
  location?:    string;
  city?:        string;
  image?:       string;
  status?:      string;
}

export const projectService = {
  getMine: () => api.get<Project[]>('/projects/mine'),
  create:  (input: CreateProjectInput) => api.post<Project>('/projects', input),
  update:  (id: number, input: Partial<CreateProjectInput>) => api.patch<Project>(`/projects/${id}`, input),
  delete:  (id: number) => api.delete<{ success: boolean }>(`/projects/${id}`),
};
