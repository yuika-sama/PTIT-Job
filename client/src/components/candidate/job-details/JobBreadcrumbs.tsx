import React from 'react';
import {
  Breadcrumbs,
  Link,
  Typography
} from '@mui/material';

interface JobBreadcrumbsProps {
  jobTitle: string;
  onNavigate: (path: string) => void;
}

const JobBreadcrumbs: React.FC<JobBreadcrumbsProps> = ({ jobTitle, onNavigate }) => {
  return (
    <Breadcrumbs sx={{ mb: 3 }}>
      <Link 
        color="inherit" 
        href="#" 
        onClick={(e) => { e.preventDefault(); onNavigate('candidate/'); }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        Trang chủ
      </Link>
      <Link 
        color="inherit" 
        href="#" 
        onClick={(e) => { e.preventDefault(); onNavigate('/candidate/jobs'); }}
      >
        Việc làm
      </Link>
      <Typography color="text.primary">{jobTitle}</Typography>
    </Breadcrumbs>
  );
};

export default JobBreadcrumbs;