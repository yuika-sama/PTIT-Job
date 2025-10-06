import React from 'react';
import { Box } from '@mui/material';
import CandidateHeader from './CandidateHeader';
import CandidateFooter from './CandidateFooter';

interface CandidateLayoutProps {
  children: React.ReactNode;
}

const CandidateLayout: React.FC<CandidateLayoutProps> = ({ children }) => {
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
      <CandidateHeader />

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
      <CandidateFooter />
    </Box>
  );
};

export default CandidateLayout;