import { api } from './api';
import { Agent } from '../types/property';

export interface ContactPayload {
  message:     string;
  name?:       string;
  email?:      string;
  phone?:      string;
  propertyId?: number | string;
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

  contact: (agentId: string | number, payload: ContactPayload) =>
    api.post<{ success: boolean }>(`/agents/${agentId}/contact`, payload),
};
