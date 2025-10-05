import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const Reports: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Báo cáo & Thống kê hệ thống
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Trang báo cáo và thống kê tổng thể cho quản trị viên đang được phát triển...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Reports;