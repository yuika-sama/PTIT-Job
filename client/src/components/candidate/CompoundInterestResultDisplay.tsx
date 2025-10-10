import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import { TrendingUp, AccountBalance, MonetizationOn, Savings } from '@mui/icons-material';
import type { CompoundInterestResult } from './CompoundInterestCalculator';

interface CompoundInterestResultDisplayProps {
  result: CompoundInterestResult;
}

// Helper function để format tiền tệ
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// Component cho chart visualization
const CompoundInterestChart: React.FC<{ result: CompoundInterestResult }> = ({ result }) => {
  const theme = useTheme();
  const maxValue = result.finalAmount;
  
  return (
    <Box sx={{ position: 'relative', height: 400, p: 3 }}>
      <Typography variant="h6" textAlign="center" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 'bold' }}>
        LÃI KÉP {result.annualInterestRate}% TRONG {result.years} NĂM
      </Typography>
      
      {/* Biểu đồ tích lũy */}
      <Box sx={{ position: 'relative', height: 300 }}>
        {/* Trục Y - Labels */}
        <Box sx={{ position: 'absolute', left: -10, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {[8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 0].map(value => (
            <Typography key={value} variant="caption" color="text.secondary" sx={{ transform: 'translateY(50%)' }}>
              ${value}
            </Typography>
          ))}
        </Box>
        
        {/* Biểu đồ area */}
        <Box sx={{ ml: 4, height: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* Background grid */}
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${alpha(theme.palette.divider, 0.1)} 0px, ${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px, transparent 30px)` }} />
          
          {/* Tiền gốc */}
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${(result.totalContributions / maxValue) * 100}%`,
              background: alpha(theme.palette.grey[600], 0.8),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="white" fontWeight="bold">TIỀN GỐC</Typography>
          </Box>
          
          {/* Lãi đơn */}
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: `${(result.totalContributions / maxValue) * 100}%`,
              left: 0,
              right: 0,
              height: `${((result.totalInterest * 0.6) / maxValue) * 100}%`,
              background: alpha(theme.palette.primary.dark, 0.8),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="white" fontWeight="bold">LÃI ĐƠN</Typography>
          </Box>
          
          {/* Lãi kép */}
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: `${((result.totalContributions + result.totalInterest * 0.6) / maxValue) * 100}%`,
              left: 0,
              right: 0,
              height: `${((result.totalInterest * 0.4) / maxValue) * 100}%`,
              background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="white" fontWeight="bold">LÃI KÉP</Typography>
          </Box>
          
          {/* Lợi nhuận cao nhất label */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: 20,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              LỢI NHUẬN CAO NHẤT
            </Typography>
            <Box 
              sx={{ 
                width: 60,
                height: 30,
                borderRadius: '50%',
                border: `2px solid ${theme.palette.success.main}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: -15,
                  right: -10,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: `12px solid ${theme.palette.success.main}`
                }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* Trục X - Timeline */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', px: 4 }}>
          {Array.from({ length: 11 }, (_, i) => i * 2).map(year => (
            <Typography key={year} variant="caption" color="text.secondary">
              {year}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const CompoundInterestResultDisplay: React.FC<CompoundInterestResultDisplayProps> = ({ result }) => {
  const theme = useTheme();

  const summaryCards = [
    {
      icon: <AccountBalance />,
      label: 'Tiền gốc đầu tư',
      value: result.initialInvestment,
      color: theme.palette.grey[600],
      bgColor: alpha(theme.palette.grey[600], 0.1)
    },
    {
      icon: <Savings />,
      label: 'Tổng tiền gửi',
      value: result.totalContributions,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1)
    },
    {
      icon: <MonetizationOn />,
      label: 'Tổng lãi kiếm được',
      value: result.totalInterest,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1)
    },
    {
      icon: <TrendingUp />,
      label: 'Giá trị cuối kỳ',
      value: result.finalAmount,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1)
    }
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Card 
            key={index}
            elevation={0}
            sx={{ 
              border: `1px solid ${alpha(card.color, 0.2)}`,
              borderRadius: 3,
              background: card.bgColor,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(card.color, 0.15)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  {React.cloneElement(card.icon, { sx: { color: 'white', fontSize: 24 } })}
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  {card.label}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" color={card.color}>
                {formatCurrency(card.value)}đ
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Chart Visualization */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, mb: 4 }}>
        <CompoundInterestChart result={result} />
      </Paper>

      {/* Detailed Breakdown Table */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            📈 Phân tích chi tiết theo năm
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Bảng phân tích tăng trường giá trị đầu tư theo từng năm
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell><Typography fontWeight="bold">Năm</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Tiền gốc tích lũy</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Lãi kiếm được</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Tổng giá trị</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">Tăng trưởng</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.yearlyBreakdown.map((row, index) => {
                const growthRate = index > 0 
                  ? ((row.total - result.yearlyBreakdown[index - 1].total) / result.yearlyBreakdown[index - 1].total) * 100
                  : ((row.total - result.initialInvestment) / result.initialInvestment) * 100;
                
                return (
                  <TableRow 
                    key={row.year}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.grey[50], 0.5) },
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="medium">Năm {row.year}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary.main">
                        {formatCurrency(row.principal)}đ
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="success.main" fontWeight="medium">
                        +{formatCurrency(row.interest)}đ
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold" color="error.main">
                        {formatCurrency(row.total)}đ
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Chip 
                          label={`+${growthRate.toFixed(1)}%`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Performance Summary */}
      <Paper 
        elevation={0} 
        sx={{ 
          mt: 4,
          p: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
          🎯 Sức mạnh của lãi suất kép
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Bạn đang có trong tay <strong>{formatCurrency(result.initialInvestment)}đ</strong> ban đầu. 
          Bạn muốn đầu tư với lãi suất <strong>{result.annualInterestRate}%/năm</strong>.
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tiến độ tích lũy so với mục tiêu:
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(result.finalAmount / (result.finalAmount * 1.2)) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: alpha(theme.palette.grey[300], 0.3),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`
              }
            }} 
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Đạt được {formatCurrency(result.finalAmount)}đ sau {result.years} năm đầu tư
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Lời khuyên:</strong> Sức mạnh của lãi suất kép sẽ giúp tăng trưởng đáng kể khi bạn nhìn vào biểu đồ tăng trưởng dài hạn. 
          Việc đầu tư sớm và kiên trì sẽ mang lại hiệu quả tối ưu nhất.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CompoundInterestResultDisplay;