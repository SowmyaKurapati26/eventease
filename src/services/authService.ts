import apiRequest from './api';
import { setAuthToken, removeAuthToken } from '@/lib/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Debug log
      console.log('Login data:', data);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid login data format');
      }

      const { email, password } = data;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const requestBody = {
        email: email.trim(),
        password: password
      };

      console.log('Sending login request with:', { email: requestBody.email, password: '***' });

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.token) {
        setAuthToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Auth service login error:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  logout() {
    removeAuthToken();
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};
