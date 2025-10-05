import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  Work as JobIcon,
  CheckCircle as ActiveIcon,
  Star as FeaturedIcon,
  Schedule as ContractIcon
} from '@mui/icons-material';
import { Job } from '../../../services/types';

interface JobStatsCardsProps {
  jobs: Job[];
  loading?: boolean;
}

const JobStatsCards: React.FC<JobStatsCardsProps> = ({ jobs, loading = false }) => {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status).length;
  const fullTimeJobs = jobs.filter(job => job.job_type === 'full_time').length;
  const contractJobs = jobs.filter(job => job.job_type === 'contract').length;

  const statsData = [
    {
      title: 'Tổng số việc làm',
      value: totalJobs,
      icon: <JobIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
      textColor: '#1976d2'
    },
    {
      title: 'Việc làm đang hoạt động',
      value: activeJobs,
      icon: <ActiveIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#e8f5e8',
      textColor: '#2e7d32'
    },
    {
      title: 'Toàn thời gian',
      value: fullTimeJobs,
      icon: <FeaturedIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
      textColor: '#f57c00'
    },
    {
      title: 'Hợp đồng',
      value: contractJobs,
      icon: <ContractIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee',
      textColor: '#d32f2f'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {statsData.map((_, index) => (
            <Card key={index} sx={{ flex: '1 1 220px', minWidth: 220 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Đang tải...
                    </Typography>
                    <Typography variant="h4">
                      --
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: '#f5f5f5'
                    }}
                  >
                    {statsData[index].icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {statsData.map((stat, index) => (
          <Card key={index} sx={{ flex: '1 1 220px', minWidth: 220 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: stat.textColor, fontWeight: 'bold' }}>
                    {stat.value.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: stat.color
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default JobStatsCards;