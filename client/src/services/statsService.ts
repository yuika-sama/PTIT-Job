import { BaseApiService, ApiResponse } from './baseApi';

export interface StatsData {
  totalJobs: number;
  newJobsToday: number;
  totalCompanies: number;
  activeApplicants: number;
}

export interface JobStatsData {
  total: number;
  active: number;
  newToday: number;
  byType: { [key: string]: number };
  byLocation: { [key: string]: number };
}

export interface CompanyStatsData {
  total: number;
  verified: number;
  bySize: { [key: string]: number };
  withJobs: number;
}

export interface UserStatsData {
  total: number;
  active: number;
  byRole: { [key: string]: number };
  newThisWeek: number;
}

export class StatsService extends BaseApiService {
  // Get general stats for dashboard
  async getGeneralStats(): Promise<ApiResponse<StatsData>> {
    console.log('🔄 Fetching general stats for dashboard');
    return this.get<StatsData>('/stats/general');
  }

  // Get detailed job statistics
  async getJobStats(): Promise<ApiResponse<JobStatsData>> {
    console.log('🔄 Fetching job statistics');
    return this.get<JobStatsData>('/stats/jobs');
  }

  // Get detailed company statistics
  async getCompanyStats(): Promise<ApiResponse<CompanyStatsData>> {
    console.log('🔄 Fetching company statistics');
    return this.get<CompanyStatsData>('/stats/companies');
  }

  // Get detailed user statistics
  async getUserStats(): Promise<ApiResponse<UserStatsData>> {
    console.log('🔄 Fetching user statistics');
    return this.get<UserStatsData>('/stats/users');
  }

  // Get all stats in one call for efficiency
  async getAllStats(): Promise<ApiResponse<{
    general: StatsData;
    jobs: JobStatsData;
    companies: CompanyStatsData;
    users: UserStatsData;
  }>> {
    console.log('🔄 Fetching all statistics');
    return this.get<{
      general: StatsData;
      jobs: JobStatsData;
      companies: CompanyStatsData;
      users: UserStatsData;
    }>('/stats/all');
  }
}

export const statsService = new StatsService();