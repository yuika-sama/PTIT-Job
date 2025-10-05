import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NotFound404: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
          break;
        case 'candidate':
          navigate('/candidate/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        {/* Error Illustration */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              position: 'relative'
            }}
          >
            {/* 404 Number */}
            <Typography
              variant="h1"
              sx={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#1976d2',
                opacity: 0.8
              }}
            >
              404
            </Typography>
            
            {/* Error Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#f44336',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ErrorIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ mb: 4, maxWidth: 600 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Oops! Trang không tồn tại
          </Typography>
          
          <Typography variant="h6" color="textSecondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không bao giờ tồn tại.
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Đừng lo lắng! Hãy thử một trong các lựa chọn dưới đây để tiếp tục hành trình tìm việc của bạn.
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Về trang chủ
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            size="large"
          >
            Quay lại
          </Button>
        </Stack>

        {/* Additional Help */}
        <Box sx={{ mt: 6, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            🤔 Vẫn gặp khó khăn?
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Nếu bạn tin rằng đây là một lỗi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi:
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="text"
              size="small"
              onClick={() => window.location.href = 'mailto:support@ptit-job.com'}
            >
              📧 Email hỗ trợ
            </Button>
            
            <Button
              variant="text"
              size="small"
              onClick={() => window.location.href = 'tel:+84123456789'}
            >
              📞 Hotline
            </Button>
          </Stack>
        </Box>

        {/* Footer Note */}
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 6, opacity: 0.7 }}
        >
          PTIT Job - Nền tảng tuyển dụng hàng đầu cho sinh viên PTIT
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound404;
