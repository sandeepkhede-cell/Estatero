import { api } from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from '../types/auth';

export const authService = {
  login:    (payload: LoginPayload)    => api.post<AuthResponse>('/auth/login',    payload),
  register: (payload: RegisterPayload) => api.post<AuthResponse>('/auth/register', payload),
  me:       ()                         => api.get<AuthUser>('/auth/me'),
};
