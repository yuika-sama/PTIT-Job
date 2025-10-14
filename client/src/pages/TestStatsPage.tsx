import React from 'react';
import StatsBar from '../components/candidate/StatsBar';
import { Box, Container, Typography } from '@mui/material';

const TestStatsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stats Bar với dữ liệu từ API
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Component StatsBar bây giờ tự động lấy dữ liệu từ API endpoint <code>/api/stats/general</code>
      </Typography>
      
      <Box>
        <StatsBar />
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tính năng:
        </Typography>
        <ul>
          <li>Tự động tải dữ liệu từ API khi component được mount</li>
          <li>Hiển thị trạng thái loading khi đang tải</li>
          <li>Fallback về dữ liệu mặc định nếu API lỗi</li>
          <li>Nút refresh để tải lại dữ liệu</li>
          <li>Hiển thị thông báo lỗi nếu có</li>
        </ul>
      </Box>
    </Container>
  );
};

export default TestStatsPage;