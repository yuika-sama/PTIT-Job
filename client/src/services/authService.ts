import {BaseApiService, ApiResponse} from './baseApi';
import {LoginRequest, RegisterRequest, User, UserRole, AuthResponse, RefreshTokenResponse} from './types';
import { EmailRegex as re } from '../utils/Constants';

class AuthService extends BaseApiService {
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        if (!data.email || !data.password) {
            throw new Error('Email và mật khẩu là bắt buộc');
        }
        if (data.password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }
        return this.post('/auth/login', data);
    }

    async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
        if (!data.email || !data.password || !data.full_name) {
            throw new Error('Email, mật khẩu và họ tên là bắt buộc');
        }
        if (data.password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
            throw new Error('Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số');
        }
        if (!re.test(data.email)) {
            throw new Error('Định dạng email không hợp lệ');
        }
        if (!/^[A-Za-z\s]{2,}$/.test(data.full_name)) {
            throw new Error('Họ tên chỉ được chứa chữ cái và khoảng trắng, ít nhất 2 ký tự');
        }
        if (data.phone_number && !/^\d{9,11}$/.test(data.phone_number)) {
            throw new Error('Số điện thoại phải từ 9 đến 11 chữ số');
        }
        if (!data.phone_number) {
            data.phone_number = '';
        }
        if (data.role === undefined || data.role === null || !data.role) {
            data.role = 'candidate';
        }
        if (!data.company_id || data.company_id === null || data.company_id === undefined) {
            data.company_id = '';
        }
        return this.post('/auth/register', data);
    }

    async logout(refreshToken: string): Promise<ApiResponse<any>> {
        if (!refreshToken) {
            throw new Error('Refresh token là bắt buộc');
        }
        return this.post('/auth/logout', { refreshToken });
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
        if (!refreshToken) {
            throw new Error('Refresh token là bắt buộc');
        }
        return this.post('/auth/refresh-token', { refreshToken });
    }

    async getCurrentUser(): Promise<ApiResponse<User>> {
        return this.get('/auth/me');
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
        if (!oldPassword || !newPassword) {
            throw new Error('Mật khẩu cũ và mật khẩu mới là bắt buộc');
        }
        if (newPassword.length < 6) {
            throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
        }
        return this.put('/auth/change-password', { oldPassword, newPassword });
    }

    async forgotPassword(email: string): Promise<ApiResponse<any>> {
        if (!email || !re.test(email)) {
            throw new Error('Định dạng email không hợp lệ');
        }
        return this.post('/auth/forgot-password', { email });
    }

    async verifyResetToken(token: string): Promise<ApiResponse<any>> {
        if (!token || !token.trim()) {
            throw new Error('Mã xác thực là bắt buộc');
        }
        return this.post('/auth/verify-reset-token', { token });
    }

    async resetPassword(token: string, newPassword: string): Promise<ApiResponse<any>> {
        if (!token || !token.trim()) {
            throw new Error('Mã xác thực là bắt buộc');
        }
        if (!newPassword || newPassword.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            throw new Error('Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số');
        }
        return this.post('/auth/reset-password', { token, newPassword });
    }

    private translateError(message: string): string {
        const errorTranslations: { [key: string]: string } = {
            'Invalid email or password': 'Email hoặc mật khẩu không đúng',
            'User already exists': 'Người dùng đã tồn tại',
            'Email already registered': 'Email đã được đăng ký',
            'Invalid token': 'Token không hợp lệ',
            'Token expired': 'Token đã hết hạn',
            'User not found': 'Không tìm thấy người dùng',
            'Old password is incorrect': 'Mật khẩu cũ không đúng',
            'Password change failed': 'Đổi mật khẩu thất bại',
            'Reset token not found or expired': 'Mã xác thực không tồn tại hoặc đã hết hạn',
            'Reset token expired': 'Mã xác thực đã hết hạn',
            'Invalid reset token': 'Mã xác thực không hợp lệ'
        };
        
        return errorTranslations[message] || message;
    }
}

export default new AuthService();
export const authService = new AuthService();