import { UserModel } from '../models/UserModel.js';
import { JobModel } from '../models/JobModel.js';
import { CompanyModel } from '../models/CompanyModel.js';

export class StatsController {
    static async getGeneralStats(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 StatsController.getGeneralStats called');


            const [users, jobs, companies] = await Promise.all([
                UserModel.findAll(),
                JobModel.findAll(),
                CompanyModel.findAll()
            ]);


            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newJobsToday = jobs.filter(job => {
                const jobDate = new Date(job.created_at);
                jobDate.setHours(0, 0, 0, 0);
                return jobDate.getTime() === today.getTime();
            }).length;

            const activeApplicants = users.filter(user => 
                user.role === 'candidate' && user.is_active
            ).length;

            const stats = {
                totalJobs: jobs.length,
                newJobsToday: newJobsToday,
                totalCompanies: companies.length,
                activeApplicants: activeApplicants
            };

            console.log('✅ General stats calculated:', stats);
            return {
                success: true,
                data: stats,
                message: 'General statistics retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getGeneralStats:', error);
            throw new Error(error.message || 'Failed to get general statistics');
        }
    }

    static async getJobStats(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 StatsController.getJobStats called');
            const jobs = await JobModel.findAll();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newToday = jobs.filter(job => {
                const jobDate = new Date(job.created_at);
                jobDate.setHours(0, 0, 0, 0);
                return jobDate.getTime() === today.getTime();
            }).length;

            const byType = jobs.reduce((acc: any, job) => {
                acc[job.job_type || 'Unknown'] = (acc[job.job_type || 'Unknown'] || 0) + 1;
                return acc;
            }, {});

            const stats = {
                total: jobs.length,
                active: jobs.filter(job => job.status === 'published').length,
                newToday: newToday,
                byType: byType
            };

            console.log('✅ Job stats calculated:', stats);
            return {
                success: true,
                data: stats,
                message: 'Job statistics retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getJobStats:', error);
            throw new Error(error.message || 'Failed to get job statistics');
        }
    }

    static async getCompanyStats(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 StatsController.getCompanyStats called');
            const [companies, jobs] = await Promise.all([
                CompanyModel.findAll(),
                JobModel.findAll()
            ]);

            const bySize = companies.reduce((acc: any, company) => {
                const size = company.company_size || 'Unknown';
                acc[size] = (acc[size] || 0) + 1;
                return acc;
            }, {});

            const companiesWithJobs = new Set(jobs.map(job => job.company_id)).size;

            const stats = {
                total: companies.length,
                bySize: bySize,
                withJobs: companiesWithJobs
            };

            console.log('✅ Company stats calculated:', stats);
            return {
                success: true,
                data: stats,
                message: 'Company statistics retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getCompanyStats:', error);
            throw new Error(error.message || 'Failed to get company statistics');
        }
    }

    static async getUserStats(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 StatsController.getUserStats called');
            const users = await UserModel.findAll();

            // Calculate new users this week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newThisWeek = users.filter(user => 
                new Date(user.created_at) >= oneWeekAgo
            ).length;

            const byRole = users.reduce((acc: any, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});

            const stats = {
                total: users.length,
                active: users.filter(user => user.is_active).length,
                byRole: byRole,
                newThisWeek: newThisWeek
            };

            console.log('✅ User stats calculated:', stats);
            return {
                success: true,
                data: stats,
                message: 'User statistics retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getUserStats:', error);
            throw new Error(error.message || 'Failed to get user statistics');
        }
    }

    static async getAllStats(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            console.log('🔍 StatsController.getAllStats called');

            const [generalStats, jobStats, companyStats, userStats] = await Promise.all([
                this.getGeneralStats(),
                this.getJobStats(),
                this.getCompanyStats(),
                this.getUserStats()
            ]);

            const allStats = {
                general: generalStats.data,
                jobs: jobStats.data,
                companies: companyStats.data,
                users: userStats.data
            };

            console.log('✅ All stats retrieved successfully');
            return {
                success: true,
                data: allStats,
                message: 'All statistics retrieved successfully'
            };
        } catch (error: any) {
            console.error('❌ Error in getAllStats:', error);
            throw new Error(error.message || 'Failed to get all statistics');
        }
    }
}