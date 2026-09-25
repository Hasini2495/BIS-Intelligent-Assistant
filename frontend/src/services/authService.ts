import { apiClient } from '@/api/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  organization?: string;
  department?: string;
  isActive: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken?: string;
  tokenType?: string;
  user?: UserProfile;
  requires2Fa?: boolean;
  verificationId?: string;
  message?: string;
}

export interface TwoFactorStatusResponse {
  enabled: boolean;
  method?: string;
  maskedDestination?: string;
}

export interface GoogleAuthResponse {
  configured: boolean;
  authUrl?: string;
  message: string;
}

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (res.accessToken) {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('bis_token', res.accessToken);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    }
    return res;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    organization?: string;
    department?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.accessToken) {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('bis_token', res.accessToken);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    }
    return res;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>('/auth/me');
    localStorage.setItem('user', JSON.stringify(res));
    return res;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await apiClient.put<UserProfile>('/auth/profile', updates);
    localStorage.setItem('user', JSON.stringify(res));
    return res;
  },

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return await apiClient.post<{ success: boolean; message: string }>('/auth/change-password', passwords);
  },

  async get2FaStatus(): Promise<TwoFactorStatusResponse> {
    return await apiClient.get<TwoFactorStatusResponse>('/auth/2fa/status');
  },

  async setup2Fa(method: 'sms' | 'email' = 'sms'): Promise<{
    success: boolean;
    verificationId: string;
    message: string;
    maskedDestination?: string;
  }> {
    return await apiClient.post(`/auth/2fa/setup?method=${method}`);
  },

  async enable2Fa(verificationId: string, code: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.post('/auth/2fa/enable', { verificationId, code });
  },

  async disable2Fa(code?: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.post('/auth/2fa/disable', { code: code || '' });
  },

  async verify2FaLogin(verificationId: string, code: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/2fa/verify-login', { verificationId, code });
    if (res.accessToken) {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('bis_token', res.accessToken);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    }
    return res;
  },

  async getGoogleOAuthUrl(): Promise<GoogleAuthResponse> {
    return await apiClient.get<GoogleAuthResponse>('/auth/google/url');
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('bis_token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('token') || localStorage.getItem('bis_token'));
  }
};
