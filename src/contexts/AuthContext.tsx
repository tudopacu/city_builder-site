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
  validateSession: () => boolean;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  PLAYER: 'city_builder_user',  //todo: change value to the proper name of the project
  LAST_LOGIN_AT: 'city_builder_last_login_at',
} as const;

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(';').shift() || null;
  }

  return null;
};

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
    player: null,
    loading: true,
    error: null,
  });

  const validateSession = useCallback((): boolean => {
    const userJson = localStorage.getItem(STORAGE_KEYS.PLAYER);
    const lastLoginAt = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN_AT);
    const authToken = getCookie('auth_token');

    if (!userJson || !lastLoginAt || !authToken) {
      localStorage.removeItem(STORAGE_KEYS.PLAYER);
      localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN_AT);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        player: null,
        loading: false,
      }));
      return false;
    }

    const sessionAge = Date.now() - Number(lastLoginAt);

    if (Number.isNaN(sessionAge) || sessionAge > SESSION_MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEYS.PLAYER);
      localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN_AT);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        player: null,
        loading: false,
      }));
      return false;
    }

    return true;
  }, []);

  /**
   * Initialize auth state from local storage
   */
  useEffect(() => {
    const userJson = localStorage.getItem(STORAGE_KEYS.PLAYER);
    
    if (validateSession() && userJson) {
      try {
        const user = JSON.parse(userJson);
        setState({
          isAuthenticated: true,
          player: user,
          loading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEYS.PLAYER);
        localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN_AT);
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [validateSession]);

  /**
   * Register a new player
   */
  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const response = await authApi.register(data);
    
    if (response.success  && response.player) {
      localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(response.player));
      
      setState({
        isAuthenticated: false,
        player: null,
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
    
    if (response.success && response.player) {
      localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(response.player));
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN_AT, Date.now().toString());
      
      setState({
        isAuthenticated: true,
        player: response.player,
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

    try {
      await authApi.logout();
    } catch {}
    
    localStorage.removeItem(STORAGE_KEYS.PLAYER);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN_AT);
    
    setState({
      isAuthenticated: false,
      player: null,
      loading: false,
      error: null,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, validateSession }}>
      {children}
    </AuthContext.Provider>
  );
}
