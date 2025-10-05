import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface SystemHealthIndicatorProps {
  status: 'healthy' | 'warning' | 'error';
  label: string;
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ status, label }) => {
  const getColor = () => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#666';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'warning': return <WarningIcon sx={{ fontSize: 16 }} />;
      case 'error': return <ErrorIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
      <Box sx={{ color: getColor(), mr: 1 }}>
        {getIcon()}
      </Box>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <Chip 
        label={status.toUpperCase()} 
        size="small" 
        sx={{ 
          backgroundColor: getColor(), 
          color: 'white',
          fontSize: 10,
          height: 20
        }} 
      />
    </Box>
  );
};

export default SystemHealthIndicator;