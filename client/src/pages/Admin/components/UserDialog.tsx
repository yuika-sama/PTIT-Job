import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Assignment as CandidateIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { User } from '../../../services/types';

interface UserFormData {
  email: string;
  full_name: string;
  phone_number: string;
  role: 'admin' | 'employer' | 'candidate';
  company_id?: string;
  is_active: boolean;
  password?: string;
}

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  user: User | null;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  onSave: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onClose,
  mode,
  user,
  formData,
  setFormData,
  onSave
}) => {
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' && 'Thêm người dùng mới'}
        {mode === 'edit' && 'Chỉnh sửa người dùng'}
        {mode === 'view' && 'Chi tiết người dùng'}
      </DialogTitle>
      <DialogContent>
        {mode === 'view' && user ? (
          <Box sx={{ pt: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: getRoleColor(user.role) }}>
                {user.full_name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{user.full_name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  {getRoleIcon(user.role)}
                  <Chip
                    label={user.role.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getRoleColor(user.role),
                      color: 'white'
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Số điện thoại
                </Typography>
                <Typography variant="body1">{user.phone_number || 'Không có'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Công ty
                </Typography>
                <Typography variant="body1">
                  {user.company_name || 'Không có'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày tạo
                </Typography>
                <Typography variant="body1">
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Cập nhật cuối
                </Typography>
                <Typography variant="body1">
                  {new Date(user.updated_at).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Trạng thái
                </Typography>
                {getStatusChip(user)}
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Công ty trực thuộc
                </Typography>
                <Typography variant="body1">
                  {user.company_name || 'Không có'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={mode === 'edit'}
                required
              />
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <MenuItem value="candidate">Candidate</MenuItem>
                  <MenuItem value="employer">Employer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {mode === 'add' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="Tài khoản hoạt động"
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {mode === 'view' ? 'Đóng' : 'Hủy'}
        </Button>
        {mode !== 'view' && (
          <Button variant="contained" onClick={onSave}>
            {mode === 'add' ? 'Thêm' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;