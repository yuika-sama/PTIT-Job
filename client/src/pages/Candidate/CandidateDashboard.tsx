import React from 'react';
import { Container, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', minWidth: 200 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value.toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = {
    appliedJobs: 12,
    interviewsScheduled: 3,
    savedJobs: 25,
    profileViews: 48
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chào mừng trở lại, {user?.full_name || user?.email}!
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Tổng quan hoạt động tìm việc của bạn
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Đơn đã nộp"
            value={stats.appliedJobs}
            icon={<AssignmentIcon />}
            color="#1976d2"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Phỏng vấn đã hẹn"
            value={stats.interviewsScheduled}
            icon={<ScheduleIcon />}
            color="#2e7d32"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Việc đã lưu"
            value={stats.savedJobs}
            icon={<WorkIcon />}
            color="#ed6c02"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Lượt xem hồ sơ"
            value={stats.profileViews}
            icon={<TrendingUpIcon />}
            color="#9c27b0"
          />
        </Box>
      </Box>

      {/* Main Content Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        {/* Recent Applications */}
        <Box sx={{ flex: '2 1 400px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Đơn ứng tuyển gần đây
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { company: 'FPT Software', position: 'Frontend Developer', status: 'Đang xử lý', date: '2024-01-15' },
                { company: 'VNG Corporation', position: 'React Developer', status: 'Đã phỏng vấn', date: '2024-01-12' },
                { company: 'Tiki Corporation', position: 'UI/UX Developer', status: 'Đã nộp', date: '2024-01-10' }
              ].map((application, index) => (
                <Box key={index} sx={{ p: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {application.position}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {application.company} • {application.date}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      backgroundColor: application.status === 'Đã phỏng vấn' ? '#e8f5e8' : '#e3f2fd',
                      color: application.status === 'Đã phỏng vấn' ? '#2e7d32' : '#1976d2',
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}
                  >
                    {application.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông báo mới
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { title: 'Phỏng vấn với FPT Software', time: '2 giờ trước', type: 'interview' },
                { title: 'Việc mới phù hợp với bạn', time: '1 ngày trước', type: 'job' },
                { title: 'Hồ sơ được xem bởi VNG Corp', time: '2 ngày trước', type: 'profile' }
              ].map((notification, index) => (
                <Box key={index} sx={{ p: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <NotificationsIcon color="primary" fontSize="small" />
                    <Typography variant="body2" fontWeight="bold">
                      {notification.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {notification.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Job Recommendations */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Việc làm phù hợp với bạn
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {[
            { title: 'Senior React Developer', company: 'Shopee', location: 'Hà Nội', salary: '20-30 triệu' },
            { title: 'Frontend Engineer', company: 'Grab', location: 'Hồ Chí Minh', salary: '25-35 triệu' },
            { title: 'Full Stack Developer', company: 'Zalo', location: 'Hà Nội', salary: '18-28 triệu' }
          ].map((job, index) => (
            <Box key={index} sx={{ flex: '1 1 250px' }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <BusinessIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {job.company}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    📍 {job.location}
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    💰 {job.salary}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CandidateDashboard;