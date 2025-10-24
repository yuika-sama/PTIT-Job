import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseApiService {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token only
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('🔍 API Request:', {
          url: config.url,
          method: config.method,
          authHeader: config.headers.Authorization ? 'Bearer ***' : 'None'
        });

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', {
          url: response.config.url,
          status: response.status,
          success: response.data?.success,
          dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A'
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          responseData: error.response?.data,
          authHeader: error.config?.headers?.Authorization ? 'Bearer ***' : 'None'
        });

        // Handle 401 - Token expired
        if (error.response?.status === 401) {
          console.warn('🔐 Authentication failed - clearing local storage and redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('ptitjob_user');
          window.location.href = '/login';
        }

        // Handle 403 - Forbidden (insufficient permissions)
        if (error.response?.status === 403) {
          console.warn('🚫 Access denied - insufficient permissions for this operation');
        }

        return Promise.reject(error);
      }
    );
  }

  // GET request
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST request
  protected async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT request
  protected async put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE request
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PATCH request
  protected async patch<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
    } else {
      // Something else happened
      return new Error(error.message || 'Đã xảy ra lỗi không xác định');
    }
  }
}