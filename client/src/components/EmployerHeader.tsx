import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode,
  LightMode,
  Search as SearchIcon,
  Work as JobIcon,
  Build as ToolIcon,
  Assessment as CVIcon,
  VideoCall as InterviewIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const EmployerHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleColorMode } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    navigate('/employer/profile');
  };

  const handleSettings = () => {
    handleProfileMenuClose();
    navigate('/employer/settings');
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
    
    if (confirmLogout && logout) {
      try {
        await logout();
        navigate('/auth/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/employer/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const navigationItems = [
    {
      label: 'Tìm ứng viên',
      icon: <JobIcon fontSize="small" />,
      path: '/employer/candidates',
      description: 'Tìm kiếm ứng viên phù hợp'
    },
    {
      label: 'Công cụ',
      icon: <ToolIcon fontSize="small" />,
      path: '/employer/tools',
      description: 'Công cụ hỗ trợ tuyển dụng'
    },
    {
      label: 'Đánh giá CV',
      icon: <CVIcon fontSize="small" />,
      path: '/employer/cv-review',
      description: 'Công cụ đánh giá CV tự động'
    },
    {
      label: 'Giả lập phỏng vấn',
      icon: <InterviewIcon fontSize="small" />,
      path: '/employer/interview-simulator',
      description: 'Công cụ giả lập phỏng vấn'
    }
  ];

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        {/* Left Section - Logo & Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/employer/dashboard')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}
            >
              <BusinessIcon />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" fontWeight="bold" color="inherit">
                PTIT Job
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                Nhà tuyển dụng
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Center Section - Navigation & Search */}
        <Box sx={{ 
          display: { xs: 'none', lg: 'flex' }, 
          alignItems: 'center', 
          gap: 3,
          flex: 1,
          maxWidth: 800,
          mx: 4
        }}>
          {/* Navigation Items */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navigationItems.map((item, index) => (
              <Tooltip key={index} title={item.description} arrow>
                <Button
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }
                  }}
                >
                  {item.label}
                </Button>
              </Tooltip>
            ))}
          </Box>

          {/* Search Bar */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              flexGrow: 1, 
              maxWidth: 300,
              ml: 2
            }}
          >
            <TextField
              size="small"
              placeholder="Tìm kiếm ứng viên, CV..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(0,0,0,0.6)' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'white'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
              fullWidth
            />
          </Box>
        </Box>

        {/* Right Section - Actions & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Thông báo">
            <IconButton 
              color="inherit"
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}>
            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              sx={{
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* User Info (hidden on mobile) */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            mr: 1
          }}>
            <Typography variant="body2" color="rgba(255,255,255,0.9)" fontWeight={500}>
              {user?.full_name || user?.email}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              Nhà tuyển dụng
            </Typography>
          </Box>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account menu"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'E'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 2,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.full_name || 'Nhà tuyển dụng'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tài khoản nhà tuyển dụng
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem 
            onClick={handleProfile} 
            sx={{ 
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              }
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText primary="Hồ sơ cá nhân" />
          </MenuItem>
          
          <MenuItem 
            onClick={handleSettings} 
            sx={{ 
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'secondary.light',
                color: 'secondary.contrastText',
              }
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: 'secondary.main' }} />
            </ListItemIcon>
            <ListItemText primary="Cài đặt" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={handleLogout} 
            sx={{ 
              py: 1.5,
              color: 'error.main',
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default EmployerHeader;