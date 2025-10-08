import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

/**
 * API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ' http://localhost:5000';

/**
 * Authentication API Module
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Register a new player
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Registration failed',
        };
      }

      return {
        success: true,
        player: result.player,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },

  /**
   * Login a player
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Login failed',
        };
      }

      return {
        success: true,
        player: result.player,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },

  /**
   * Logout a player
   */
  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Logout failed',
        };
      }

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },
};
