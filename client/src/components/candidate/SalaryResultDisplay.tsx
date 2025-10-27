import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { SalaryCalculationResult } from './SalaryCalculator';

interface SalaryResultDisplayProps {
  result: SalaryCalculationResult;
  calculationType: 'gross-to-net' | 'net-to-gross';
}

const SalaryResultDisplay: React.FC<SalaryResultDisplayProps> = ({ 
  result,
  calculationType 
}) => {
  const theme = useTheme();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRegionName = (region: string): string => {
    const regions = {
      '1': 'Vùng 1 (Hà Nội, TP.HCM)',
      '2': 'Vùng 2 (Cần Thơ, Đà Nẵng, Hải Phòng)',
      '3': 'Vùng 3 (Thành phố trực thuộc tỉnh)',
      '4': 'Vùng 4 (Các khu vực khác)'
    };
    return regions[region as keyof typeof regions] || 'Không xác định';
  };

  const getInsuranceTypeName = (type: string): string => {
    return type === 'official' ? 'Theo lương chính thức' : 'Theo mức tự chọn';
  };

  const resultBoxStyle = {
    backgroundcolor: 'theme.palette.background.paper',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 2,
    p: 3,
    textAlign: 'center',
    mb: 3,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      backgroundcolor: theme.palette.primary.main,
    }
  };

  const detailRowData = [
    {
      label: 'Bảo hiểm xã hội (8%)',
      value: result.bhxh,
      color: '#f44336'
    },
    {
      label: 'Bảo hiểm y tế (1.5%)',
      value: result.bhyt,
      color: '#f44336'
    },
    {
      label: 'Bảo hiểm thất nghiệp (1%)',
      value: result.bhtn,
      color: '#f44336'
    },
    {
      label: 'Tổng bảo hiểm',
      value: result.totalInsurance,
      color: '#f44336',
      isTotal: true
    },
    {
      label: 'Thu nhập chịu thuế',
      value: result.taxableIncome,
      color: '#2196f3'
    },
    {
      label: 'Giảm trừ bản thân',
      value: result.personalDeduction,
      color: '#4caf50'
    },
    {
      label: `Giảm trừ người phụ thuộc (${result.dependents} người)`,
      value: result.dependentDeduction,
      color: '#4caf50'
    },
    {
      label: 'Tổng giảm trừ',
      value: result.totalDeduction,
      color: '#4caf50',
      isTotal: true
    },
    {
      label: 'Thu nhập tính thuế',
      value: result.taxBase,
      color: '#2196f3'
    },
    {
      label: 'Thuế thu nhập cá nhân',
      value: result.personalIncomeTax,
      color: '#f44336'
    },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      {/* Kết quả chính */}
      <Paper sx={resultBoxStyle}>
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Kết quả tính toán
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            p: 2, 
            background: calculationType === 'gross-to-net' 
              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              : `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
            borderRadius: 2,
            color: calculationType === 'gross-to-net' ? 'white' : 'inherit',
            boxShadow: calculationType === 'gross-to-net' ? '0 4px 15px rgba(222, 34, 26, 0.3)' : 1,
            border: calculationType !== 'gross-to-net' ? `2px solid ${theme.palette.primary.main}30` : 'none'
          }}>
            <Typography variant="h6" gutterBottom>
              Lương Gross
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {formatCurrency(result.grossSalary)}
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            background: calculationType === 'net-to-gross' 
              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              : `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
            borderRadius: 2,
            color: calculationType === 'net-to-gross' ? 'white' : 'inherit',
            boxShadow: calculationType === 'net-to-gross' ? '0 4px 15px rgba(222, 34, 26, 0.3)' : 1,
            border: calculationType !== 'net-to-gross' ? `2px solid ${theme.palette.primary.main}30` : 'none'
          }}>
            <Typography variant="h6" gutterBottom>
              Lương Net
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {formatCurrency(result.netSalary)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Thông tin đầu vào */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        backgroundColor: 'theme.palette.background.paper',
        boxShadow: 2
      }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Thông tin đầu vào
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Vùng lương tối thiểu:</Typography>
            <Chip 
              label={getRegionName(result.region)} 
              size="small" 
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Số người phụ thuộc:</Typography>
            <Chip 
              label={`${result.dependents} người`} 
              size="small" 
              color="secondary"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Loại đóng bảo hiểm:</Typography>
            <Chip 
              label={getInsuranceTypeName(result.insuranceType)} 
              size="small" 
              color="info"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Mức đóng bảo hiểm:</Typography>
            <Chip 
              label={formatCurrency(result.insuranceBase)} 
              size="small" 
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>

      {/* Bảng chi tiết */}
      <Paper sx={{ 
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 2
      }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Chi tiết tính toán
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  Khoản mục
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  Số tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailRowData.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    ...(row.isTotal && { 
                      backgroundColor: theme.palette.grey[50],
                      fontWeight: 'bold'
                    })
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: row.isTotal ? 'bold' : 'normal',
                    color: row.isTotal ? theme.palette.primary.main : 'inherit'
                  }}>
                    {row.label}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: row.isTotal ? 'bold' : 'normal',
                      color: row.color
                    }}
                  >
                    {formatCurrency(row.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Ghi chú */}
      <Paper sx={{ 
        p: 3, 
        mt: 3, 
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }} />
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ pt: 1 }}>
          Ghi chú
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Tính toán dựa trên quy định thuế thu nhập cá nhân và bảo hiểm xã hội năm 2025
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Giảm trừ bản thân: {formatCurrency(result.personalDeduction)}/tháng
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Giảm trừ người phụ thuộc: {formatCurrency(4800000)}/người/tháng
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Mức đóng bảo hiểm: BHXH (8%) + BHYT (1.5%) + BHTN (1%)
        </Typography>
        
        <Typography variant="body2" color="theme.palette.error.main">
          • Kết quả chỉ mang tính chất tham khảo, không thay thế cho tư vấn chuyên môn
        </Typography>
      </Paper>
    </Box>
  );
};

export default SalaryResultDisplay;
