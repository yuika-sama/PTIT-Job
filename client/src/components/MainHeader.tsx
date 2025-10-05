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
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Person,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {useNavigate} from "react-router";

interface MainHeaderProps {
  onSidebarToggle: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleColorMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };


  const handleLogout = async () => {
    handleProfileMenuClose();
    
    // Hiển thị dialog xác nhận
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
    
    if (confirmLogout && logout) {
      try {
        await logout();
        // Chuyển hướng về trang login
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Có thể hiển thị thông báo lỗi ở đây
      }
    }
  };

  const isMenuOpen = Boolean(anchorEl);

  // Get role-based title
  const getRoleBasedTitle = () => {
    return 'PTIT Job - Hệ thống tuyển dụng';
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // Theme colors will be applied automatically from ThemeContext
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={onSidebarToggle}
              sx={{ 
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="http://tracuu.ptit.edu.vn/_next/static/images/ptit-logo-c5be62e95f69e6f8285d1fd2ee0688ca.png"
                alt="PTIT Logo"
                style={{
                  height: '40px',
                  width: 'auto',
                  marginRight: '8px'
                }}
              />
              <Typography 
                variant="h6" 
                noWrap 
                component="div"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  color: 'white'
                }}
              >
                {getRoleBasedTitle()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'rgba(255, 255, 255, 0.8)',
                mr: 1
              }}
            >
              Xin chào, {user?.full_name || 'User'}
            </Typography>

            {/* Dark Mode Toggle */}
            <Tooltip title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}>
              <IconButton
                size="medium"
                edge="start"
                color="inherit"
                onClick={toggleColorMode}
                sx={{
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account menu"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.full_name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || 'user@ptit.edu.vn'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {user?.role === 'admin' ? 'Quản trị viên' : 
                  user?.role === 'employer' ? 'Nhà tuyển dụng' : 
                  user?.role === 'candidate' ? 'Ứng viên' : 'User'}
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
              transform: 'translateX(2px)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:active': {
              transform: 'translateX(0px)',
            }
          }}
        >
          <ListItemIcon>
            <Person 
              fontSize="small" 
              sx={{ 
                color: 'primary.main',
                transition: 'color 0.2s ease-in-out',
              }} 
            />
          </ListItemIcon>
          <ListItemText 
            primary="Hồ sơ cá nhân" 
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          />
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
              transform: 'translateX(2px)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:active': {
              transform: 'translateX(0px)',
            }
          }}
        >
          <ListItemIcon>
            <Logout 
              fontSize="small" 
              sx={{ 
                color: 'inherit',
                transition: 'transform 0.2s ease-in-out',
              }} 
            />
          </ListItemIcon>
          <ListItemText 
            primary="Đăng xuất" 
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MainHeader;