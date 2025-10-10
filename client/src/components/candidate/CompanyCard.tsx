import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

export interface CompanyCardProps {
  name: string;
  category?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, category = 'Công nghệ thông tin' }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: 180,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            backgroundColor: '#1976d2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <BusinessIcon sx={{ color: 'white', fontSize: 30 }} />
        </Box>
        <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {category}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
