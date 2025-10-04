/**
 * Player registration request data
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Player login request data
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Player authentication response
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

/**
 * User data
 */
export interface User {
  id: string;
  username: string;
  email: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
