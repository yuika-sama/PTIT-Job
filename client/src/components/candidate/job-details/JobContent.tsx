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
  const renderMultilineText = (text?: string) => {
    if (!text) return 'Chưa có nội dung.';
    const lines = text.replace(/\\n/g, '\n').split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line.trim()}
        <br />
      </React.Fragment>
    ));
  };
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
          {renderMultilineText(job.description)}
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
          {renderMultilineText(job.requirements)}
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
          {renderMultilineText(job.benefits)}
        </Typography>
      </Box>
    </Box>
  );
};

export default JobContent;