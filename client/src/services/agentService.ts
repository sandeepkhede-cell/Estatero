import { api } from './api';
import { Agent, Property } from '../types/property';

export interface ContactPayload {
  message:     string;
  name?:       string;
  email?:      string;
  phone?:      string;
  propertyId?: number | string;
}

export interface MyAgentProfile {
  id:            number;
  agencyName:    string | null;
  bio:           string | null;
  licenseNumber: string | null;
  profileImage:  string | null;
  rating:        number;
  listingsCount: number;
}

export interface UpdateAgentProfileInput {
  agencyName?:    string | null;
  bio?:           string | null;
  licenseNumber?: string | null;
  profileImage?:  string | null;
}

export const agentService = {
  getAll: (search?: string) => {
    const params = new URLSearchParams();
    if (search?.trim()) params.set('search', search.trim());
    const qs = params.toString();
    return api.get<{ agents: Agent[]; total: number }>(`/agents${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string | number) =>
    api.get<Agent>(`/agents/${id}`),

  getProperties: (agentId: string | number) =>
    api.get<Property[]>(`/agents/${agentId}/properties`),

  contact: (agentId: string | number, payload: ContactPayload) =>
    api.post<{ success: boolean }>(`/agents/${agentId}/contact`, payload),

  getMe: () =>
    api.get<MyAgentProfile | null>('/agents/me'),

  updateMe: (input: UpdateAgentProfileInput) =>
    api.patch<MyAgentProfile>('/agents/me', input),
};
