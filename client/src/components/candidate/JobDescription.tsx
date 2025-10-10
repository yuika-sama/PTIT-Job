import React, { FC } from 'react';
import { Typography, Chip } from '@mui/material';
import { Job } from './types';

interface JobDescriptionProps {
  job: Pick<Job, 'category' | 'description' | 'requirements' | 'benefits' | 'workLocation'>;
}

const JobDescription: FC<JobDescriptionProps> = ({ job }) => {
  return (
    <>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Chi tiết tin tuyển dụng
      </Typography>
      <Chip label={job.category} sx={{ mb: 3, backgroundColor: '#e0e0e0' }} />

      {/* ...Phần còn lại giữ nguyên... */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>Mô tả công việc</Typography>
      <ul>
        {job.description.map((item, index) => (
          <li key={index}><Typography variant="body1" sx={{ mb: 1 }}>{item}</Typography></li>
        ))}
      </ul>
      
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>Yêu cầu ứng viên</Typography>
      <ul>
        {job.requirements.map((item, index) => (
          <li key={index}><Typography variant="body1" sx={{ mb: 1 }}>{item}</Typography></li>
        ))}
      </ul>

      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>Quyền lợi</Typography>
      <ul>
        {job.benefits.map((item, index) => (
          <li key={index}><Typography variant="body1" sx={{ mb: 1 }}>{item}</Typography></li>
        ))}
      </ul>

      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>Địa điểm làm việc</Typography>
      <Typography variant="body1">{job.workLocation}</Typography>
    </>
  );
}

export default JobDescription;