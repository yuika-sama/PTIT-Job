import { BaseApiService, ApiResponse } from './baseApi';
import { Resume } from './types';

export class ResumeService extends BaseApiService {
  private readonly endpoint = '/resumes';

  async getAllResumes(): Promise<ApiResponse<Resume[]>> {
    return this.get<Resume[]>(this.endpoint);
  }

  async getResumeById(id: number): Promise<ApiResponse<Resume>> {
    return this.get<Resume>(`${this.endpoint}/${id}`);
  }

  async uploadResume(file: File, userId: number): Promise<ApiResponse<Resume>> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('user_id', userId.toString());

    const response = await this.client.post<ApiResponse<Resume>>(
      this.endpoint,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteResume(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async getResumesByUser(userId: number): Promise<ApiResponse<Resume[]>> {
    return this.get<Resume[]>(`${this.endpoint}/user/${userId}`);
  }

  async downloadResume(id: number): Promise<Blob> {
    const response = await this.client.get(`${this.endpoint}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const resumeService = new ResumeService();