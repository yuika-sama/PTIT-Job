import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StepIconProps } from '@mui/material/StepIcon';

export const createStepIcon = (IconComponent: React.ElementType) => {
  const StepIcon: React.FC<StepIconProps> = ({ active, completed }) => {
    const theme = useTheme();
    const isActive = Boolean(active || completed);

    return (
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: isActive ? theme.palette.primary.main : theme.palette.grey[300],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconComponent sx={{ color: 'white', fontSize: 20 }} />
      </Box>
    );
  };

  return StepIcon;
};
