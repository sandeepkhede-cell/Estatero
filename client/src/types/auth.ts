export interface AuthUser {
  id:    number;
  name:  string;
  email: string;
  role:  'buyer' | 'seller' | 'agent';
}

export interface AuthState {
  user:    AuthUser | null;
  token:   string | null;
  loading: boolean;
}

export interface LoginPayload    { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }
export interface AuthResponse    { token: string; user: AuthUser; }
