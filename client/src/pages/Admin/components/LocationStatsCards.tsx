import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import {
  LocationCity as LocationIcon,
  CheckCircle as ActiveIcon,
  Public as CountryIcon,
  Work as JobIcon
} from '@mui/icons-material';
import { Location } from '../../../services/types';

interface LocationStatsCardsProps {
  locations: Location[];
  loading: boolean;
}

const LocationStatsCards: React.FC<LocationStatsCardsProps> = ({ locations, loading }) => {
  const totalLocations = locations.length;
  const totalJobs = locations.reduce((sum, loc) => sum + (Number(loc.job_count) || 0), 0);

  const statsData = [
    {
      title: 'Tổng địa điểm',
      value: totalLocations,
      icon: <LocationIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
      textColor: '#1976d2'
    },
    {
      title: 'Tổng việc làm',
      value: totalJobs,
      icon: <JobIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee',
      textColor: '#d32f2f'
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexWrap: 'wrap',
        '& > *': { 
          flex: '1 1 250px',
          minWidth: 250
        }
      }}>
        {statsData.map((stat, index) => (
          <Card key={index} sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: stat.color,
                  mr: 2
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="h4" component="div" fontWeight="bold" color={stat.textColor}>
                    {stat.value.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default LocationStatsCards;