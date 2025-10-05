import { BaseApiService, ApiResponse } from './baseApi';
import { JobApplication, CreateJobApplicationRequest, ApplicationStatus } from './types';

interface GetApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobTitle?: string;
  company?: string;
}

export class JobApplicationService extends BaseApiService {
  private readonly endpoint = '/applications';

  async getAllApplications(params?: GetApplicationsParams): Promise<ApiResponse<JobApplication[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.jobTitle) queryParams.append('jobTitle', params.jobTitle);
    if (params?.company) queryParams.append('company', params.company);

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return this.get<JobApplication[]>(url);
  }

  async getApplicationById(id: string): Promise<ApiResponse<JobApplication>> {
    return this.get<JobApplication>(`${this.endpoint}/${id}`);
  }

  async createApplication(applicationData: CreateJobApplicationRequest): Promise<ApiResponse<JobApplication>> {
    return this.post<JobApplication, CreateJobApplicationRequest>(this.endpoint, applicationData);
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, note?: string): Promise<ApiResponse<JobApplication>> {
    return this.put<JobApplication, { status: ApplicationStatus; note?: string }>(`${this.endpoint}/${id}/status`, { status, note });
  }

  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Get applications by user
  async getApplicationsByUser(userId: string): Promise<ApiResponse<JobApplication[]>> {
    return this.get<JobApplication[]>(`${this.endpoint}/user/${userId}`);
  }

  // Get applications by job
  async getApplicationsByJob(jobId: string): Promise<ApiResponse<JobApplication[]>> {
    return this.get<JobApplication[]>(`${this.endpoint}/job/${jobId}`);
  }

  // Bulk status update
  async bulkUpdateStatus(applicationIds: string[], status: ApplicationStatus, note?: string): Promise<ApiResponse<void>> {
    return this.put<void, { applicationIds: string[]; status: ApplicationStatus; note?: string }>(`${this.endpoint}/bulk-status`, { 
      applicationIds, 
      status, 
      note 
    });
  }
}

export const jobApplicationService = new JobApplicationService();