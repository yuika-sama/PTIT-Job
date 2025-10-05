import { BaseApiService, ApiResponse } from './baseApi';
import { Job, CreateJobRequest } from './types';

export class JobService extends BaseApiService {
  private readonly endpoint = '/jobs';

  // Get all jobs with pagination
  async getAllJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Job[]>> {
    console.log('🔄 Fetching all jobs with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    
    return this.get<Job[]>(url);
  }

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    console.log('🔄 Fetching job with id:', id);
    return this.get<Job>(`${this.endpoint}/${id}`);
  }

  async createJob(jobData: CreateJobRequest): Promise<ApiResponse<Job>> {
    console.log('🔄 Creating job with data:', jobData);
    return this.post<Job, CreateJobRequest>(this.endpoint, jobData);
  }

  async updateJob(id: string, jobData: Partial<CreateJobRequest>): Promise<ApiResponse<Job>> {
    console.log('🔄 Updating job with id:', id, 'data:', jobData);
    return this.put<Job, Partial<CreateJobRequest>>(`${this.endpoint}/${id}`, jobData);
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    console.log('🔄 Deleting job with id:', id);
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Search jobs
  async searchJobs(criteria: {
    title?: string;
    company_id?: number;
    location_id?: number;
    category_id?: number;
    job_type?: string;
    experience_level?: string;
  }): Promise<ApiResponse<Job[]>> {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    return this.get<Job[]>(`${this.endpoint}/search?${params.toString()}`);
  }

  // Get featured jobs
  async getFeaturedJobs(): Promise<ApiResponse<Job[]>> {
    return this.get<Job[]>(`${this.endpoint}/featured`);
  }
}

export const jobService = new JobService();