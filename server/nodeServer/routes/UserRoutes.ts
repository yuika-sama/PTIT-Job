import { Elysia } from 'elysia';
import { UserController } from '../controllers/UserController.js';

export const userRoutes = new Elysia()
    .group('/users', (app) => 
        app
            .get('', async (context: any) => {
                try {
                    console.log('🔍 GET /users request (no auth) with query:', context.query);
                    const result = await UserController.getAllUsers(context.query);
                    console.log('✅ Users fetched successfully:', result.data?.length || 0, 'users');
                    return result;
                } catch (error: any) {
                    console.error('❌ Error fetching users:', error);
                    context.set.status = 500;
                    return {
                        success: false,
                        message: error.message || 'Failed to get users'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Get all users with optional pagination and filters'
                }
            })
            
            .get('/:id', async (context: any) => {
                try {
                    console.log('🔍 GET /users/:id request (no auth):', context.params.id);
                    return await UserController.getUserById({ params: context.params });
                } catch (error: any) {
                    context.set.status = error.message.includes('not found') ? 404 : 500;
                    return {
                        success: false,
                        message: error.message || 'Failed to get user'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Get user by ID'
                }
            })

            .get('/stats', async (context: any) => {
                try {
                    console.log('🔍 GET /users/stats request (no auth)');
                    return await UserController.getUserStats();
                } catch (error: any) {
                    console.error('❌ Error getting user stats:', error);
                    context.set.status = 500;
                    return {
                        success: false,
                        message: error.message || 'Failed to get user statistics'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Get user statistics'
                }
            })  
            
            .post('', async (context: any) => {
                try {
                    console.log('🔍 POST /users request (no auth)', context.body);
                    return await UserController.createUser({ body: context.body });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Failed to create user'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Create user'
                }
            })
            
            .put('/:id', async (context: any) => {
                try {
                    console.log('🔍 PUT /users/:id request (no auth):', context.params.id);
                    return await UserController.updateUser({ 
                        params: context.params, 
                        body: context.body 
                    });
                } catch (error: any) {
                    context.set.status = error.message.includes('not found') ? 404 : 400;
                    return {
                        success: false,
                        message: error.message || 'Failed to update user'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Update user'
                }
            })

            .patch('/:id/toggle-status', async (context: any) => {
                try {
                    console.log('🔍 PATCH /users/:id/toggle-status request (no auth):', context.params.id);
                    return await UserController.toggleUserStatus({ params: context.params });
                } catch (error: any) {
                    context.set.status = error.message.includes('not found') ? 404 : 500;
                    return {
                        success: false,
                        message: error.message || 'Failed to toggle user status'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Toggle user active status'
                }
            })
            
            .delete('/:id', async (context: any) => {
                try {
                    console.log('🔍 DELETE /users/:id request (no auth):', context.params.id);
                    return await UserController.deleteUser({ params: context.params });
                } catch (error: any) {
                    context.set.status = error.message.includes('not found') ? 404 : 500;
                    return {
                        success: false,
                        message: error.message || 'Failed to delete user'
                    };
                }
            }, {
                detail: { 
                    tags: ['Users'],
                    summary: 'Delete user'
                }
            })
    )