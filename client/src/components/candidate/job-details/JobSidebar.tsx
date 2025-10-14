import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Business as BusinessIcon
} from '@mui/icons-material';
import type { Job } from '../../../services/types';

interface JobSidebarProps {
  job: Job;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job }) => {
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
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'internship': 'Thực tập',
      'freelance': 'Tự do'
    };
    return typeMap[type] || type;
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Thông tin chung
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Mức lương:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatSalary(job)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Hình thức:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatJobType(job.job_type)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Địa điểm:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {job.location_name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Lĩnh vực:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {job.category_name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Ngày đăng:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {new Date(job.created_at).toLocaleDateString('vi-VN')}
          </Typography>
        </Box>
        
        {job.expiry_date && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Hạn nộp:
            </Typography>
            <Typography variant="body2" fontWeight={600} color="warning.main">
              {new Date(job.expiry_date).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Company Info */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Về công ty
      </Typography>
      
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={job.logo_url || undefined}
              sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
            >
              {!job.logo_url && <BusinessIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {job.company_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.location_name}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<BusinessIcon />}
            onClick={() => window.open(`/candidate/company/${job.company_id}`, '_blank')}
          >
            Xem trang công ty
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobSidebar;