import React, { FC } from 'react';
import { Box, Typography, Button, Stack, Divider } from '@mui/material';
import { LocationOn, MonetizationOn, Work, AccessTime, BookmarkBorder, Send } from '@mui/icons-material';
import { Job } from './types';

const greenColor = '#00b14f';

// Định nghĩa props cho component
interface JobHeaderProps {
  job: Pick<Job, 'title' | 'company' | 'salary' | 'location' | 'experience' | 'deadline'>;
}

const JobHeader: FC<JobHeaderProps> = ({ job }) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {job.company.name}
      </Typography>
      
      <Stack direction="row" spacing={3} sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
        <Box display="flex" alignItems="center">
          <MonetizationOn sx={{ mr: 1, color: greenColor }} /> <Typography variant="body1">{job.salary}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <LocationOn sx={{ mr: 1, color: greenColor }} /> <Typography variant="body1">{job.location}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Work sx={{ mr: 1, color: greenColor }} /> <Typography variant="body1">{job.experience}</Typography>
        </Box>
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      <Box display="flex" alignItems="center" color="text.secondary" mb={3}>
          <AccessTime sx={{ mr: 1 }} />
          <Typography variant="body2">Hạn nộp hồ sơ: {job.deadline}</Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<Send />} sx={{ backgroundColor: greenColor, '&:hover': { backgroundColor: '#008c3f' }, textTransform: 'none', fontSize: '1rem', py: 1.5, px: 4 }}>
          Ứng tuyển ngay
        </Button>
        <Button variant="outlined" startIcon={<BookmarkBorder />} sx={{ color: greenColor, borderColor: greenColor, '&:hover': { borderColor: '#008c3f' }, textTransform: 'none', fontSize: '1rem' }}>
          Lưu tin
        </Button>
      </Stack>
    </Box>
  );
}

export default JobHeader;