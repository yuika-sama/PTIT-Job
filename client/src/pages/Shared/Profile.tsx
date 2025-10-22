import React, { useState } from 'react';
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
  Tooltip
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

const Profile: React.FC = () => {
  const { user } = useAuth();
  console.log('User data:', user);
  const [avatarHover, setAvatarHover] = useState(false);

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

  const handleEditProfile = () => {
    // Logic to open edit profile dialog or navigate to edit profile page
    alert('Chức năng chỉnh sửa hồ sơ sẽ được triển khai sau.');
  }

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
                    <IconButton size="small">
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
                    <IconButton size="small">
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
                      <IconButton size="small">
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
    </Container>
  );
};

export default Profile;