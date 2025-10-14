import React from 'react';
import {
  Container,
  Alert,
  Button,
  Skeleton,
  Box
} from '@mui/material';

interface JobLoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onGoBack: () => void;
  children: React.ReactNode;
}

const JobLoadingState: React.FC<JobLoadingStateProps> = ({ 
  isLoading, 
  error, 
  onGoBack, 
  children 
}) => {
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 2 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={onGoBack}>
              Quay lại
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
};

export default JobLoadingState;