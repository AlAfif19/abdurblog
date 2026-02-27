import { defineStore } from 'pinia';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(useCookie('access_token').value || null);
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  // Computed headers for authenticated requests
  const authHeaders = computed(() => ({
    Authorization: token.value ? `Bearer ${token.value}` : '',
  }));

  // Fetch helpers
  const apiFetch = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders.value,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw error;
    }

    return response.json();
  };

  const apiFetchFormData = async <T = any>(
    endpoint: string,
    formData: FormData
  ): Promise<T> => {
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: 'POST',
      headers: {
        ...authHeaders.value,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw error;
    }

    return response.json();
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await fetch(`${apiBase}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      token.value = data.accessToken;
      useCookie('access_token').value = data.accessToken;
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  };

  // Actions
  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch<{ accessToken: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      token.value = data.accessToken;
      user.value = data.user;
      useCookie('access_token').value = data.accessToken;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.error || 'Login failed',
      };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = await apiFetch<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });

      user.value = data.user;
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.error || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      token.value = null;
      user.value = null;
      useCookie('access_token').value = null;
    }
  };

  const fetchUser = async () => {
    if (!token.value) return false;

    try {
      const data = await apiFetch<{ user: User }>('/api/auth/me');
      user.value = data.user;
      return true;
    } catch (error) {
      // Try refresh token
      const refreshed = await refreshToken();
      if (refreshed) {
        return await fetchUser();
      }
      return false;
    }
  };

  // Create post
  const createPost = async (formData: FormData) => {
    try {
      const data = await apiFetchFormData('/api/posts', formData);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.error || 'Failed to create post',
      };
    }
  };

  // Initialize auth state on app load
  const initAuth = async () => {
    if (token.value) {
      await fetchUser();
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    authHeaders,
    login,
    register,
    logout,
    fetchUser,
    createPost,
    initAuth,
    apiFetch,
  };
});
