import { create } from 'zustand';
import { authService, LoginData, RegisterData, AuthResponse } from '@/services/authService';

interface AuthState {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),

  login: async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    const response = await authService.register(data);
    set({ user: response.user, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
