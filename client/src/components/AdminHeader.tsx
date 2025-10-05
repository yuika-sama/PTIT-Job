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
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  Logout,
  Person
} from '@mui/icons-material';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const theme = useTheme();
  const { sidebarOpen, toggleSidebar, isMobile, drawerWidth } = useSidebar();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    // TODO: Implement profile page navigation
    console.log('Navigate to profile');
  };

  const handleSettings = () => {
    handleProfileMenuClose();
    // TODO: Implement settings page navigation
    console.log('Navigate to settings');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    if (logout) {
      logout();
    }
    // TODO: Implement navigation to login
    console.log('Logout and redirect to login');
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: sidebarOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: sidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              onClick={toggleSidebar}
              edge="start"
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
                PTIT Job Admin Dashboard
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
              Xin chào, {user?.full_name || 'Admin'}
            </Typography>
            
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
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
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
            {user?.full_name || 'Admin User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || 'admin@ptit.edu.vn'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {user?.role || 'Admin'}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Hồ sơ cá nhân" />
        </MenuItem>
        
        <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cài đặt" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText',
            }
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default AdminHeader;