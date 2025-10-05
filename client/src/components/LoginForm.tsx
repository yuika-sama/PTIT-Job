import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
  Container,
  Alert,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { EmailRegex } from '../utils/Constants';

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: true,
    showPassword: false
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Load saved email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('ptitjob_saved_email');
    if (savedEmail) {
      setFormState(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email là bắt buộc';
    }
    if (!EmailRegex.test(email.trim())) {
      return 'Email không đúng định dạng';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Mật khẩu là bắt buộc';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (password.length > 100) {
      return 'Mật khẩu không được vượt quá 100 ký tự';
    }
    return undefined;
  };

  // Real-time validation
  const validateField = (field: keyof LoginFormState, value: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.general; // Clear general error when user types
      
      switch (field) {
        case 'email':
          const emailError = validateEmail(value);
          if (emailError) {
            newErrors.email = emailError;
          } else {
            delete newErrors.email;
          }
          break;
        case 'password':
          const passwordError = validatePassword(value);
          if (passwordError) {
            newErrors.password = passwordError;
          } else {
            delete newErrors.password;
          }
          break;
      }
      
      return newErrors;
    });
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginFormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    
    if (typeof value === 'string' && (field === 'email' || field === 'password')) {
      validateField(field, value);
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    const emailError = validateEmail(formState.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formState.password);
    if (passwordError) errors.password = passwordError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Quick fill functions for development
  const fillTestCredentials = (email: string, password: string) => {
    setFormState(prev => ({
      ...prev,
      email,
      password
    }));
    // Clear any existing validation errors
    setValidationErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isLoading) return;
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors({});
    
    try {
      const result = await login(formState.email.trim(), formState.password, formState.rememberMe);
      
      if (result.success) {
        // Save email for future use if remember me is checked
        if (formState.rememberMe) {
          localStorage.setItem('ptitjob_saved_email', formState.email.trim());
        } else {
          localStorage.removeItem('ptitjob_saved_email');
        }
        
        // Success - navigation will be handled by useEffect watching isAuthenticated
        console.log('✅ Login successful, redirecting...');
      } else {
        // Handle login failure
        const errorMessage = result.message || 'Đăng nhập thất bại';
        
        // Map specific error messages
        if (errorMessage.toLowerCase().includes('invalid email or password') ||
            errorMessage.toLowerCase().includes('email hoặc mật khẩu')) {
          setValidationErrors({ general: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.' });
        } else if (errorMessage.toLowerCase().includes('account is deactivated') ||
                   errorMessage.toLowerCase().includes('tài khoản bị vô hiệu')) {
          setValidationErrors({ general: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.' });
        } else if (errorMessage.toLowerCase().includes('too many attempts') ||
                   errorMessage.toLowerCase().includes('rate limit')) {
          setValidationErrors({ general: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.' });
        } else {
          setValidationErrors({ general: errorMessage });
        }
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Handle network/unexpected errors
      let errorMessage = 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
      
      if (error.message) {
        if (error.message.toLowerCase().includes('network') ||
            error.message.toLowerCase().includes('connection') ||
            error.message.toLowerCase().includes('fetch')) {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
        } else if (error.message.toLowerCase().includes('timeout')) {
          errorMessage = 'Hết thời gian chờ. Vui lòng thử lại.';
        } else if (error.message.toLowerCase().includes('server error') ||
                   error.message.toLowerCase().includes('500')) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau ít phút.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setValidationErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4
      }}
    >
      <Paper 
        elevation={4}
        sx={{
          borderRadius: 3,
          p: 5,
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: 32 }}
          >
            Chào mừng trở lại!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: 16 }}
          >
            Nhập tài khoản và mật khẩu của bạn để bắt đầu
          </Typography>
          {isDevelopment && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 2,
                border: '1px dashed #ddd'
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ fontWeight: 'bold', mb: 1, color: '#666' }}
              >
                🔧 Test Credentials (Development Mode)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestCredentials('admin@test.com', 'Admin1')}
                  sx={{ justifyContent: 'flex-start', fontSize: 11 }}
                >
                  👑 Admin: admin@test.com / Admin1
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestCredentials('employer@test.com', 'Admin1')}
                  sx={{ justifyContent: 'flex-start', fontSize: 11 }}
                >
                  🏢 Employer: employer@test.com / Admin1
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestCredentials('candidate@test.com', 'Admin1')}
                  sx={{ justifyContent: 'flex-start', fontSize: 11 }}
                >
                  👤 Candidate: candidate@test.com / Admin1
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Email Field */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 'bold', fontSize: 14, mb: 1 }}
            >
              Email *
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              value={formState.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting || isLoading}
              error={Boolean(validationErrors.email)}
              helperText={validationErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 'bold', fontSize: 14, mb: 1 }}
            >
              Mật khẩu *
            </Typography>
            <TextField
              fullWidth
              type={formState.showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu của bạn"
              value={formState.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting || isLoading}
              error={Boolean(validationErrors.password)}
              helperText={validationErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleInputChange('showPassword', !formState.showPassword)}
                      edge="end"
                      disabled={isSubmitting || isLoading}
                    >
                      {formState.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Options Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  disabled={isSubmitting || isLoading}
                />
              }
              label={
                <Typography sx={{ fontSize: 14 }}>
                  Ghi nhớ tài khoản
                </Typography>
              }
            />
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
              }}
              sx={{ 
                fontSize: 14, 
                fontWeight: 600, 
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Quên mật khẩu?
            </Link>
          </Box>

          {/* Error Alert */}
          {validationErrors.general && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {validationErrors.general}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting || isLoading}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontSize: 16,
              fontWeight: 600,
              mt: 2
            }}
          >
            {isSubmitting || isLoading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              hoặc
            </Typography>
          </Divider>
          <Typography sx={{ fontSize: 14 }}>
            Bạn chưa có tài khoản?{' '}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;