export type UserRole = 'buyer' | 'agent' | 'owner' | 'builder';

export interface AuthUser {
  id:    number;
  name:  string;
  email: string;
  role:  UserRole;
}

export interface AuthState {
  user:    AuthUser | null;
  token:   string | null;
  loading: boolean;
}

export interface LoginPayload    { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; role: UserRole; }
export interface AuthResponse    { token: string; user: AuthUser; }
