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
  PLAYER: 'city_builder_user',  //todo: change value to the proper name of the project
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
    player: null,
    loading: true,
    error: null,
  });

  /**
   * Initialize auth state from local storage
   */
  useEffect(() => {
    const userJson = localStorage.getItem(STORAGE_KEYS.PLAYER);
    
    if (userJson) {
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
    
    if (state.player) {
      await authApi.logout();
    }
    
    localStorage.removeItem(STORAGE_KEYS.PLAYER);
    
    setState({
      isAuthenticated: false,
      player: null,
      loading: false,
      error: null,
    });
  }, [state.player]);

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
