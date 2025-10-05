import React from 'react';
import {
  Box,
  CssBaseline,
  useTheme
} from '@mui/material';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useSidebar } from '../contexts/SidebarContext';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const { sidebarOpen, isMobile, drawerWidth } = useSidebar();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AdminHeader />

      <AdminSidebar 
        open={sidebarOpen} 
        onToggle={() => {}} 
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: sidebarOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: sidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: 8, // Add margin-top to account for fixed header
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;