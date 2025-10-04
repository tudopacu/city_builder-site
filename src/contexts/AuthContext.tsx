import { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { AuthState, RegisterRequest, LoginRequest } from '../types/auth';
import { authApi } from '../modules/authApi';

/**
 * Authentication context interface
 */
export interface AuthContextType extends AuthState {
  register: (data: RegisterRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  TOKEN: 'city_builder_token',
  USER: 'city_builder_user',
} as const;

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth functions to child components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  /**
   * Initialize auth state from local storage
   */
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Register a new player
   */
  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const response = await authApi.register(data);
    
    if (response.success && response.token && response.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      setState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
      return true;
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: response.message || 'Registration failed',
      }));
      return false;
    }
  }, []);

  /**
   * Login a player
   */
  const login = useCallback(async (data: LoginRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const response = await authApi.login(data);
    
    if (response.success && response.token && response.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      setState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
      return true;
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: response.message || 'Login failed',
      }));
      return false;
    }
  }, []);

  /**
   * Logout the current player
   */
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (state.token) {
      await authApi.logout(state.token);
    }
    
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
