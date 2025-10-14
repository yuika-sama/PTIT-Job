import { Elysia } from 'elysia';
import { StatsController } from '../controllers/StatsController.js';

export const statsRoutes = new Elysia()
    .group('/stats', (app) => 
        app
            .get('/general', async (context: any) => {
                try {
                    console.log('🔍 GET /stats/general request');
                    return await StatsController.getGeneralStats();
                } catch (error: any) {
                    console.error('❌ Error getting general stats:', error);
                    return {
                        success: false,
                        data: null,
                        message: error.message || 'Failed to get general statistics'
                    };
                }
            }, {
                detail: {
                    tags: ['Stats'],
                    summary: 'Get general statistics for dashboard'
                }
            })

            .get('/jobs', async (context: any) => {
                try {
                    console.log('🔍 GET /stats/jobs request');
                    return await StatsController.getJobStats();
                } catch (error: any) {
                    console.error('❌ Error getting job stats:', error);
                    return {
                        success: false,
                        data: null,
                        message: error.message || 'Failed to get job statistics'
                    };
                }
            }, {
                detail: {
                    tags: ['Stats'],
                    summary: 'Get detailed job statistics'
                }
            })

            .get('/companies', async (context: any) => {
                try {
                    console.log('🔍 GET /stats/companies request');
                    return await StatsController.getCompanyStats();
                } catch (error: any) {
                    console.error('❌ Error getting company stats:', error);
                    return {
                        success: false,
                        data: null,
                        message: error.message || 'Failed to get company statistics'
                    };
                }
            }, {
                detail: {
                    tags: ['Stats'],
                    summary: 'Get detailed company statistics'
                }
            })

            .get('/users', async (context: any) => {
                try {
                    console.log('🔍 GET /stats/users request');
                    return await StatsController.getUserStats();
                } catch (error: any) {
                    console.error('❌ Error getting user stats:', error);
                    return {
                        success: false,
                        data: null,
                        message: error.message || 'Failed to get user statistics'
                    };
                }
            }, {
                detail: {
                    tags: ['Stats'],
                    summary: 'Get detailed user statistics'
                }
            })

            .get('/all', async (context: any) => {
                try {
                    console.log('🔍 GET /stats/all request');
                    return await StatsController.getAllStats();
                } catch (error: any) {
                    console.error('❌ Error getting all stats:', error);
                    return {
                        success: false,
                        data: null,
                        message: error.message || 'Failed to get all statistics'
                    };
                }
            }, {
                detail: {
                    tags: ['Stats'],
                    summary: 'Get all statistics in one call'
                }
            })
    );