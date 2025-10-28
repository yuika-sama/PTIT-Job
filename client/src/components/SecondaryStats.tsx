import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress
} from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { useUsers, useCompanies, useJobs, useJobApplications, useResumes } from '../hooks/useApi';
import StatCard from './StatCard';

const SecondaryStats: React.FC = () => {
  const { data: users } = useUsers();
  const { data: companies } = useCompanies();
  const { data: jobs } = useJobs();
  const { data: applications } = useJobApplications();
  const { data: resumes, loading: resumesLoading } = useResumes();

  // Calculate derived stats
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(user => user.is_active)?.length || 0;
  // const activeJobs = jobs?.filter(job => job.is_active)?.length || 0;
  
  // Today's applications (assuming you have a way to filter by today)
  const today = new Date().toDateString();
  const todayApplications = applications?.filter(app => 
    new Date(app.applied_at ).toDateString() === today
  )?.length || 0;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
      <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Người dùng hoạt động
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {activeUsers}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0} 
              sx={{ mt: 1, backgroundColor: '#e8f5e8' }}
            />
          </CardContent>
        </Card>
      </Box>
      
      
      <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
        <StatCard
          title="Tổng CV/Hồ sơ"
          value={resumes?.length || 0}
          icon={<DescriptionIcon />}
          color="#00897b"
          growth={18.5}
          loading={resumesLoading}
        />
      </Box>

      <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Việc làm đang tuyển
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              {jobs?.length || 0}
            </Typography>

            <Typography variant="caption" color="textSecondary">
              Từ {jobs?.length || 0} tổng số
            </Typography>

          </CardContent>
        </Card>
      </Box>

      <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Đơn ứng tuyển hôm nay
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              {todayApplications}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Hoạt động tích cực
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SecondaryStats;