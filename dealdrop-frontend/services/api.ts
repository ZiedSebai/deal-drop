import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.81.22.67:3000';
const TOKEN_KEY = 'jwt_token';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  location: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    location: string;
  };
}

interface UserProfile {
  _id: string;
  email: string;
  name: string;
  location: string;
}

interface CreateItemData {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
}

interface Item {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  sellerId?: string;
  createdAt: string;
}

interface ItemFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface ItemsResponse {
  items: Item[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.clearToken();
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      const message = (error.response.data as any)?.message;
      return message || `Error: ${error.response.status}`;
    } else if (error.request) {
      return 'No response from server. Please check your connection.';
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  }

  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/register', data);
    await this.saveToken(response.data.token);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/login', data);
    await this.saveToken(response.data.token);
    return response.data;
  }

  async getMe(): Promise<UserProfile> {
    const response = await this.axiosInstance.get<UserProfile>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.clearToken();
  }

  async createItem(data: CreateItemData): Promise<Item> {
    const response = await this.axiosInstance.post<Item>('/items', data);
    return response.data;
  }

  async getAllItems(filters?: ItemFilters): Promise<ItemsResponse> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const response = await this.axiosInstance.get<ItemsResponse>('/items', {
      params,
    });
    return response.data;
  }

  async getItemById(id: string): Promise<Item> {
    const response = await this.axiosInstance.get<Item>(`/items/${id}`);
    return response.data;
  }

  async uploadImage(uri: string): Promise<string> {
    const formData = new FormData();

    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri,
      name: filename,
      type,
    } as any);

    const response = await this.axiosInstance.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }
}

export const apiService = new ApiService();
export type { RegisterData, LoginData, AuthResponse, UserProfile, CreateItemData, Item, ItemFilters, ItemsResponse };
