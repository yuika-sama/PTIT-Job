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
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { EmailRegex } from '../utils/Constants';

interface SignUpFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  acceptTerms: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  acceptTerms?: string;
  general?: string;
}

interface PasswordStrength {
  score: number; // 0-100
  message: string;
  color: 'error' | 'warning' | 'info' | 'success';
}

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated } = useAuth();
  
  const [formState, setFormState] = useState<SignUpFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    acceptTerms: false,
    showPassword: false,
    showConfirmPassword: false
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !registrationSuccess) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, registrationSuccess]);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, message: 'Nhập mật khẩu', color: 'error' };
    }
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
      noSpaces: !/\\s/.test(password)
    };
    
    // Scoring
    if (checks.length) score += 20;
    if (checks.hasLower) score += 15;
    if (checks.hasUpper) score += 15;
    if (checks.hasNumber) score += 15;
    if (checks.hasSpecial) score += 20;
    if (checks.noSpaces) score += 10;
    if (password.length >= 12) score += 5;
    
    if (score < 40) {
      return { score, message: 'Mật khẩu yếu', color: 'error' };
    } else if (score < 70) {
      return { score, message: 'Mật khẩu trung bình', color: 'warning' };
    } else if (score < 90) {
      return { score, message: 'Mật khẩu mạnh', color: 'info' };
    } else {
      return { score, message: 'Mật khẩu rất mạnh', color: 'success' };
    }
  };

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Họ và tên là bắt buộc';
    }
    if (name.trim().length < 2) {
      return 'Họ và tên phải có ít nhất 2 ký tự';
    }
    if (!/^[A-Za-zÀ-ỹĐđ\\s]+$/.test(name.trim())) {
      return 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
    }
    if (name.trim().length > 50) {
      return 'Họ và tên không được vượt quá 50 ký tự';
    }
    return undefined;
  };

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
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số';
    }
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) {
      return 'Xác nhận mật khẩu là bắt buộc';
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    if (phone && !/^[0-9+\\-\\s()]{9,15}$/.test(phone.trim())) {
      return 'Số điện thoại không đúng định dạng';
    }
    return undefined;
  };

  const validateAcceptTerms = (accepted: boolean): string | undefined => {
    if (!accepted) {
      return 'Vui lòng đồng ý với các điều khoản dịch vụ';
    }
    return undefined;
  };

  // Real-time validation
  const validateField = (field: keyof SignUpFormState, value: string | boolean) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.general; // Clear general error when user types
      
      switch (field) {
        case 'fullName':
          const nameError = validateFullName(value as string);
          if (nameError) {
            newErrors.fullName = nameError;
          } else {
            delete newErrors.fullName;
          }
          break;
        case 'email':
          const emailError = validateEmail(value as string);
          if (emailError) {
            newErrors.email = emailError;
          } else {
            delete newErrors.email;
          }
          break;
        case 'password':
          const passwordError = validatePassword(value as string);
          if (passwordError) {
            newErrors.password = passwordError;
          } else {
            delete newErrors.password;
          }
          // Also revalidate confirm password
          const confirmError = validateConfirmPassword(value as string, formState.confirmPassword);
          if (confirmError && formState.confirmPassword) {
            newErrors.confirmPassword = confirmError;
          } else {
            delete newErrors.confirmPassword;
          }
          break;
        case 'confirmPassword':
          const confirmPasswordError = validateConfirmPassword(formState.password, value as string);
          if (confirmPasswordError) {
            newErrors.confirmPassword = confirmPasswordError;
          } else {
            delete newErrors.confirmPassword;
          }
          break;
        case 'phoneNumber':
          const phoneError = validatePhoneNumber(value as string);
          if (phoneError) {
            newErrors.phoneNumber = phoneError;
          } else {
            delete newErrors.phoneNumber;
          }
          break;
        case 'acceptTerms':
          const termsError = validateAcceptTerms(value as boolean);
          if (termsError) {
            newErrors.acceptTerms = termsError;
          } else {
            delete newErrors.acceptTerms;
          }
          break;
      }
      
      return newErrors;
    });
  };

  // Handle input changes
  const handleInputChange = (field: keyof SignUpFormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    const nameError = validateFullName(formState.fullName);
    if (nameError) errors.fullName = nameError;
    
    const emailError = validateEmail(formState.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formState.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formState.password, formState.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    const phoneError = validatePhoneNumber(formState.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
    
    const termsError = validateAcceptTerms(formState.acceptTerms);
    if (termsError) errors.acceptTerms = termsError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
      const result = await register({
        email: formState.email.trim(),
        password: formState.password,
        full_name: formState.fullName.trim(),
        phone_number: formState.phoneNumber.trim() || undefined,
        role: 'candidate'
      });
      
      if (result.success) {
        setRegistrationSuccess(true);
        
        // Start redirect countdown
        setRedirectCountdown(5);
        const countdownInterval = setInterval(() => {
          setRedirectCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownInterval);
              navigate('/dashboard');
              return null;
            }
            return prev - 1;
          });
        }, 1000);
        
        console.log('✅ Registration successful, redirecting...');
      } else {
        // Handle registration failure
        const errorMessage = result.message || 'Đăng ký thất bại';
        
        // Map specific error messages
        if (errorMessage.toLowerCase().includes('email already exists') ||
            errorMessage.toLowerCase().includes('user already exists') ||
            errorMessage.toLowerCase().includes('duplicate')) {
          setValidationErrors({ general: 'Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.' });
        } else if (errorMessage.toLowerCase().includes('invalid email')) {
          setValidationErrors({ email: 'Địa chỉ email không hợp lệ' });
        } else if (errorMessage.toLowerCase().includes('weak password')) {
          setValidationErrors({ password: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn' });
        } else {
          setValidationErrors({ general: errorMessage });
        }
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
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

  // Get password strength
  const passwordStrength = calculatePasswordStrength(formState.password);

  // Success screen
  if (registrationSuccess) {
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
            textAlign: 'center'
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 3 }} />
          <Typography variant="h4" component="h1" gutterBottom color="success.main" sx={{ fontWeight: 'bold' }}>
            Đăng ký thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Chào mừng bạn đến với PTIT Job! Tài khoản của bạn đã được tạo thành công.<br/>
            {redirectCountdown !== null 
              ? `Chuyển hướng trong ${redirectCountdown} giây...`
              : 'Đang chuyển hướng...'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{ px: 3 }}
            >
              Vào dashboard ngay
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ px: 3 }}
            >
              Đăng nhập
            </Button>
          </Box>
          
          <CircularProgress size={32} sx={{ mt: 3 }} />
        </Paper>
      </Container>
    );
  }

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
          <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: 32 }}
          >
            Tạo tài khoản mới
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: 16 }}
          >
            Điền thông tin để tạo tài khoản PTIT Job của bạn
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Full Name Field */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 'bold', fontSize: 14, mb: 1 }}
            >
              Họ và tên *
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập họ và tên đầy đủ"
              value={formState.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting || isLoading}
              error={Boolean(validationErrors.fullName)}
              helperText={validationErrors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
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

          {/* Phone Number Field */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 'bold', fontSize: 14, mb: 1 }}
            >
              Số điện thoại
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập số điện thoại (tùy chọn)"
              value={formState.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting || isLoading}
              error={Boolean(validationErrors.phoneNumber)}
              helperText={validationErrors.phoneNumber || 'Ví dụ: 0901234567'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
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
              placeholder="Nhập mật khẩu mạnh"
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
            
            {/* Password Strength Indicator */}
            {formState.password && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength.score} 
                  color={passwordStrength.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Typography 
                  variant="caption" 
                  color={passwordStrength.color === 'error' ? 'error.main' : passwordStrength.color === 'success' ? 'success.main' : 'text.secondary'}
                  sx={{ fontSize: 12, mt: 0.5, display: 'block' }}
                >
                  {passwordStrength.message}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Confirm Password Field */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 'bold', fontSize: 14, mb: 1 }}
            >
              Xác nhận mật khẩu *
            </Typography>
            <TextField
              fullWidth
              type={formState.showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={formState.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting || isLoading}
              error={Boolean(validationErrors.confirmPassword)}
              helperText={validationErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleInputChange('showConfirmPassword', !formState.showConfirmPassword)}
                      edge="end"
                      disabled={isSubmitting || isLoading}
                    >
                      {formState.showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

          {/* Terms and Conditions */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  disabled={isSubmitting || isLoading}
                />
              }
              label={
                <Typography sx={{ fontSize: 14 }}>
                  Tôi đồng ý với{' '}
                  <Link href="#" sx={{ cursor: 'pointer' }}>
                    các điều khoản dịch vụ
                  </Link>
                  {' '}và{' '}
                  <Link href="#" sx={{ cursor: 'pointer' }}>
                    chính sách bảo mật
                  </Link>
                  {' '}*
                </Typography>
              }
            />
            {validationErrors.acceptTerms && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
                {validationErrors.acceptTerms}
              </Typography>
            )}
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
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản'
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
            Bạn đã có tài khoản?{' '}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
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
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpForm;