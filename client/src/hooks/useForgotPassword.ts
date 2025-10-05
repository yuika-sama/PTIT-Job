import { useState } from 'react';
import { authService } from '../services/authService';

interface UseForgotPasswordReturn {
  forgotPassword: (email: string) => Promise<any>;
  verifyResetToken: (token: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  const forgotPassword = async (email: string): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        return response; // Return response để component có thể truy cập data
      } else {
        setError(response.message || 'Có lỗi xảy ra khi gửi email khôi phục');
        return response;
      }
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi gửi email khôi phục');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyResetToken = async (token: string): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authService.verifyResetToken(token);
      
      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        setError(response.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn');
        return response;
      }
    } catch (error: any) {
      setError(error.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authService.resetPassword(token, newPassword);
      
      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        setError(response.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
        return response;
      }
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    forgotPassword,
    verifyResetToken,
    resetPassword,
    loading,
    error,
    success,
    clearError,
    clearSuccess
  };
};