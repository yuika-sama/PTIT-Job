import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { jobApplicationService } from '../../../services';
import type { Job } from '../../../services/types';

interface JobApplicationModalProps {
  open: boolean;
  onClose: () => void;
  job: Job | null;
  userId?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  cvMethod: 'upload' | 'url';
  cvUrl: string;
  coverLetter: string;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  open,
  onClose,
  job,
  userId
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    cvMethod: 'url',
    cvUrl: '',
    coverLetter: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCvMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      cvMethod: event.target.value as 'upload' | 'url',
      cvUrl: '' // Reset CV URL when changing method
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'Vui lòng nhập họ và tên';
    if (!formData.email.trim()) return 'Vui lòng nhập email';
    if (!formData.phone.trim()) return 'Vui lòng nhập số điện thoại';
    if (!formData.cvUrl.trim()) return 'Vui lòng nhập URL CV';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Email không hợp lệ';
    
    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(\+84|84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) return 'Số điện thoại không hợp lệ';
    
    // Validate URL format
    try {
      new URL(formData.cvUrl);
    } catch {
      return 'URL CV không hợp lệ';
    }
    
    return null;
  };

  const handleSubmit = async () => {
    if (!job || !userId) return;
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare cover letter with CV URL included
      const coverLetterWithCV = formData.coverLetter 
        ? `${formData.coverLetter}\n\n--- CV Link ---\n${formData.cvUrl}`
        : `CV Link: ${formData.cvUrl}`;

      const applicationData = {
        user_id: userId,
        job_id: job.id,
        cover_letter: coverLetterWithCV,
        // Note: resume_id is optional according to the interface
        // We could extend the API later to handle CV URLs directly
      };

      const response = await jobApplicationService.createApplication(applicationData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            cvMethod: 'url',
            cvUrl: '',
            coverLetter: ''
          });
          setSuccess(false);
        }, 2000);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi nộp đơn ứng tuyển');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setError(error.message || 'Có lỗi xảy ra khi nộp đơn ứng tuyển');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError(null);
      setSuccess(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon color="primary" />
            <Typography variant="h5" component="div" fontWeight="bold">
              Ứng tuyển
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            disabled={isSubmitting}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          {job.title} - {job.company_name}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Đơn ứng tuyển đã được gửi thành công!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Personal Information */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Thông tin cá nhân
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                required
                disabled={isSubmitting}
                placeholder="Họ tên hiển thị với NTD"
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  disabled={isSubmitting}
                  placeholder="Email hiển thị với NTD"
                />
                
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  required
                  disabled={isSubmitting}
                  placeholder="Số điện thoại hiển thị với NTD"
                />
              </Box>
            </Box>
          </Box>

          {/* CV Section */}
          <Box>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Phương thức nộp CV
              </FormLabel>
              <RadioGroup
                value={formData.cvMethod}
                onChange={handleCvMethodChange}
                sx={{ flexDirection: 'row', mt: 1 }}
              >
                <FormControlLabel 
                  value="url" 
                  control={<Radio />} 
                  label="URL CV" 
                  disabled={isSubmitting}
                />
                <FormControlLabel 
                  value="upload" 
                  control={<Radio />} 
                  label="Tải lên CV" 
                  disabled 
                />
              </RadioGroup>
            </FormControl>

            {formData.cvMethod === 'url' && (
              <TextField
                fullWidth
                label="URL CV"
                value={formData.cvUrl}
                onChange={handleInputChange('cvUrl')}
                required
                disabled={isSubmitting}
                placeholder="https://example.com/your-cv.pdf"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Vui lòng nhập đường dẫn đến CV của bạn (Google Drive, Dropbox, etc.)"
              />
            )}
          </Box>

          {/* Cover Letter */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Thư giới thiệu
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn 
              tượng hơn với nhà tuyển dụng.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.coverLetter}
              onChange={handleInputChange('coverLetter')}
              disabled={isSubmitting}
              placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ px: 3 }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ 
            px: 4,
            minWidth: 200,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Đang nộp đơn...' : 'Nộp hồ sơ ứng tuyển'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobApplicationModal;