import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
              py: 4
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 100,
                color: 'error.main',
                mb: 3
              }}
            />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Oops! Có lỗi xảy ra
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Rất tiếc, đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  maxWidth: '100%',
                  overflowX: 'auto'
                }}
              >
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReload}
                size="large"
              >
                Tải lại trang
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleGoHome}
                size="large"
              >
                Về trang chủ
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
