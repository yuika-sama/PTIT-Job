import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';

export interface IndustryCardProps {
  name: string;
  jobsCount?: number;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ name, jobsCount }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: 120,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <WorkIcon sx={{ fontSize: 30, color: '#1976d2', mb: 1 }} />
        <Typography variant="body2" fontWeight="bold" textAlign="center">
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {jobsCount}+ việc làm
        </Typography>
      </CardContent>
    </Card>
  );
};

export default IndustryCard;
