import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const RoleAccessInfo: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const roleRoutes = {
    admin: [
      '/admin/dashboard - Bảng điều khiển admin',
      '/admin/users - Quản lý người dùng',
      '/admin/companies - Quản lý công ty',
      '/admin/jobs - Quản lý việc làm',
      '/admin/applications - Quản lý đơn ứng tuyển',  
      '/admin/job-categories - Quản lý danh mục việc làm',
      '/admin/locations - Quản lý địa điểm',
      '/admin/reports - Báo cáo hệ thống',
      '/admin/system - Cài đặt hệ thống'
    ],
    employer: [
      '/employer/dashboard - Bảng điều khiển nhà tuyển dụng'
    ],
    candidate: [
      '/candidate/dashboard - Bảng điều khiển ứng viên'
    ]
  };

  const sharedRoutes = [
    '/profile - Hồ sơ cá nhân',
    '/settings - Cài đặt tài khoản'
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        🔐 Thông tin phân quyền truy cập
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6">Vai trò hiện tại:</Typography>
            <Chip 
              label={user.role.toUpperCase()} 
              color={user.role === 'admin' ? 'error' : user.role === 'employer' ? 'primary' : 'success'}
              variant="filled"
            />
          </Box>
          
          <Typography variant="body2" color="textSecondary">
            Tên: {user.full_name || user.email}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Danh sách trang có thể truy cập:
          </Typography>
          
          <Typography variant="subtitle1" color="primary" sx={{ mt: 2, mb: 1 }}>
            🎯 Trang chuyên biệt cho {user.role}:
          </Typography>
          {roleRoutes[user.role as keyof typeof roleRoutes]?.map((route, index) => (
            <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5 }}>
              • {route}
            </Typography>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" color="secondary" sx={{ mb: 1 }}>
            🌐 Trang chung cho tất cả người dùng:
          </Typography>
          {sharedRoutes.map((route, index) => (
            <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5 }}>
              • {route}
            </Typography>
          ))}
          
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              💡 <strong>Lưu ý:</strong> Truy cập vào trang không được phép sẽ chuyển hướng đến trang 403 Forbidden.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoleAccessInfo;