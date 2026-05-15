import { api } from './api';

export interface AgentStats {
  totalViews:       number;
  totalListings:    number;
  totalEnquiries:   number;
  responseRate:     number | null;
  avgResponseHours: number | null;
}

export const analyticsService = {
  getMyStats: () => api.get<AgentStats>('/analytics/stats'),
};
