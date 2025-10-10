import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

export interface ToolCardProps {
  name: string;
  color: string;
  icon: React.ReactElement;
}

const ToolCard: React.FC<ToolCardProps> = ({ name, color, icon }) => {
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as any, { sx: { color: 'white', fontSize: 20 } })
    : icon;
  return (
    <Card
      variant="outlined"
      sx={{
        height: 120,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: color,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1
          }}
        >
          {renderedIcon}
        </Box>
        <Typography variant="body2" fontWeight="bold" textAlign="center">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
