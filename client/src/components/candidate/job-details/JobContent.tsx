import React from 'react';
import {
  Box,
  Typography,
  Divider
} from '@mui/material';
import type { Job } from '../../../services/types';

interface JobContentProps {
  job: Job;
}

const JobContent: React.FC<JobContentProps> = ({ job }) => {
  return (
    <Box>
      {/* Job Description */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Mô tả công việc
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line', 
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          {job.description || 'Chưa có mô tả chi tiết.'}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Requirements */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Yêu cầu công việc
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line', 
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          {job.requirements || 'Chưa có yêu cầu cụ thể.'}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Benefits */}
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Quyền lợi
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line', 
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          {job.benefits || 'Chưa có thông tin về quyền lợi.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default JobContent;