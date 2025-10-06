import React from 'react';
import { Container, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {
  Work as WorkIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import EmployerLayout from '../../components/EmployerLayout';

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

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = {
    activeJobs: 8,
    totalApplications: 145,
    interviewsScheduled: 12,
    profileViews: 234
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chào mừng nhà tuyển dụng, {user?.full_name || user?.email}!
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Tổng quan hoạt động tuyển dụng của công ty
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Tin tuyển dụng"
            value={stats.activeJobs}
            icon={<WorkIcon />}
            color="#1976d2"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Đơn ứng tuyển"
            value={stats.totalApplications}
            icon={<PeopleIcon />}
            color="#2e7d32"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Phỏng vấn đã hẹn"
            value={stats.interviewsScheduled}
            icon={<AssessmentIcon />}
            color="#ed6c02"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <StatCard
            title="Lượt xem tin"
            value={stats.profileViews}
            icon={<VisibilityIcon />}
            color="#9c27b0"
          />
        </Box>
      </Box>

      {/* Main Content Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        {/* Recent Job Posts */}
        <Box sx={{ flex: '2 1 400px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tin tuyển dụng gần đây
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { title: 'Senior React Developer', applications: 25, status: 'Đang tuyển', postedDate: '2024-01-10' },
                { title: 'Frontend Engineer', applications: 18, status: 'Đang tuyển', postedDate: '2024-01-08' },
                { title: 'UI/UX Designer', applications: 32, status: 'Tạm dừng', postedDate: '2024-01-05' }
              ].map((job, index) => (
                <Box key={index} sx={{ p: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.applications} đơn ứng tuyển • Đăng ngày {job.postedDate}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      backgroundColor: job.status === 'Đang tuyển' ? '#e8f5e8' : '#ffebee',
                      color: job.status === 'Đang tuyển' ? '#2e7d32' : '#d32f2f',
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}
                  >
                    {job.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Recent Applications */}
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Đơn ứng tuyển mới
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { name: 'Nguyễn Văn A', position: 'Senior React Developer', time: '2 giờ trước' },
                { name: 'Trần Thị B', position: 'Frontend Engineer', time: '4 giờ trước' },
                { name: 'Lê Văn C', position: 'UI/UX Designer', time: '1 ngày trước' }
              ].map((application, index) => (
                <Box key={index} sx={{ p: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                  <Typography variant="body2" fontWeight="bold">
                    {application.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Ứng tuyển: {application.position}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    {application.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Performance Analytics */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hiệu quả tuyển dụng
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {[
            { metric: 'Tỷ lệ phỏng vấn', value: '12.5%', trend: '+2.3%', color: '#4caf50' },
            { metric: 'Thời gian tuyển dụng', value: '18 ngày', trend: '-3 ngày', color: '#2196f3' },
            { metric: 'Chi phí tuyển dụng', value: '2.5M VND', trend: '+0.2M', color: '#ff9800' },
            { metric: 'Tỷ lệ thành công', value: '8.2%', trend: '+1.1%', color: '#9c27b0' }
          ].map((metric, index) => (
            <Box key={index} sx={{ flex: '1 1 200px' }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {metric.metric}
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {metric.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: metric.trend.startsWith('+') ? '#4caf50' : metric.trend.startsWith('-') ? '#2196f3' : '#666',
                      fontWeight: 'bold'
                    }}
                  >
                    {metric.trend} so với tháng trước
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

export default EmployerDashboard;