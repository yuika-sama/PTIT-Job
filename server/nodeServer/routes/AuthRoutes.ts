import { Elysia } from 'elysia';
import { AuthController } from '../controllers/AuthController.js';
import { AuthMiddleware } from '../middlewares/auth.js';

export const authRoutes = new Elysia()
    .group('/auth', (app) => 
        app
            // Public routes - không cần authentication
            .post('/register', async (context) => {
                try {
                    return await AuthController.register({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Registration failed'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Register new user',
                    description: 'Create a new user account'
                }
            })
            .post('/login', async (context) => {
                try {
                    return await AuthController.login({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 401;
                    return {
                        success: false,
                        message: error.message || 'Login failed'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'User login',
                    description: 'Authenticate user and return tokens'
                }
            })
            .post('/refresh-token', async (context) => {
                try {
                    return await AuthController.refreshToken({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 401;
                    return {
                        success: false,
                        message: error.message || 'Token refresh failed'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Refresh access token',
                    description: 'Generate new access token using refresh token'
                }
            })
            .post('/logout', async (context) => {
                try {
                    return await AuthController.logout({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Logout failed'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'User logout',
                    description: 'Logout user and invalidate refresh token'
                }
            })
            
            // Protected routes - cần authentication
            .get('/me', async (context) => {
                try {
                    const authResult = await AuthMiddleware.verifyToken(context);
                    if (authResult !== true) {
                        return authResult;
                    }
                    return await AuthController.getCurrentUser({ user: (context as any).user });
                } catch (error: any) {
                    context.set.status = 500;
                    return {
                        success: false,
                        message: error.message || 'Failed to get current user'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Get current user',
                    description: 'Get current authenticated user information'
                }
            })
            .post('/forgot-password', async (context) => {
                try {
                    return await AuthController.forgotPassword({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Không thể xử lý yêu cầu quên mật khẩu'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Forgot password',
                    description: 'Send password reset token to user email'
                }
            })
            .post('/verify-reset-token', async (context) => {
                try {
                    return await AuthController.verifyResetToken({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Không thể xác minh token'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Verify reset token',
                    description: 'Verify if reset token is valid'
                }
            })
            .post('/reset-password', async (context) => {
                try {
                    return await AuthController.resetPassword({ body: context.body as any });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Không thể đặt lại mật khẩu'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Reset password',
                    description: 'Reset password using valid token'
                }
            })
            .put('/change-password', async (context) => {
                try {
                    const authResult = await AuthMiddleware.verifyToken(context);
                    if (authResult !== true) {
                        return authResult;
                    }
                    return await AuthController.changePassword({ 
                        body: context.body as any, 
                        user: (context as any).user 
                    });
                } catch (error: any) {
                    context.set.status = 400;
                    return {
                        success: false,
                        message: error.message || 'Password change failed'
                    };
                }
            }, {
                detail: { 
                    tags: ['Authentication'],
                    summary: 'Change password',
                    description: 'Change user password'
                }
            })
    )