import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const System: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cài đặt hệ thống
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Trang cài đặt hệ thống chỉ dành cho quản trị viên...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default System;