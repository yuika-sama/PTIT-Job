import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import DashboardStats from '../../components/DashboardStats';
import SecondaryStats from '../../components/SecondaryStats';
import SystemHealth from '../../components/SystemHealth';
import RecentActivities from '../../components/RecentActivities';


const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const isAdmin = user?.role === 'admin';

  const handleRefresh = () => {
    setLastUpdated(new Date());
 
    window.location.reload();
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6">Truy cập bị từ chối</Typography>
          <Typography>Bạn không có quyền truy cập trang quản trị viên.</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Bảng điều khiển quản trị viên
          </Typography>
          <Typography variant="subtitle1" color="primary">
            Tổng quan hoạt động hệ thống PTIT Job
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="caption" color="textSecondary">
            Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          </Typography>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <DashboardStats />

      <SecondaryStats />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <SystemHealth />
        </Box>

        <Box sx={{ flex: '2 1 500px', minWidth: 500 }}>
          <RecentActivities />
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;