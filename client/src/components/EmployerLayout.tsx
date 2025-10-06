import React from 'react';
import { Box } from '@mui/material';
import EmployerHeader from './EmployerHeader';
import EmployerFooter from './EmployerFooter';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

const EmployerLayout: React.FC<EmployerLayoutProps> = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {/* Header */}
      <EmployerHeader />

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <EmployerFooter />
    </Box>
  );
};

export default EmployerLayout;