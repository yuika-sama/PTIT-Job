import React from 'react';
import { Alert, Box, LinearProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AnalysisStepProps {
  isUploading: boolean;
  aiServiceHealth: boolean | null;
}

const AnalysisStepComponent: React.FC<AnalysisStepProps> = ({ isUploading, aiServiceHealth }) => {
  const theme = useTheme();

  return (
    <Box sx={{ my: 3 }}>
      {isUploading ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            AI is analysing your CV...
          </Typography>

          {aiServiceHealth === false && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              AI service is unavailable. A mock analysis will be used.
            </Alert>
          )}

          {aiServiceHealth === true && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Real AI service is processing this request.
            </Alert>
          )}

          <LinearProgress
            sx={{
              mb: 2,
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            This may take 30 - 60 seconds.
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          CV analysis completed. Scroll down to review the details.
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(AnalysisStepComponent);
