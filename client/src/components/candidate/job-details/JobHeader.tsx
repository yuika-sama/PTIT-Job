import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  AttachMoney as SalaryIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import type { Job } from '../../../services/types';

interface JobHeaderProps {
  job: Job;
  isSaved: boolean;
  onSaveJob: () => void;
  onApplyJob: () => void;
  onShareJob: () => void;
  onBack: () => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({
  job,
  isSaved,
  onSaveJob,
  onApplyJob,
  onShareJob,
  onBack
}) => {
  // Format salary
  const formatSalary = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.currency}`;
    } else if (job.salary_min) {
      return `Từ ${job.salary_min.toLocaleString()} ${job.currency}`;
    } else if (job.salary_max) {
      return `Lên tới ${job.salary_max.toLocaleString()} ${job.currency}`;
    }
    return 'Thỏa thuận';
  };

  // Format job type
  const formatJobType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'internship': 'Thực tập',
      'freelance': 'Tự do'
    };
    return typeMap[type] || type;
  };

  // Format status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'expired': return 'error';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Đang tuyển';
      case 'draft': return 'Nháp';
      case 'expired': return 'Hết hạn';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <IconButton onClick={onBack} sx={{ mt: 1 }}>
        <ArrowBackIcon />
      </IconButton>
      
      <Avatar
        src={job.logo_url || undefined}
        sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: 'primary.main',
          fontSize: '2rem'
        }}
      >
        {!job.logo_url && <BusinessIcon fontSize="large" />}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          {job.title}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {job.company_name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {job.location_name}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SalaryIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatSalary(job)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatJobType(job.job_type)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={getStatusText(job.status)}
            color={getStatusColor(job.status) as any}
            size="small"
          />
          <Chip 
            label={job.category_name}
            variant="outlined"
            size="small"
          />
          {job.expiry_date && (
            <Chip 
              label={`Hết hạn: ${new Date(job.expiry_date).toLocaleDateString('vi-VN')}`}
              variant="outlined"
              size="small"
              color="warning"
            />
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            onClick={onApplyJob}
            disabled={job.status !== 'published'}
            sx={{ minWidth: 150 }}
          >
            Ứng tuyển ngay
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ViewIcon />}
            onClick={() => window.open(`/candidate/company/${job.company_id}`, '_blank')}
          >
            Xem công ty
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <IconButton onClick={onShareJob} color="primary">
          <ShareIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default JobHeader;