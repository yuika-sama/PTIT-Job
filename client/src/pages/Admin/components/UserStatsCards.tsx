import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Assignment as CandidateIcon
} from '@mui/icons-material';
import { User } from '../../../services/types';

interface UserStatsCardsProps {
  users: User[];
}

interface UserStats {
  total: number;
  active: number;
  admins: number;
  employers: number;
  candidates: number;
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  const getUserStats = (): UserStats => {
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const admins = users.filter(u => u.role === 'admin').length;
    const employers = users.filter(u => u.role === 'employer').length;
    const candidates = users.filter(u => u.role === 'candidate').length;
    
    return { total, active, admins, employers, candidates };
  };

  const stats = getUserStats();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Tổng số</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {stats.total}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Tất cả người dùng
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon sx={{ color: '#4caf50' }} />
            <Typography variant="h6">Hoạt động</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            {stats.active}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Đang hoạt động
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <AdminIcon sx={{ color: '#f44336' }} />
            <Typography variant="h6">Quản trị viên</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
            {stats.admins}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Admin
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon sx={{ color: '#2196f3' }} />
            <Typography variant="h6">Nhà tuyển dụng</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            {stats.employers}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Employer
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <CandidateIcon sx={{ color: '#4caf50' }} />
            <Typography variant="h6">Ứng viên</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            {stats.candidates}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Candidate
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserStatsCards;