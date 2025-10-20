import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CloudUpload as CloudUploadIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import CVUploader from '../../components/candidate/CVUploader';

const CVUploaderPage: React.FC = () => {
  const theme = useTheme();
  const [cvEvaluated, setCvEvaluated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleCvEvaluated = (evaluated: boolean) => {
    setCvEvaluated(evaluated);
    if (evaluated) {
      setActiveStep(2);
    } else {
      setActiveStep(0);
    }
  };

  const steps = [
    'Tải lên CV',
    'Phân tích AI', 
    'Xem kết quả'
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default,
      py: 4
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 2
            }}
          >
            Đánh giá CV bằng AI
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Nhận đánh giá chuyên nghiệp về CV của bạn từ hệ thống AI tiên tiến
          </Typography>

          {/* Progress Stepper */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: completed || active ? theme.palette.primary.main : theme.palette.grey[300],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {index === 0 && <CloudUploadIcon />}
                        {index === 1 && <AssessmentIcon />}
                        {index === 2 && <CheckCircleIcon />}
                      </Box>
                    )}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Box>

        {/* Main Content */}
        <Box sx={{ mb: 4 }}>
          <CVUploader onCvEvaluated={handleCvEvaluated} />
        </Box>

        {/* Additional Info */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Benefits */}
          <Card sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Lợi ích của việc đánh giá CV
                </Typography>
              </Box>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  • Phát hiện điểm mạnh và điểm yếu
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Nhận gợi ý cải thiện cụ thể
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Tăng cơ hội được tuyển dụng
                </Typography>
                <Typography variant="body2">
                  • Tối ưu hóa CV cho từng vị trí
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Yêu cầu file CV
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📄 Định dạng: PDF
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📏 Kích thước: Tối đa 10MB
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  🌟 Chất lượng: Rõ ràng, dễ đọc
                </Typography>
                <Typography variant="body2">
                  📝 Ngôn ngữ: Tiếng Việt/Tiếng Anh
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Success Message */}
        {cvEvaluated && (
          <Alert 
            severity="success" 
            sx={{ mt: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => alert('Tính năng phân tích chi tiết sẽ được phát triển')}
              >
                Chi tiết
              </Button>
            }
          >
            <Typography variant="body2">
              🎉 CV của bạn đã được đánh giá thành công! Hãy xem kết quả và áp dụng các gợi ý để cải thiện CV.
            </Typography>
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default CVUploaderPage;