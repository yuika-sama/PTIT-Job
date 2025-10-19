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
  Stack, 
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Person,
  DarkMode,
  LightMode,
  AdminPanelSettings, 
  Work,
  Badge
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from "react-router";

interface LogoutConfirmationDialogProps {
  open: boolean;          
  onClose: () => void;      
  onConfirm: () => void;    
}


const LogoutConfirmationDialog: React.FC<LogoutConfirmationDialogProps> = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">Xác nhận đăng xuất</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Bạn có chắc chắn muốn kết thúc phiên làm việc này không?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Hủy</Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Đăng xuất
      </Button>
    </DialogActions>
  </Dialog>
);
interface MainHeaderProps {
  onSidebarToggle: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleColorMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); 
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

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    setOpenConfirmDialog(true); 
  };

  const handleConfirmLogout = async () => {
    setOpenConfirmDialog(false);
    if (logout) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { icon: <AdminPanelSettings fontSize="small" />, name: 'Quản trị viên' };
      case 'employer':
        return { icon: <Work fontSize="small" />, name: 'Nhà tuyển dụng' };
      case 'candidate':
        return { icon: <Badge fontSize="small" />, name: 'Ứng viên' };
      default:
        return { icon: <Person fontSize="small" />, name: 'User' };
    }
  };

  const roleInfo = getRoleInfo(user?.role || ''); 


  return (
    <>
      <AppBar
        position="fixed"
        elevation={0} 
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
      
          background: isDarkMode 
            ? 'rgba(18, 18, 18, 0.7)' 
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          color: 'text.primary', 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onSidebarToggle}
              sx={{ mr: { xs: 1, sm: 2 } }}
            >
              <MenuIcon />
            </IconButton>
            
            <img
              src="http://tracuu.ptit.edu.vn/_next/static/images/ptit-logo-c5be62e95f69e6f8285d1fd2ee0688ca.png"
              alt="PTIT Logo"
              style={{ height: '32px', width: 'auto' }}
            />
            <Typography 
              variant="h6" 
              noWrap
              sx={{
                fontWeight: 700,
                ml: 2,
                display: { xs: 'none', md: 'block' }
              }}
            >
              PTIT Job - Hệ thống quản lý việc làm
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Tooltip title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
              <IconButton color="inherit" onClick={toggleColorMode}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Tài khoản">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  sx={{ width: 36, height: 36 }}
                  alt={user?.full_name}
                >
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 240,
            borderRadius: '12px',
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
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.full_name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {user?.email || ''}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            {roleInfo.icon}
            <Typography variant="caption">{roleInfo.name}</Typography>
          </Stack>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleProfile} sx={{ m: 1, borderRadius: '8px' }}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          Hồ sơ cá nhân
        </MenuItem>
        
        <MenuItem onClick={handleLogoutClick} sx={{ m: 1, borderRadius: '8px', color: 'error.main' }}>
          <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>

 
      <LogoutConfirmationDialog 
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default MainHeader;