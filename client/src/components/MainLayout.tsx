import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import RoleBasedSidebar from './RoleBasedSidebar';
import MainHeader from './MainHeader';
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return null; // This should be handled by the routing
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden'}}>
      {/* Top Header */}
      <MainHeader onSidebarToggle={handleSidebarToggle} />

      {/* Sidebar */}
      <RoleBasedSidebar 
        open={sidebarOpen}  
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          overflow: 'auto',
          width: '100%',
          pt: 12,
        }}
      >
          {children}
      </Box>
    </Box>
  );
};

export default MainLayout;