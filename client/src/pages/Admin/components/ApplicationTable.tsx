import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { JobApplication, ApplicationStatus } from '../../../services/types';

interface ApplicationTableProps {
  applications: JobApplication[];
  loading: boolean;
  page: number;
  itemsPerPage: number;
  onView: (application: JobApplication) => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

const getStatusColor = (status: ApplicationStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'pending': return 'warning';
    case 'viewed': return 'info';
    case 'shortlisted': return 'primary';
    case 'hired': return 'success';
    case 'rejected': return 'error';
    default: return 'default';
  }
};

const getStatusText = (status: ApplicationStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ duyệt';
    case 'viewed': return 'Đã xem xét';
    case 'shortlisted': return 'Danh sách ngắn';
    case 'hired': return 'Đã tuyển';
    case 'rejected': return 'Đã từ chối';
    default: return status;
  }
};

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  loading,
  page,
  itemsPerPage,
  onView,
  onApprove,
  onReject
}) => {
  const theme = useTheme();
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải danh sách đơn ứng tuyển...
        </Typography>
      </Box>
    );
  }

  if (applications.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Không có đơn ứng tuyển nào
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.850' }}>
            <TableCell><strong>STT</strong></TableCell>
            <TableCell><strong>Tên người dùng</strong></TableCell>
            <TableCell><strong>Tên công việc</strong></TableCell>
            <TableCell><strong>Resume URL</strong></TableCell>
            <TableCell><strong>Trạng thái</strong></TableCell>
            <TableCell><strong>Ngày ứng tuyển</strong></TableCell>
            <TableCell><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((application, index) => (
            <TableRow key={application.id} hover>
              <TableCell>
                {(page - 1) * itemsPerPage + index + 1}
              </TableCell>
              
              <TableCell>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                    {application.user_name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {application.user_name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {application.user_email || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {application.job_name || 'N/A'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {application.file_url ? (
                    <a href={application.file_url} target="_blank" rel="noopener noreferrer">
                      Xem Resume
                    </a>
                  ) : 'N/A'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={getStatusText(application.status)}
                  color={getStatusColor(application.status)}
                  size="small"
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {new Date(application.applied_at).toLocaleDateString('vi-VN')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => onView(application)}
                      color="primary"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  {application.status === 'pending' && (
                    <>
                      <Tooltip title="Duyệt đơn">
                        <IconButton
                          size="small"
                          onClick={() => onApprove(application.id)}
                          color="success"
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Từ chối">
                        <IconButton
                          size="small"
                          onClick={() => onReject(application.id)}
                          color="error"
                        >
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  
                  {application.user_email && (
                    <Tooltip title="Gửi email">
                      <IconButton
                        size="small"
                        component="a"
                        href={`mailto:${application.user_email}`}
                        color="info"
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApplicationTable;