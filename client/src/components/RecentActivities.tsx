import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Box
} from '@mui/material';

interface Activity {
  id: string;
  type: 'user' | 'company' | 'job' | 'application';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await fetch('/api/admin/recent-activities', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        } else {
          // Fallback to mock data
          setActivities([
            {
              id: '1',
              type: 'user',
              description: 'Người dùng mới đăng ký: Nguyễn Văn A',
              timestamp: '5 phút trước',
              status: 'success'
            },
            {
              id: '2',
              type: 'company',
              description: 'Công ty mới đăng ký: FPT Software',
              timestamp: '15 phút trước',
              status: 'warning'
            },
            {
              id: '3',
              type: 'job',
              description: 'Tin tuyển dụng mới: Senior Developer',
              timestamp: '1 giờ trước',
              status: 'success'
            },
            {
              id: '4',
              type: 'application',
              description: 'Đơn ứng tuyển mới cho vị trí React Developer',
              timestamp: '2 giờ trước',
              status: 'success'
            }
          ]);
        }
      } catch (error) {
        // Mock data for development
        setActivities([
          {
            id: '1',
            type: 'user',
            description: 'Người dùng mới đăng ký: Nguyễn Văn A',
            timestamp: '5 phút trước',
            status: 'success'
          },
          {
            id: '2',
            type: 'company',
            description: 'Công ty mới đăng ký: FPT Software',
            timestamp: '15 phút trước',
            status: 'warning'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Hoạt động gần đây
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Loại</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <Chip 
                    label={activity.type.toUpperCase()} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {activity.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="textSecondary">
                    {activity.timestamp}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={activity.status} 
                    size="small"
                    color={activity.status === 'success' ? 'success' : 
                           activity.status === 'warning' ? 'warning' : 'error'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentActivities;