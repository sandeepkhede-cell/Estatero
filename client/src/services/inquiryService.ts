import { api } from './api';

export interface Inquiry {
  id:                number;
  property_id:       number | null;
  agent_id:          number | null;
  sender_name:       string | null;
  sender_email:      string | null;
  sender_phone:      string | null;
  message:           string;
  is_read:           boolean;
  reply_message:     string | null;
  replied_at:        string | null;
  created_at:        string;
  property_title:    string | null;
  property_location: string | null;
  property_city:     string | null;
}

export const inquiryService = {
  getAll: () =>
    api.get<{ inquiries: Inquiry[]; unreadCount: number }>('/inquiries'),

  markRead: (id: number) =>
    api.patch<{ success: boolean }>(`/inquiries/${id}/read`, {}),

  getUnreadCount: () =>
    api.get<{ count: number }>('/inquiries/unread'),

  reply: (id: number, message: string) =>
    api.post<{ success: boolean; repliedAt: string }>(`/inquiries/${id}/reply`, { message }),
};
