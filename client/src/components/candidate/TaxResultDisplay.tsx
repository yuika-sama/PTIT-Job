import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  LinearProgress
} from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

interface TaxBracket {
  level: number;
  from: number;
  to: number;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

interface TaxCalculationResult {
  grossSalary: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
  netSalary: number;
  breakdown: TaxBracket[];
}

interface TaxResultDisplayProps {
  result: TaxCalculationResult;
}

const TaxResultDisplay: React.FC<TaxResultDisplayProps> = ({ result }) => {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatRange = (from: number, to: number) => {
    if (to === Infinity || to >= 1000000000) {
      return `Trên ${formatCurrency(from)}`;
    }
    return `${formatCurrency(from)} - ${formatCurrency(to)}`;
  };

  const getTaxRateColor = (rate: number) => {
    if (rate <= 5) return theme.palette.success.main;
    if (rate <= 15) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const calculateInsurance = (salary: number) => {
    const maxInsuranceBase = 46800000;
    const insuranceBase = Math.min(salary, maxInsuranceBase);
    return insuranceBase * 0.105;
  };

  const insurance = calculateInsurance(result.grossSalary);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AssessmentIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Kết quả chi tiết
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
          border: `2px solid ${theme.palette.primary.main}30`
        }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            THU NHẬP GỐC
          </Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
            {formatCurrency(result.grossSalary)}đ
          </Typography>
        </Paper>

        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.error.main}20, ${theme.palette.error.main}10)`,
          border: `2px solid ${theme.palette.error.main}30`
        }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            THUẾ TNCN
          </Typography>
          <Typography variant="h5" fontWeight={700} color="error.main" sx={{ mt: 1 }}>
            {formatCurrency(result.personalIncomeTax)}đ
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({((result.personalIncomeTax / result.grossSalary) * 100).toFixed(1)}% tổng thu nhập)
          </Typography>
        </Paper>

        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.success.main}20, ${theme.palette.success.main}10)`,
          border: `2px solid ${theme.palette.success.main}30`
        }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            THU NHẬP RÒNG
          </Typography>
          <Typography variant="h5" fontWeight={700} color="success.main" sx={{ mt: 1 }}>
            {formatCurrency(result.netSalary)}đ
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({((result.netSalary / result.grossSalary) * 100).toFixed(1)}% tổng thu nhập)
          </Typography>
        </Paper>
      </Box>

      {/* Detailed Breakdown */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Phân tích chi tiết
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Income breakdown */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Thu nhập gốc (Gross)</Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(result.grossSalary)}đ
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              sx={{ height: 8, borderRadius: 4, backgroundColor: theme.palette.grey[200] }}
            />
          </Box>

          {/* Insurance deduction */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Trừ: Bảo hiểm (10.5%)</Typography>
              <Typography variant="body2" fontWeight={600} color="error.main">
                -{formatCurrency(insurance)}đ
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(insurance / result.grossSalary) * 100} 
              color="error"
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          {/* Personal deduction */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Trừ: Giảm trừ bản thân</Typography>
              <Typography variant="body2" fontWeight={600} color="error.main">
                -{formatCurrency(result.personalDeduction)}đ
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(result.personalDeduction / result.grossSalary) * 100} 
              color="warning"
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          {/* Dependent deduction */}
          {result.dependentDeduction > 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">Trừ: Giảm trừ người phụ thuộc</Typography>
                <Typography variant="body2" fontWeight={600} color="error.main">
                  -{formatCurrency(result.dependentDeduction)}đ
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(result.dependentDeduction / result.grossSalary) * 100} 
                color="warning"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          {/* Taxable income */}
          <Box sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>Thu nhập chịu thuế</Typography>
              <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                {formatCurrency(result.taxableIncome)}đ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Tax Bracket Breakdown */}
      {result.breakdown.length > 0 && (
        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" fontWeight={600}>
              Bảng thuế suất lũy tiến từng phần
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chi tiết tính thuế theo từng bậc
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                  <TableCell><strong>Bậc</strong></TableCell>
                  <TableCell><strong>Mức thu nhập/tháng</strong></TableCell>
                  <TableCell align="center"><strong>Thuế suất</strong></TableCell>
                  <TableCell align="right"><strong>Thu nhập chịu thuế</strong></TableCell>
                  <TableCell align="right"><strong>Thuế phải nộp</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.breakdown.map((bracket) => (
                  <TableRow key={bracket.level} hover>
                    <TableCell>
                      <Chip 
                        label={bracket.level} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatRange(bracket.from, bracket.to)}đ
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${bracket.rate}%`}
                        size="small"
                        sx={{ 
                          backgroundColor: getTaxRateColor(bracket.rate) + '20',
                          color: getTaxRateColor(bracket.rate),
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(bracket.taxableAmount)}đ
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="error.main">
                        {formatCurrency(bracket.taxAmount)}đ
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: theme.palette.primary.main + '08' }}>
                  <TableCell colSpan={3}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Tổng cộng
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={700}>
                      {formatCurrency(result.taxableIncome)}đ
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={700} color="error.main">
                      {formatCurrency(result.personalIncomeTax)}đ
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default TaxResultDisplay;