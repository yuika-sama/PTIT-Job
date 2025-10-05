import { BaseApiService, ApiResponse } from './baseApi';
import { JobCategory, Location, CreateJobCategoryRequest, CreateLocationRequest } from './types';

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface GetLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  status?: string;
}

export class JobCategoryService extends BaseApiService {
  private readonly endpoint = '/categories';

  async getAllCategories(params?: GetCategoriesParams): Promise<ApiResponse<JobCategory[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return this.get<JobCategory[]>(url);
  }

  async getCategoryById(id: string): Promise<ApiResponse<JobCategory>> {
    return this.get<JobCategory>(`${this.endpoint}/${id}`);
  }

  async createCategory(categoryData: CreateJobCategoryRequest): Promise<ApiResponse<JobCategory>> {
    return this.post<JobCategory, CreateJobCategoryRequest>(this.endpoint, categoryData);
  }

  async updateCategory(id: string, categoryData: Partial<CreateJobCategoryRequest>): Promise<ApiResponse<JobCategory>> {
    return this.put<JobCategory, Partial<CreateJobCategoryRequest>>(`${this.endpoint}/${id}`, categoryData);
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Toggle category status
  async toggleCategoryStatus(id: string): Promise<ApiResponse<JobCategory>> {
    return this.put<JobCategory, {}>(`${this.endpoint}/${id}/toggle-status`, {});
  }
}

export class LocationService extends BaseApiService {
  private readonly endpoint = '/locations';

  async getAllLocations(params?: GetLocationsParams): Promise<ApiResponse<Location[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.status) queryParams.append('status', params.status);

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return this.get<Location[]>(url);
  }

  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    return this.get<Location>(`${this.endpoint}/${id}`);
  }

  async createLocation(locationData: CreateLocationRequest): Promise<ApiResponse<Location>> {
    return this.post<Location, CreateLocationRequest>(this.endpoint, locationData);
  }

  async updateLocation(id: string, locationData: Partial<CreateLocationRequest>): Promise<ApiResponse<Location>> {
    return this.put<Location, Partial<CreateLocationRequest>>(`${this.endpoint}/${id}`, locationData);
  }

  async deleteLocation(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Toggle location status
  async toggleLocationStatus(id: string): Promise<ApiResponse<Location>> {
    return this.put<Location, {}>(`${this.endpoint}/${id}/toggle-status`, {});
  }

  async searchLocations(query: string): Promise<ApiResponse<Location[]>> {
    return this.get<Location[]>(`${this.endpoint}/search?q=${encodeURIComponent(query)}`);
  }
}

export const jobCategoryService = new JobCategoryService();
export const locationService = new LocationService();