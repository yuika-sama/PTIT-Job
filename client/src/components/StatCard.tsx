import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  growth?: number;
  suffix?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  growth, 
  suffix = '',
  loading = false 
}) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1}>
          <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontSize: 14 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {loading ? '-' : value.toLocaleString()}{suffix}
          </Typography>
          {growth !== undefined && !loading && (
            <Box display="flex" alignItems="center">
              <TrendingUpIcon 
                sx={{ 
                  fontSize: 16, 
                  color: growth >= 0 ? '#4caf50' : '#f44336',
                  mr: 0.5 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: growth >= 0 ? '#4caf50' : '#f44336',
                  fontWeight: 'bold'
                }}
              >
                {growth >= 0 ? '+' : ''}{growth}% so với tháng trước
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 2
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;