export interface User {
  id?: number;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token?: string;
  user: {
    id?: number;
    email: string;
    fullName: string;
  };
  requiresVerification: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}
