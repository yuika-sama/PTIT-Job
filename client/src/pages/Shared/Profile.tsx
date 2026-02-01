import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Card, 
  CardContent,
  Chip,
  Button,
  IconButton,
  Divider,
  Fade,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  DateRange as DateIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  console.log('User data:', user);  
  const [avatarHover, setAvatarHover] = useState(false);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<'name' | 'phone' | 'company' | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Loading states
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [savePasswordLoading, setSavePasswordLoading] = useState(false);

  // Update editForm when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user]);

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'employer': return 'primary';
      case 'candidate': return 'success';
      default: return 'default';
    }
  };

  const getRoleText = (role?: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'employer': return 'Nhà tuyển dụng';
      case 'candidate': return 'Ứng viên';
      default: return role || 'Chưa xác định';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaveProfileLoading(true);
      const response = await userService.updateUser(user?.id || '', editForm);
      
      if (response.success && response.data) {
        // Update user context with new data
        updateUser(response.data);
        showSnackbar('Cập nhật hồ sơ thành công!', 'success');
        setEditDialogOpen(false);
      } else {
        showSnackbar(response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ', 'error');
      }
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật hồ sơ', 'error');
    } finally {
      setSaveProfileLoading(false);
    }
  };

  const handleEditField = (field: 'name' | 'phone' | 'company') => {
    setCurrentEditField(field);
    setEditFieldDialogOpen(true);
  };

  const handleSaveField = async () => {
    try {
      setSaveProfileLoading(true);
      const response = await userService.updateUser(user?.id || '', editForm);
      
      if (response.success && response.data) {
        // Update user context with new data
        updateUser(response.data);
        showSnackbar('Cập nhật thông tin thành công!', 'success');
        setEditFieldDialogOpen(false);
        setCurrentEditField(null);
      } else {
        showSnackbar(response.message || 'Có lỗi xảy ra khi cập nhật thông tin', 'error');
      }
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật thông tin', 'error');
    } finally {
      setSaveProfileLoading(false);
    }
  };

  const handleChangePassword = () => {
    setPasswordDialogOpen(true);
  };

  const handleSavePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showSnackbar('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showSnackbar('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
      return;
    }

    try {
      setSavePasswordLoading(true);
      const response = await authService.changePassword(
        passwordForm.currentPassword, 
        passwordForm.newPassword
      );
      
      if (response.success) {
        showSnackbar('Đổi mật khẩu thành công!', 'success');
        setPasswordDialogOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showSnackbar(response.message || 'Có lỗi xảy ra khi đổi mật khẩu', 'error');
      }
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Có lỗi xảy ra khi đổi mật khẩu', 'error');
    } finally {
      setSavePasswordLoading(false);
    }
  };

  const handleOpenSettings = () => {
    setSettingsDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8,
        px: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1, }} >
      <Fade in timeout={800}>
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 2,
            background: 'linear-gradient(135deg, #DE221A 0%, #B01B14 50%, #0A4D8C 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, mb: 2 }}>
              <Box
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
                sx={{ position: 'relative' }}
              >
                <Avatar
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    fontSize: 32, 
                    fontWeight: 'bold',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {getInitials(user?.full_name)}
                </Avatar>
                {avatarHover && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: 'white',
                      color: 'primary.main',
                      width: 35,
                      height: 35,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {user?.full_name || 'Người dùng'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={getRoleText(user?.role)}
                    color={getRoleColor(user?.role)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  {user?.is_active && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Đang hoạt động"
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255,255,255,0.5)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {user?.email}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {user?.id}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Chỉnh sửa hồ sơ" onClick={handleEditProfile}>
                  <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
              zIndex: 0
            }}
          />
        </Paper>
      </Fade>

      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Fade in timeout={1000}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Thông tin cá nhân 
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: 'info.main' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <AccountIcon sx={{ mr: 2, color: 'success.main' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Họ và tên
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user?.full_name || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => handleEditField('name')}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <PhoneIcon sx={{ mr: 2, color: 'warning.main' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user?.phone_number || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => handleEditField('phone')}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Company (for employers) */}
                  {user?.role === 'employer' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Công ty
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user?.company_name || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => handleEditField('company')}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Box>

        {/* Account Status & Actions */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Account Status */}
            <Fade in timeout={1200}>
              <Card elevation={2}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Trạng thái tài khoản
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Trạng thái
                      </Typography>
                      <Chip
                        label={user?.is_active ? 'Hoạt động' : 'Bị khóa'}
                        color={user?.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Vai trò
                      </Typography>
                      <Chip
                        label={getRoleText(user?.role)}
                        color={getRoleColor(user?.role)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày tham gia
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>

            {/* Quick Actions */}
            <Fade in timeout={1400}>
              <Card elevation={2}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Thao tác nhanh
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      fullWidth
                      sx={{ 
                        py: 1,
                        background: 'linear-gradient(45deg, #DE221A 30%, #B01B14 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #B01B14 30%, #8E1611 90%)',
                        }
                      }}
                      onClick={handleEditProfile}
                    >
                      Chỉnh sửa hồ sơ
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      fullWidth
                      onClick={handleChangePassword}
                      sx={{ 
                        py: 1,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      Đổi mật khẩu
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      fullWidth
                      onClick={handleOpenSettings}
                      sx={{ 
                        py: 1,
                        borderColor: 'secondary.main',
                        color: 'secondary.main',
                        '&:hover': {
                          borderColor: 'secondary.dark',
                          backgroundColor: 'secondary.light',
                          color: 'white'
                        }
                      }}
                    >
                      Cài đặt tài khoản
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Họ và tên"
              fullWidth
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              value={editForm.phone_number}
              onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={saveProfileLoading}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProfile}
            disabled={saveProfileLoading}
          >
            {saveProfileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={editFieldDialogOpen} onClose={() => setEditFieldDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Chỉnh sửa {currentEditField === 'name' ? 'Họ và tên' : currentEditField === 'phone' ? 'Số điện thoại' : 'Tên công ty'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={
              currentEditField === 'name' ? editForm.full_name : editForm.phone_number
            }
            onChange={(e) => {
              if (currentEditField === 'name') {
                setEditForm({ ...editForm, full_name: e.target.value });
              } else {
                setEditForm({ ...editForm, phone_number: e.target.value });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditFieldDialogOpen(false)} disabled={saveProfileLoading}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveField}
            disabled={saveProfileLoading}
          >
            {saveProfileLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              helperText="Mật khẩu phải có ít nhất 6 ký tự"
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)} disabled={savePasswordLoading}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleSavePassword} 
            color="primary"
            disabled={savePasswordLoading}
          >
            {savePasswordLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cài đặt tài khoản</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Alert severity="info">
              Các tùy chọn cài đặt tài khoản sẽ được bổ sung trong phiên bản tiếp theo.
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Tính năng sắp ra mắt:</Typography>
              <ul>
                <li>Cài đặt thông báo email</li>
                <li>Tùy chọn bảo mật hai lớp (2FA)</li>
                <li>Quản lý phiên đăng nhập</li>
                <li>Cài đặt quyền riêng tư</li>
              </ul>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;