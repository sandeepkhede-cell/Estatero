import { api } from './api';
import type { LoginPayload, RegisterPayload, AuthResponse, AuthUser } from '../types/auth';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  me: () =>
    api.get<AuthUser>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post<{ success: boolean }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ success: boolean }>('/auth/reset-password', { token, password }),
};
