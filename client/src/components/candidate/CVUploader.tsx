import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

interface CVUploaderProps {
  onCvEvaluated: (evaluated: boolean) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onCvEvaluated }) => {
  const theme = useTheme();
  const [cvScore, setCvScore] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Vui lòng chọn file PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File không được vượt quá 10MB');
      return;
    }

    setSelectedFile(file);
    setIsEvaluating(true);

    // TODO: Uncomment when backend is ready
    /*
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call backend API
      const response = await fetch('http://localhost:8000/evaluate-cv', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setCvScore(data.match_score);
      
      // Notify parent component that CV has been evaluated
      onCvEvaluated(true);
    } catch (error) {
      console.error('Error evaluating CV:', error);
      alert('Có lỗi xảy ra khi đánh giá CV. Vui lòng thử lại.');
    } finally {
      setIsEvaluating(false);
    }
    */

    // Simulate API call for demo
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 40) + 60; // Score between 60-100
      setCvScore(mockScore);
      setIsEvaluating(false);
      
      // Notify parent component that CV has been evaluated
      onCvEvaluated(true);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Tốt';
    return 'Cần cải thiện';
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setCvScore(null);
    setIsEvaluating(false);
    onCvEvaluated(false);
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      border: `2px solid ${theme.palette.primary.main}`,
      overflow: 'visible'
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}>
            <CloudUploadIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.primary.main, mb: 1 }}>
            Bước 1: Tải lên CV của bạn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hệ thống AI sẽ phân tích và đánh giá CV của bạn
          </Typography>
        </Box>

        {/* File Upload Area */}
        {!selectedFile ? (
          <Box
            sx={{
              border: `2px dashed ${theme.palette.primary.main}`,
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: `${theme.palette.primary.main}08`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}12`,
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            component="label"
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <CloudUploadIcon 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main,
                mb: 2 
              }} 
            />
            <Typography variant="h6" color="primary" fontWeight={600} sx={{ mb: 1 }}>
              Kéo thả file CV hoặc click để chọn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chỉ hỗ trợ file PDF, tối đa 10MB
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* File Info */}
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
              icon={<CheckCircleIcon />}
            >
              <Typography variant="body2">
                <strong>{selectedFile.name}</strong> đã được tải lên thành công
              </Typography>
            </Alert>

            {/* Evaluation Progress */}
            {isEvaluating && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Đang đánh giá CV...
                  </Typography>
                </Box>
                <LinearProgress 
                  sx={{ 
                    mb: 2,
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.primary.main
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Hệ thống AI đang phân tích CV của bạn, vui lòng đợi...
                </Typography>
              </Box>
            )}

            {/* Evaluation Results */}
            {cvScore !== null && !isEvaluating && (
              <Box>
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Kết quả đánh giá CV
                  </Typography>
                  
                  {/* Score Display */}
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getScoreColor(cvScore)} 0%, ${getScoreColor(cvScore)}CC 100%)`,
                    color: 'white',
                    flexDirection: 'column',
                    mb: 2
                  }}>
                    <Typography variant="h3" fontWeight={700}>
                      {cvScore}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Điểm CV
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={getScoreLabel(cvScore)}
                    sx={{
                      backgroundColor: getScoreColor(cvScore),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      px: 2
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => alert('Tính năng xem chi tiết sẽ được phát triển')}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetUpload}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main
                    }}
                  >
                    Tải CV khác
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CVUploader;