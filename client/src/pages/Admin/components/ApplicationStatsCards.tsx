import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as AcceptedIcon,
  Cancel as RejectedIcon
} from '@mui/icons-material';
import { JobApplication } from '../../../services/types';

interface ApplicationStatsCardsProps {
  applications: JobApplication[];
  loading: boolean;
}

const ApplicationStatsCards: React.FC<ApplicationStatsCardsProps> = ({ applications, loading }) => {
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const acceptedApplications = applications.filter(app => app.status === 'hired').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

  const statsData = [
    {
      title: 'Tổng đơn ứng tuyển',
      value: totalApplications,
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
      textColor: '#1976d2'
    },
    {
      title: 'Đang chờ duyệt',
      value: pendingApplications,
      icon: <PendingIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
      textColor: '#f57c00'
    },
    {
      title: 'Đã duyệt',
      value: acceptedApplications,
      icon: <AcceptedIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#e8f5e8',
      textColor: '#2e7d32'
    },
    {
      title: 'Đã từ chối',
      value: rejectedApplications,
      icon: <RejectedIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee',
      textColor: '#d32f2f'
    }
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        '& > *': { 
          flex: '1 1 220px',
          minWidth: 220
        }
      }}>
        {statsData.map((stat, index) => (
          <Card key={index} sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: stat.color,
                  mr: 2
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="h4" component="div" fontWeight="bold" color={stat.textColor}>
                    {stat.value.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ApplicationStatsCards;