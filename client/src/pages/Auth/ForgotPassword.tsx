import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Divider
} from '@mui/material';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';

interface ForgotPasswordState {
  email: string;
  loading: boolean;
  error: string;
  success: boolean;
  step: 'email' | 'token' | 'password';
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { forgotPassword, verifyResetToken, resetPassword, loading, error, success, clearError } = useForgotPassword();
  
  const [state, setState] = useState<Omit<ForgotPasswordState, 'loading' | 'error' | 'success'>>({
    email: '',
    step: 'email',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validationError, setValidationError] = useState<string>('');
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<boolean>(false);

  // Helper to get URL search parameters (memoized)
  const urlSearchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // Handle token from URL parameter (when user clicks email link)
  useEffect(() => {
    const tokenFromUrl = urlSearchParams.get('token');
    
    // Chỉ process token nếu chưa có token trong state (tránh duplicate calls)
    if (tokenFromUrl && !state.token && state.step === 'email') {
      console.log('🔗 Token detected from email link:', tokenFromUrl);
      
      // Auto-fill token và set step
      setState(prev => ({
        ...prev,
        token: tokenFromUrl,
        step: 'token'
      }));
      
      // Auto-verify the token (only once)
      verifyResetToken(tokenFromUrl)
        .then(response => {
          if (response.success) {
            console.log('✅ Token auto-verified, proceeding to password step');
            // Lưu email từ verification response nếu có
            if (response.data?.email) {
              setState(prev => ({ 
                ...prev, 
                step: 'password',
                email: response.data.email  // Lưu email từ backend
              }));
            } else {
              setState(prev => ({ ...prev, step: 'password' }));
            }
          }
        })
        .catch(err => {
          console.error('❌ Token auto-verification failed:', err);
          setValidationError('Link đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu link mới.');
        });
    }
  }, [location.search]); // Remove verifyResetToken from dependencies

  const updateState = (updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
    // Chỉ clear errors nếu có updates thực sự
    if (Object.keys(updates).length > 0) {
      setValidationError('');
      clearError();
    }
  };

  // Step 1: Request reset token
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email.trim()) {
      setValidationError('Vui lòng nhập địa chỉ email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) {
      setValidationError('Định dạng email không hợp lệ');
      return;
    }

    try {
      const response = await forgotPassword(state.email);
      
      // Backend luôn trả về success=true cho security (không tiết lộ email có tồn tại hay không)
      // Chuyển sang bước nhập token
      updateState({ step: 'token' });
      
      // Trong development mode, hiển thị token để test
      if (process.env.NODE_ENV === 'development' && response?.data?.resetToken) {
        console.log('🔑 Development - Reset token:', response.data.resetToken);
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      // Nếu có lỗi validation thì hiển thị, còn lại vẫn chuyển sang step token
      if (err.message && (err.message.includes('email') || err.message.includes('Email'))) {
        setValidationError(err.message);
      } else {
        // Vẫn chuyển sang step token để giữ bảo mật, nhưng log error
        updateState({ step: 'token' });
        console.warn('Non-validation error, proceeding to token step for security');
      }
    }
  };

  // Step 2: Verify token
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.token.trim()) {
      setValidationError('Vui lòng nhập mã xác thực');
      return;
    }

    try {
      const response = await verifyResetToken(state.token);
      
      if (response.success) {
        // Lưu email từ verification response nếu có
        if (response.data?.email) {
          updateState({ 
            step: 'password',
            email: response.data.email  // Update email từ backend
          });
        } else {
          updateState({ step: 'password' });
        }
      } else {
        setValidationError(response.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn');
      }
    } catch (err: any) {
      setValidationError(err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn');
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.newPassword.trim()) {
      setValidationError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (state.newPassword.length < 6) {
      setValidationError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Backend validation - password strength
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(state.newPassword)) {
      setValidationError('Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số');
      return;
    }

    if (state.newPassword !== state.confirmPassword) {
      setValidationError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await resetPassword(state.token, state.newPassword);
      
      if (response.success) {
        console.log('✅ Password reset successful, starting redirect countdown');
        
        // Đặt success state local thay vì dùng hook success
        setPasswordResetSuccess(true);
        
        // Bắt đầu countdown timer
        setRedirectCountdown(3);
        
        const countdownInterval = setInterval(() => {
          setRedirectCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownInterval);
              console.log('🚀 Redirecting to login page...');
              navigate('/login');
              return null;
            }
            return prev - 1;
          });
        }, 1000);
        
      } else {
        console.error('Password reset failed:', response.message);
        setValidationError(response.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setValidationError(err.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleForgotPassword}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Quên mật khẩu
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nhập địa chỉ email của bạn để nhận link đặt lại mật khẩu
        </Typography>
      </Box>

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || validationError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Địa chỉ email"
        type="email"
        value={state.email}
        onChange={(e) => updateState({ email: e.target.value })}
        margin="normal"
        required
        disabled={loading}
        autoFocus
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Gửi link đặt lại mật khẩu'
        )}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
          variant="body2"
          sx={{ cursor: 'pointer' }}
        >
          <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Quay lại đăng nhập
        </Link>
      </Box>
    </form>
  );

  const renderTokenStep = () => (
    <form onSubmit={handleVerifyToken}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Kiểm tra email
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Chúng tôi đã gửi link đặt lại mật khẩu đến email: <strong>{state.email}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vui lòng kiểm tra email và nhấn vào link để đặt lại mật khẩu. Nếu không thấy email, kiểm tra thư mục spam.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Hoặc bạn có thể nhập mã xác thực từ email bên dưới:
        </Typography>
      </Box>

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || validationError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Mã xác thực"
        value={state.token}
        onChange={(e) => updateState({ token: e.target.value.trim() })}
        margin="normal"
        required
        disabled={loading}
        autoFocus
        placeholder="Nhập mã xác thực từ email"
        helperText="Mã xác thực có hiệu lực trong 1 giờ"
        inputProps={{
          style: { fontFamily: 'monospace', fontSize: '14px' }
        }}
      />

      <Box sx={{ textAlign: 'center' }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Xác thực mã'
          )}
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => {
            // Resend forgot password email
            forgotPassword(state.email).catch(err => {
              console.error('Failed to resend email:', err);
            });
          }}
          disabled={loading}
          sx={{ mb: 2, width: '100%' }}
        >
          Gửi lại email với link mới
        </Button>

        <Button
          variant="text"
          onClick={() => updateState({ step: 'email', token: '' })}
          disabled={loading}
        >
          <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Quay lại
        </Button>
      </Box>
    </form>
  );

  const renderPasswordStep = () => {
    // Chỉ hiển thị success screen sau khi resetPassword thành công, không phải verifyToken
    if (passwordResetSuccess && state.step === 'password') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Mật khẩu của bạn đã được đặt lại thành công!<br/>
            Email xác nhận đã được gửi đến <strong>{state.email || 'email của bạn'}</strong>.<br/>
            {redirectCountdown !== null 
              ? `Đang chuyển hướng trong ${redirectCountdown} giây...`
              : 'Bạn sẽ được chuyển hướng đến trang đăng nhập...'}
          </Typography>
          
          {/* Fallback manual redirect button */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                console.log('📱 Manual redirect to login');
                navigate('/login');
              }}
              sx={{ mr: 2 }}
            >
              Đi đến trang đăng nhập ngay
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                console.log('🔄 Reset form for new password reset');
                setState(prev => ({
                  ...prev,
                  step: 'email',
                  token: '',
                  newPassword: '',
                  confirmPassword: ''
                }));
                setValidationError('');
                clearError();
                setRedirectCountdown(null);
                setPasswordResetSuccess(false); // Reset success state
              }}
            >
              Đặt lại mật khẩu khác
            </Button>
          </Box>
          
          <CircularProgress size={32} sx={{ mt: 2 }} />
        </Box>
      );
    }

    return (
      <form onSubmit={handleResetPassword}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Đặt lại mật khẩu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Nhập mật khẩu mới cho tài khoản của bạn
          </Typography>
        </Box>

        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || validationError}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Mật khẩu mới"
          type="password"
          value={state.newPassword}
          onChange={(e) => updateState({ newPassword: e.target.value })}
          margin="normal"
          required
          disabled={loading}
          autoFocus
          helperText="Ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số"
        />

        <TextField
          fullWidth
          label="Xác nhận mật khẩu mới"
          type="password"
          value={state.confirmPassword}
          onChange={(e) => updateState({ confirmPassword: e.target.value })}
          margin="normal"
          required
          disabled={loading}
          error={state.confirmPassword !== '' && state.newPassword !== state.confirmPassword}
          helperText={state.confirmPassword !== '' && state.newPassword !== state.confirmPassword ? 'Mật khẩu không khớp' : 'Nhập lại mật khẩu để xác nhận'}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Đặt lại mật khẩu'
          )}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
            variant="body2"
            sx={{ cursor: 'pointer' }}
          >
            <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Quay lại đăng nhập
          </Link>
        </Box>
      </form>
    );
  };

  const renderCurrentStep = () => {
    switch (state.step) {
      case 'email':
        return renderEmailStep();
      case 'token':
        return renderTokenStep();
      case 'password':
        return renderPasswordStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Cần hỗ trợ? {' '}
            <Link href="mailto:support@ptitjob.com">
              Liên hệ với chúng tôi
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;