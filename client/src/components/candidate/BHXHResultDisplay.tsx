import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { BHXHResult } from './BHXHCalculator';

interface BHXHResultDisplayProps {
  result: BHXHResult | null;
  type: 'mandatory' | 'voluntary' | 'both';
}

const BHXHResultDisplay: React.FC<BHXHResultDisplayProps> = ({ result, type }) => {
  if (!result) {
    return (
        <>
            <Box sx={{width: '100%', height: 90, display: 'flex', textJustify: 'center' }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#009a3e', fontWeight: 600 }}>
                    Kết quả tính toán
                </Typography>
            </Box>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', border: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" color="text.secondary">
                        Vui lòng nhập thông tin và tính toán để xem kết quả
                    </Typography>
            </Paper>
        </>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const formatTime = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} tháng`;
    } else if (remainingMonths === 0) {
      return `${years} năm`;
    } else {
      return `${years} năm ${remainingMonths} tháng`;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'mandatory': return 'BHXH bắt buộc';
      case 'voluntary': return 'BHXH tự nguyện';
      case 'both': return 'Cả BHXH bắt buộc & BHXH tự nguyện';
      default: return '';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'mandatory': return '#009a3e';
      case 'voluntary': return '#009a3e';
      case 'both': return '#009a3e';
      default: return '#009a3e';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ color: '#009a3e', fontWeight: 600 }}>
          Mức lương đóng BHXH
        </Typography>
        <Chip 
          label={getTypeLabel()} 
          sx={{ 
            backgroundColor: getTypeColor(), 
            color: 'white', 
            fontWeight: 600 
          }} 
        />
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Thời gian tham gia BHXH
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {formatTime(result.totalMonths)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Mức bình quân tiền lương tháng
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {formatCurrency(result.averageSalary)} VND
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#009a3e', fontWeight: 600, mb: 2 }}>
          Đối tượng tham gia
        </Typography>

        <Paper elevation={2} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Số tiền bảo hiểm xã hội một lần bạn có thể nhận được
            </Typography>
            
            <Box 
              sx={{ 
                backgroundColor: '#f8f9fa', 
                border: '2px solid #009a3e', 
                borderRadius: 2, 
                p: 3,
                mb: 2
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#009a3e',
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                VD: {formatCurrency(result.totalAmount)}
                <Typography 
                  component="span" 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 400,
                    ml: 1
                  }}
                >
                  (VND)
                </Typography>
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              * Số tiền này chỉ mang tính chất tham khảo, số tiền thực tế có thể chênh lệch do 
              thay đổi chính sách và quy định của Nhà nước
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Detailed Breakdown */}
      <Paper elevation={2} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ color: '#009a3e', fontWeight: 600, mb: 2 }}>
          Chi tiết tính toán
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        {result.periods.map((period, index) => (
          <Box key={period.id} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
              Giai đoạn {index + 1}: {period.startYear} - {period.endYear || period.startYear}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Thời gian: {formatTime(period.months)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mức lương: {formatCurrency(period.salary)} VND
              </Typography>
            </Box>
            {index < result.periods.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default BHXHResultDisplay;