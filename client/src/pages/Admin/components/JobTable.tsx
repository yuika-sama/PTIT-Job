import React from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Work as JobIcon,
  Business as CompanyIcon,
  AttachMoney as SalaryIcon
} from '@mui/icons-material';
import { Job } from '../../../services/types';
import { get } from 'http';

interface JobTableProps {
  jobs: Job[];
  loading?: boolean;
  page: number;
  itemsPerPage: number;
  onEdit: (job: Job) => void;
  onView: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

const JobTable: React.FC<JobTableProps> = ({
  jobs,
  loading = false,
  page,
  itemsPerPage,
  onView,
  onEdit,
  onDelete
}) => {
  const getJobTypeLabel = (jobType: string) => {
    const labels = {
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'internship': 'Thực tập',
      'freelance': 'Freelance'
    };
    return labels[jobType as keyof typeof labels] || jobType;
  };

  const getJobTypeColor = (jobType: string) => {
    const colors = {
      'full-time': 'success',
      'part-time': 'info',
      'contract': 'warning',
      'internship': 'secondary',
      'freelance': 'primary'
    };
    return colors[jobType as keyof typeof colors] || 'default';
  };

  const formatSalary = (salary_min?: number, salary_max?: number, currency?: string) => {
    if (salary_min === undefined && salary_max === undefined) return 'Thỏa thuận';
    return `${salary_min ?? 0} - ${salary_max ?? 0} ${currency ?? 'VNĐ'}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusLabel = (status: string): string => {
    const labels = {
      'draft': 'Nháp',
      'published': 'Đã đăng',
      'expired': 'Hết hạn',
      'closed': 'Đã đóng',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const isActiveStatus = (status: string): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default' => {
    const colors = {
      'draft': 'secondary' as const,
      'published': 'primary' as const,
      'expired': 'info' as const,
      'closed': 'error' as const,
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  if (loading) {
    return (
      <Card>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Thông tin việc làm</TableCell>
              <TableCell>Công ty</TableCell>
              <TableCell>Loại hình</TableCell>
              <TableCell>Địa điểm</TableCell>
              <TableCell>Lương</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày đăng</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" color="textSecondary">
                    Không có dữ liệu việc làm
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job, index) => {
                const sttNumber = (page - 1) * itemsPerPage + index + 1;
                
                return (
                  <TableRow key={job.id} hover>
                    <TableCell>{sttNumber}</TableCell>
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <JobIcon fontSize="small" color="primary" />
                          <Typography variant="subtitle2" fontWeight="bold">
                            {job.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: 300
                          }}
                        >
                          {job.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CompanyIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {job.company_name || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getJobTypeLabel(job.job_type)}
                        color={getJobTypeColor(job.job_type) as any}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={job.category_name ?? null}
                        color={"primary"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx = {{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        <Typography variant="body2">
                          {job.location_name}
                        </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <SalaryIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatSalary(job.salary_min, job.salary_max, job.currency)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(job.status || 'draft')}
                        color={isActiveStatus(job.status || 'draft')}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(job.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={0.5}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => onView(job)}
                            color="info"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(job)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(job.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default JobTable;