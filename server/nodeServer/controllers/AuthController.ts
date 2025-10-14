import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserModel, type User } from '../models/UserModel.js';
import { AuthMiddleware, type JwtPayload } from '../middlewares/auth.js';
import type { UserRole } from '../models/types/Types.js';
import { emailService } from '../services/emailService.js';

interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
    role: UserRole;
    company_id?: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RefreshTokenRequest {
    refreshToken: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export class AuthController {
    
    static async register({ body }: { body: RegisterRequest }): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const { email, password, full_name, phone_number, role, company_id } = body;

            if (!email || !password || !full_name || !role) {
                return {
                success: false,
                    data: null,
                    message: 'Missing required fields: email, password, full_name, role'
                };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                success: false,
                data: {
                    user: null,
                    accessToken: null,
                    refreshToken: null
                },
                message: 'Invalid email format'
            };
            }

            if (password.length < 6) {
                return {
                    success: false,
                    data: {
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    },
                    message: 'Password must be at least 6 characters long'
                };
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return {
                    success: false,
                    data: {
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    },
                    message: 'User with this email already exists'
                };
            }

            const saltRounds = 12;
            const password_hash = await bcrypt.hash(password, saltRounds);

            const userData = {
                email,
                password_hash,
                full_name,
                role,
                is_active: true,
                ...(phone_number && { phone_number }),
                ...(company_id && { company_id })
            } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
            
            const newUser = await UserModel.create(userData);

            const jwtPayload: JwtPayload = {
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role
            };

            const accessToken = AuthMiddleware.generateAccessToken(jwtPayload);
            const refreshToken = AuthMiddleware.generateRefreshToken(jwtPayload);

            await UserModel.updateRefreshToken(newUser.id, refreshToken);

            emailService.sendWelcomeEmail(newUser.email, newUser.full_name)
                .catch(error => console.error('Failed to send welcome email:', error));

            const { password_hash: _, refresh_token: __, ...userResponse } = newUser;

            return {
                success: true,
                data: {
                    user: userResponse,
                    accessToken,
                    refreshToken
                },
                message: 'User registered successfully'
            };
        } catch (error: any) {
            console.error('Error in register:', error);
            throw new Error(error.message || 'Registration failed');
        }
    }

    static async login({ body }: { body: LoginRequest }): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const { email, password } = body;
            console.log(email, password);
            if (!email || !password) {
                return {
                success: false,
                data: {
                    user: null,
                    accessToken: null,
                    refreshToken: null
                },
                message: 'Email and password are required'
            };
            }

            const user = await UserModel.findByEmail(email);
            console.log(user);
            if (!user) {
                return {
                    success: false,
                    data: {
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    },
                    message: 'Invalid email or password'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    data: {
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    },
                    message: 'Account is deactivated'
                };
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return {
                    success: false,
                    data: {
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    },
                    message: 'Invalid email or password'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    data: {
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    },
                    message: 'User account is deactivated'
                };
            }

            const jwtPayload: JwtPayload = {
                userId: user.id,
                email: user.email,
                role: user.role
            };

            const accessToken = AuthMiddleware.generateAccessToken(jwtPayload);
            const refreshToken = AuthMiddleware.generateRefreshToken(jwtPayload);

            await UserModel.updateRefreshToken(user.id, refreshToken);

            const { password_hash: _, refresh_token: __, ...userResponse } = user;
            console.log('getUserFromAuthMiddleware', userResponse);

            return {
                success: true,
                data: {
                    user: userResponse,
                    accessToken,
                    refreshToken
                },
                message: 'Login successful'
            };
        } catch (error: any) {
            console.error('Error in login:', error);
            throw new Error(error.message || 'Login failed');
        }
    }

    static async refreshToken({ body }: { body: RefreshTokenRequest }): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const { refreshToken } = body;

            if (!refreshToken) {
                throw new Error('Refresh token is required');
            }

            let decoded: JwtPayload;
            try {
                decoded = AuthMiddleware.verifyRefreshToken(refreshToken);
            } catch (error) {
                throw new Error('Invalid or expired refresh token');
            }

            const user = await UserModel.findByRefreshToken(refreshToken);
            if (!user || !user.is_active) {
                throw new Error('Invalid refresh token or user not found');
            }

            const jwtPayload: JwtPayload = {
                userId: user.id,
                email: user.email,
                role: user.role
            };

            const newAccessToken = AuthMiddleware.generateAccessToken(jwtPayload);
            const newRefreshToken = AuthMiddleware.generateRefreshToken(jwtPayload);

            await UserModel.updateRefreshToken(user.id, newRefreshToken);

            return {
                success: true,
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                },
                message: 'Tokens refreshed successfully'
            };
        } catch (error: any) {
            console.error('Error in refreshToken:', error);
            throw new Error(error.message || 'Token refresh failed');
        }
    }

    static async logout({ body }: { body: RefreshTokenRequest }): Promise<{ success: boolean; message: string }> {
        try {
            const { refreshToken } = body;

            if (!refreshToken) {
                throw new Error('Refresh token is required');
            }

            const user = await UserModel.findByRefreshToken(refreshToken);
            if (user) {
                await UserModel.updateRefreshToken(user.id, null);
            }

            return {
                success: true,
                message: 'Logout successful'
            };
        } catch (error: any) {
            console.error('Error in logout:', error);
            throw new Error(error.message || 'Logout failed');
        }
    }

    static async getCurrentUser({ user }: { user: JwtPayload }): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const currentUser = await UserModel.findById(user.userId);
            if (!currentUser) {
                throw new Error('User not found');
            }

            const { password_hash: _, refresh_token: __, ...userResponse } = currentUser;

            return {
                success: true,
                data: { user: userResponse },
                message: 'User retrieved successfully'
            };
        } catch (error: any) {
            console.error('Error in getCurrentUser:', error);
            throw new Error(error.message || 'Failed to get current user');
        }
    }

    static async changePassword({ body, user }: { body: { currentPassword: string; newPassword: string }; user: JwtPayload }): Promise<{ success: boolean; message: string }> {
        try {
            const { currentPassword, newPassword } = body;

            if (!currentPassword || !newPassword) {
                throw new Error('Current password and new password are required');
            }

            if (newPassword.length < 6) {
                throw new Error('New password must be at least 6 characters long');
            }

            const currentUser = await UserModel.findById(user.userId);
            if (!currentUser) {
                throw new Error('User not found');
            }
            const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password_hash);
            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }

            const saltRounds = 12;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

            await UserModel.update(user.userId, { password_hash: newPasswordHash });

            await UserModel.updateRefreshToken(user.userId, null);

            return {
                success: true,
                message: 'Password changed successfully'
            };
        } catch (error: any) {
            console.error('Error in changePassword:', error);
            throw new Error(error.message || 'Password change failed');
        }
    }

    static async forgotPassword({ body }: { body: ForgotPasswordRequest }): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const { email } = body;

            if (!email) {
                return {
                    success: false,
                    message: 'Email là bắt buộc'
                };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    success: false,
                    message: 'Định dạng email không hợp lệ'
                };
            }

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return {
                    success: true,
                    message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

            await UserModel.updateResetToken(user.id, resetToken, resetTokenExpiry);

            emailService.sendResetPasswordEmail(user.email, resetToken)
                .then(emailSent => {
                    if (emailSent) {
                        console.log(`✅ Reset password email sent to: ${user.email}`);
                    } else {
                        console.log(`⚠️ Failed to send reset email, but token generated: ${resetToken}`);
                    }
                })
                .catch(error => {
                    console.error(`❌ Email sending error for ${user.email}:`, error);
                });
            
            console.log(`Reset token for ${email}: ${resetToken}`);
            console.log(`Reset URL: http://localhost:3000/forgot-password (enter token: ${resetToken})`);

            return {
                success: true,
                message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu',
                data: process.env.NODE_ENV === 'development' ? { resetToken } : undefined
            };
        } catch (error: any) {
            console.error('Error in forgotPassword:', error);
            throw new Error(error.message || 'Không thể xử lý yêu cầu quên mật khẩu');
        }
    }

    static async resetPassword({ body }: { body: ResetPasswordRequest }): Promise<{ success: boolean; message: string }> {
        try {
            const { token, newPassword } = body;

            if (!token || !newPassword) {
                return {
                    success: false,
                    message: 'Token và mật khẩu mới là bắt buộc'
                };
            }

            if (newPassword.length < 6) {
                return {
                    success: false,
                    message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
                };
            }

            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
                return {
                    success: false,
                    message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số'
                };
            }

            const user = await UserModel.findByResetToken(token);
            if (!user) {
                return {
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            if (user.reset_token_expiry && new Date() > user.reset_token_expiry) {
                return {
                    success: false,
                    message: 'Token đã hết hạn' 
                };
            }

            // Hash new password
            const saltRounds = 12;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

            await UserModel.updatePasswordAndClearResetToken(user.id, newPasswordHash);

            await UserModel.updateRefreshToken(user.id, null);

            emailService.sendPasswordResetSuccessEmail(user.email)
                .then(emailSent => {
                    if (emailSent) {
                        console.log(`✅ Password reset success email sent to: ${user.email}`);
                    } else {
                        console.log(`⚠️ Failed to send success email, but password reset completed`);
                    }
                })
                .catch(error => {
                    console.error(`❌ Success email sending error for ${user.email}:`, error);
                });

            return {
                success: true,
                message: 'Mật khẩu đã được đặt lại thành công'
            };
        } catch (error: any) {
            console.error('Error in resetPassword:', error);
            throw new Error(error.message || 'Không thể đặt lại mật khẩu');
        }
    }

    static async verifyResetToken({ body }: { body: { token: string } }): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const { token } = body;

            if (!token) {
                return {
                    success: false,
                    message: 'Token là bắt buộc'
                };
            }

            const user = await UserModel.findByResetToken(token);
            if (!user) {
                return {
                    success: false,
                    message: 'Token không hợp lệ'
                };
            }

            if (user.reset_token_expiry && new Date() > user.reset_token_expiry) {
                return {
                    success: false,
                    message: 'Token đã hết hạn'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            return {
                success: true,
                message: 'Token hợp lệ',
                data: {
                    email: user.email
                }
            };
        } catch (error: any) {
            console.error('Error in verifyResetToken:', error);
            throw new Error(error.message || 'Không thể xác minh token');
        }
    }
}