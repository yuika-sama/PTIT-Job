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
  Avatar,
  Typography,
  Pagination,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Assignment as CandidateIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { User } from '../../../services/types';

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  totalCount: number;
  pageSize: number;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize
}) => {
  const theme = useTheme();
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminIcon sx={{ fontSize: 16 }} />;
      case 'employer': return <BusinessIcon sx={{ fontSize: 16 }} />;
      case 'candidate': return <CandidateIcon sx={{ fontSize: 16 }} />;
      default: return <PersonIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#f44336';
      case 'employer': return '#2196f3';
      case 'candidate': return '#4caf50';
      default: return '#666';
    }
  };

  const getStatusChip = (user: User) => {
    if (!user.is_active) {
      return <Chip label="Bị khóa" color="error" size="small" />;
    }
    return <Chip label="Hoạt động" color="success" size="small" />;
  };

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[200] === 'light' ? 'grey.50' : 'grey.850' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Người dùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Công ty trực thuộc</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => {
              const sttNumber = (currentPage - 1) * pageSize + index + 1;
              return (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {sttNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: getRoleColor(user.role) }}>
                        {user.full_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {user.full_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user.email}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          {user.phone_number}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getRoleIcon(user.role)}
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getRoleColor(user.role),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {user.company_name || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(user)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => onView(user)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.is_active ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}>
                        <IconButton
                          size="small"
                          onClick={() => onToggleStatus(user.id, user.is_active)}
                          color={user.is_active ? 'error' : 'success'}
                        >
                          {user.is_active ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(user.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Hiển thị {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} người dùng
        </Typography>
        
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        )}
      </Box>
    </Card>
  );
};

export default UserTable;