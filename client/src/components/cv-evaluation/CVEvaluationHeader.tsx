import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CVEvaluationHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  helperText?: string;
}

const CVEvaluationHeaderComponent: React.FC<CVEvaluationHeaderProps> = ({
  title = 'AI CV Evaluation',
  subtitle = 'Upload your CV and receive detailed feedback powered by our AI pipeline.',
  description = 'Discover strengths, improvements, and personalised growth recommendations.',
  helperText,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        {subtitle}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
      {helperText ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {helperText}
        </Typography>
      ) : null}
    </Box>
  );
};

export default React.memo(CVEvaluationHeaderComponent);
