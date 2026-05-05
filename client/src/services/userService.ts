import { api } from './api';
import { Property } from '../types/property';

export interface UserProfile {
  id:         number;
  name:       string;
  email:      string;
  phone:      string | null;
  role:       string;
  created_at: string;
}

export const userService = {
  getById: (id: number) =>
    api.get<UserProfile>(`/users/${id}`),

  update: (id: number, body: { name?: string; phone?: string }) =>
    api.patch<UserProfile>(`/users/${id}`, body),

  getProperties: (id: number) =>
    api.get<Property[]>(`/users/${id}/properties`),
};
