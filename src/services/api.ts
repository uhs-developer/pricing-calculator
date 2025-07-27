// API Service Layer for Backend Integration
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Base API Configuration
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000;

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.name === 'AbortError') {
      return new Error('Request timeout');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new Error('Network error - please check your connection');
    }
    
    return error;
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set boundary for FormData
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(([key]) => key !== 'Content-Type')
        ),
      },
    });
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Product API endpoints
export const productApi = {
  getAll: () => apiService.get<any[]>('/products'),
  getById: (id: string) => apiService.get<any>(`/products/${id}`),
  create: (product: any) => apiService.post<any>('/products', product),
  update: (id: string, product: any) => apiService.put<any>(`/products/${id}`, product),
  delete: (id: string) => apiService.delete<any>(`/products/${id}`),
  import: (file: File) => apiService.uploadFile<any>('/products/import', file),
  export: (format: string) => apiService.get<Blob>(`/products/export?format=${format}`),
};

// Package API endpoints
export const packageApi = {
  getAll: () => apiService.get<any[]>('/packages'),
  getById: (id: string) => apiService.get<any>(`/packages/${id}`),
  create: (pkg: any) => apiService.post<any>('/packages', pkg),
  update: (id: string, pkg: any) => apiService.put<any>(`/packages/${id}`, pkg),
  delete: (id: string) => apiService.delete<any>(`/packages/${id}`),
  import: (file: File) => apiService.uploadFile<any>('/packages/import', file),
  export: (format: string) => apiService.get<Blob>(`/packages/export?format=${format}`),
};

// User API endpoints
export const userApi = {
  getAll: () => apiService.get<any[]>('/users'),
  getById: (id: string) => apiService.get<any>(`/users/${id}`),
  create: (user: any) => apiService.post<any>('/users', user),
  update: (id: string, user: any) => apiService.put<any>(`/users/${id}`, user),
  delete: (id: string) => apiService.delete<any>(`/users/${id}`),
  import: (file: File) => apiService.uploadFile<any>('/users/import', file),
  export: (format: string) => apiService.get<Blob>(`/users/export?format=${format}`),
};

// Pricing API endpoints
export const pricingApi = {
  getRules: () => apiService.get<any[]>('/pricing/rules'),
  updateRule: (id: string, rule: any) => apiService.put<any>(`/pricing/rules/${id}`, rule),
  getCurrencyRates: () => apiService.get<any[]>('/pricing/currency-rates'),
  updateCurrencyRate: (id: string, rate: any) => apiService.put<any>(`/pricing/currency-rates/${id}`, rate),
};

// Analytics API endpoints
export const analyticsApi = {
  getDashboard: () => apiService.get<any>('/analytics/dashboard'),
  getReports: (type: string, dateRange: any) => apiService.post<any>('/analytics/reports', { type, dateRange }),
  getMetrics: (metrics: string[]) => apiService.post<any>('/analytics/metrics', { metrics }),
};

// Authentication API endpoints
export const authApi = {
  login: (credentials: any) => apiService.post<any>('/auth/login', credentials),
  logout: () => apiService.post<any>('/auth/logout'),
  register: (userData: any) => apiService.post<any>('/auth/register', userData),
  refreshToken: () => apiService.post<any>('/auth/refresh'),
  forgotPassword: (email: string) => apiService.post<any>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => apiService.post<any>('/auth/reset-password', { token, password }),
};