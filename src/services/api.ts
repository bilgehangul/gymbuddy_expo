import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { User, Session, Match, Message, Theme, AuthTokens, LoginResponse, MatchCandidate } from '../types';
import { getApiBaseUrl } from '../utils/networkConfig';

const BASE_URL = getApiBaseUrl();

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const tokens = await AsyncStorage.getItem('tokens');
        if (tokens) {
          const { accessToken } = JSON.parse(tokens);
          if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = await AsyncStorage.getItem('tokens');
            if (tokens) {
              const { refreshToken } = JSON.parse(tokens);
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const newTokens = response.data.tokens;
              await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));

              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await AsyncStorage.multiRemove(['user', 'tokens']);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    try {
      console.log(`API GET: ${BASE_URL}${url}`);
      const response: AxiosResponse<T> = await this.client.get(url);
      return response.data;
    } catch (error: any) {
      console.error(`API GET Error: ${BASE_URL}${url}`, error.response?.data || error.message);
      throw error;
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      console.log(`API POST: ${BASE_URL}${url}`, data);
      const response: AxiosResponse<T> = await this.client.post(url, data);
      return response.data;
    } catch (error: any) {
      console.error(`API POST Error: ${BASE_URL}${url}`, error.response?.data || error.message);
      throw error;
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      console.log(`API PUT: ${BASE_URL}${url}`, data);
      const response: AxiosResponse<T> = await this.client.put(url, data);
      return response.data;
    } catch (error: any) {
      console.error(`API PUT Error: ${BASE_URL}${url}`, error.response?.data || error.message);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      console.log(`API DELETE: ${BASE_URL}${url}`);
      const response: AxiosResponse<T> = await this.client.delete(url);
      return response.data;
    } catch (error: any) {
      console.error(`API DELETE Error: ${BASE_URL}${url}`, error.response?.data || error.message);
      throw error;
    }
  }

  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

const apiClient = new ApiClient();

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (userData: any): Promise<LoginResponse> => {
    return apiClient.post('/auth/register', userData);
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  refresh: async (refreshToken: string): Promise<{ tokens: AuthTokens }> => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },
};

export const userApi = {
  getProfile: async (): Promise<{ user: User }> => {
    return apiClient.get('/users/profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    return apiClient.put('/users/profile', userData);
  },

  uploadPhoto: async (photo: FormData): Promise<{ photoUrl: string; user: User }> => {
    return apiClient.uploadFile('/users/upload-photo', photo);
  },

  getSchools: async (): Promise<{ schools: Array<{ school: string; displayName: string }> }> => {
    return apiClient.get('/users/schools');
  },
};

export const sessionApi = {
  getSessions: async (): Promise<{ userSessions: Session[]; potentialMatches: MatchCandidate[] }> => {
    return apiClient.get('/sessions');
  },

  createSession: async (sessionData: Partial<Session>): Promise<{ session: Session }> => {
    return apiClient.post('/sessions', sessionData);
  },

  getMySessions: async (): Promise<{ sessions: Session[] }> => {
    return apiClient.get('/sessions/my-sessions');
  },

  updateSession: async (id: string, sessionData: Partial<Session>): Promise<{ session: Session }> => {
    return apiClient.put(`/sessions/${id}`, sessionData);
  },

  deleteSession: async (id: string): Promise<{ session: Session }> => {
    return apiClient.delete(`/sessions/${id}`);
  },
};

export const matchApi = {
  getMatches: async (): Promise<{ matches: Match[] }> => {
    return apiClient.get('/matches');
  },

  acceptMatch: async (id: string): Promise<{ match: Match }> => {
    return apiClient.post(`/matches/${id}/accept`);
  },

  declineMatch: async (id: string): Promise<{ match: Match }> => {
    return apiClient.post(`/matches/${id}/decline`);
  },
};

export const messageApi = {
  getMessages: async (matchId: string): Promise<{ messages: Message[] }> => {
    return apiClient.get(`/messages/${matchId}`);
  },

  sendMessage: async (matchId: string, text: string): Promise<{ data: Message }> => {
    return apiClient.post(`/messages/${matchId}`, { text });
  },
};

export const themeApi = {
  getTheme: async (school: string): Promise<Theme> => {
    const response = await apiClient.get<{ theme: Theme }>(`/themes/${school}`);
    return response.theme;
  },

  getAllThemes: async (): Promise<Theme[]> => {
    const response = await apiClient.get<{ themes: Theme[] }>('/themes');
    return response.themes;
  },
};

export default apiClient;