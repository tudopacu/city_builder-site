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
  player?: Player;
  message?: string;
}

/**
 * User data
 */
export interface Player {
  id: string;
  username: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  player: Player | null;
  loading: boolean;
  error: string | null;
}
