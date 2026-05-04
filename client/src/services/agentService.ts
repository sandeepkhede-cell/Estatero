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
  getById: (id: string | number) =>
    api.get<Agent>(`/agents/${id}`),

  contact: (agentId: string | number, payload: ContactPayload) =>
    api.post<{ success: boolean }>(`/agents/${agentId}/contact`, payload),
};
