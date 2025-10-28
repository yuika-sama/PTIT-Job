import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingFallbackProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Đang tải...', 
  size = 60,
  fullScreen = true 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: fullScreen ? '100vh' : '400px',
        width: '100%',
        background: fullScreen 
          ? 'linear-gradient(135deg, #DE221A 0%, #B01B14 50%, #0A4D8C 100%)' 
          : 'transparent'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress 
          size={size} 
          sx={{ 
            color: fullScreen ? 'white' : 'primary.main',
            mb: 2 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: fullScreen ? 'white' : 'text.primary',
            fontWeight: 500 
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingFallback;
