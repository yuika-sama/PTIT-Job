import React from 'react';
import { Box } from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import StatCard from './StatCard';
import { useUsers, useCompanies, useJobs, useJobApplications } from '../hooks/useApi';

const DashboardStats: React.FC = () => {
  const { data: users, loading: usersLoading } = useUsers();
  const { data: companies, loading: companiesLoading } = useCompanies();
  const { data: jobs, loading: jobsLoading } = useJobs();
  const { data: applications, loading: applicationsLoading } = useJobApplications();

  const growthStats = {
    usersGrowth: 15.2,
    companiesGrowth: 8.7,
    jobsGrowth: 12.1,
    applicationsGrowth: 22.3
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr',                    // Mobile: 1 cột
        sm: 'repeat(2, 1fr)',         // Tablet: 2 cột
        md: 'repeat(4, 1fr)'          // Desktop: 4 cột (2 hàng)
      }, 
      gap: 3, 
      mb: 4
    }}>
      <Box>
        <StatCard
          title="Tổng người dùng"
          value={users?.length || 0}
          icon={<PeopleIcon />}
          color="#1976d2"
          growth={growthStats.usersGrowth}
          loading={usersLoading}
        />
      </Box>
      <Box>
        <StatCard
          title="Tổng công ty"
          value={companies?.length || 0}
          icon={<BusinessIcon />}
          color="#2e7d32"
          growth={growthStats.companiesGrowth}
          loading={companiesLoading}
        />
      </Box>
      <Box>
        <StatCard
          title="Tổng việc làm"
          value={jobs?.length || 0}
          icon={<WorkIcon />}
          color="#ed6c02"
          growth={growthStats.jobsGrowth}
          loading={jobsLoading}
        />
      </Box>
      <Box>
        <StatCard
          title="Tổng đơn ứng tuyển"
          value={applications?.length || 0}
          icon={<AssignmentIcon />}
          color="#9c27b0"
          growth={growthStats.applicationsGrowth}
          loading={applicationsLoading}
        />
      </Box>
    </Box>
  );
};

export default DashboardStats;