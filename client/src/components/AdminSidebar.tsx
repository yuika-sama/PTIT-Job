import React, { useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  Settings,
  Logout,
  ChevronLeft,
  WorkOutline,
  BusinessCenter,
  Description,
  LocationOn,
  Category,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';

interface AdminSidebarProps {
  open?: boolean;
  onToggle?: () => void;
  currentPath?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  open = true, 
  onToggle,
  currentPath
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sử dụng location.pathname thay vì selectedPath state
  const currentPathFromUrl = location.pathname;
  
  useEffect(() => {
    // Effect này không cần thiết nữa vì chúng ta sử dụng location.pathname
  }, [currentPath]);
  
  const drawerWidth = 240;
  
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Jobs', icon: <WorkOutline />, path: '/jobs' },
    { text: 'Companies', icon: <BusinessCenter />, path: '/companies' },
    { text: 'Applications', icon: <Assignment />, path: '/applications' },
    { text: 'Resumes', icon: <Description />, path: '/resumes' },
    { text: 'Locations', icon: <LocationOn />, path: '/locations' },
    { text: 'Job Categories', icon: <Category />, path: '/job-categories' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    
    console.log('Navigate to:', path);
    if (isMobile && onToggle) {
      onToggle(); 
    }
  };
  
  const handleLogOut = () => {
    // log out logic goes here
    navigate('/login');
  }

  const DrawerContent = () => (
    <Box sx={{ width: drawerWidth, height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          minHeight: 64,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
        {!isMobile && (
          <IconButton onClick={onToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => {
          const isSelected = currentPathFromUrl === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '20',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '30',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: '3px',
                      backgroundColor: theme.palette.primary.main,
                      animation: 'slideIn 0.3s ease-out',
                    },
                  },
                  '@keyframes slideIn': {
                    from: {
                      height: 0,
                    },
                    to: {
                      height: '100%',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    transition: 'color 0.3s ease-in-out',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    color: isSelected 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                    fontWeight: isSelected ? 600 : 400,
                    transition: 'all 0.3s ease-in-out',
                    '& .MuiTypography-root': {
                      fontSize: isSelected ? '0.95rem' : '0.875rem',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleLogOut()}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.error.light,
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              sx={{ color: theme.palette.error.main }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        /* Mobile Drawer */
        <Drawer
          variant="temporary"
          open={open}
          onClose={onToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              marginTop: '64px', // Height of AppBar/Header
              height: 'calc(100vh - 64px)', // Subtract header height
              zIndex: (theme) => theme.zIndex.appBar - 1, // Below AppBar
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop: '64px', // Height of AppBar/Header
              height: 'calc(100vh - 64px)', // Subtract header height
              zIndex: (theme) => theme.zIndex.appBar - 1, // Below AppBar
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      )}
    </>
  );
};

export default AdminSidebar;