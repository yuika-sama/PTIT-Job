import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  InputAdornment,
  Chip,
  useTheme
} from '@mui/material';
import { Calculate as CalculatorIcon } from '@mui/icons-material';

interface TaxCalculatorProps {
  onCalculate?: (result: TaxCalculationResult) => void;
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

interface TaxBracket {
  level: number;
  from: number;
  to: number;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

// Các mức thuế suất theo bậc (2025) - Constants
const TAX_BRACKETS = [
  { level: 1, from: 0, to: 5000000, rate: 5 },
  { level: 2, from: 5000000, to: 10000000, rate: 10 },
  { level: 3, from: 10000000, to: 18000000, rate: 15 },
  { level: 4, from: 18000000, to: 32000000, rate: 20 },
  { level: 5, from: 32000000, to: 52000000, rate: 25 },
  { level: 6, from: 52000000, to: 80000000, rate: 30 },
  { level: 7, from: 80000000, to: Infinity, rate: 35 }
];

// Giảm trừ gia cảnh 2025 - Constants
const PERSONAL_DEDUCTION = 11000000; // 11 triệu/tháng
const DEPENDENT_DEDUCTION = 4400000; // 4.4 triệu/người phụ thuộc

// Helper function cho tính bảo hiểm
const calculateInsuranceAmount = (salary: number, insuranceType: 'official' | 'other', customInsurance: number) => {
  if (insuranceType === 'other') {
    return customInsurance;
  }
  
  // Tính bảo hiểm theo lương chính thức (8% BHXH + 1.5% BHYT + 1% BHTN = 10.5%)
  const maxInsuranceBase = 46800000; // Mức lương tối đa đóng bảo hiểm
  const insuranceBase = Math.min(salary, maxInsuranceBase);
  return insuranceBase * 0.105; // 10.5%
};

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onCalculate }) => {
  const theme = useTheme();
  const [grossSalary, setGrossSalary] = useState<number>(10000000);
  const [dependents, setDependents] = useState<number>(0);
  const [insuranceType, setInsuranceType] = useState<'official' | 'other'>('official');
  const [customInsurance, setCustomInsurance] = useState<number>(0);

  const result = React.useMemo((): TaxCalculationResult => {
    const insurance = calculateInsuranceAmount(grossSalary, insuranceType, customInsurance);
    const totalDeduction = PERSONAL_DEDUCTION + (dependents * DEPENDENT_DEDUCTION);
    const taxableIncome = Math.max(0, grossSalary - insurance - totalDeduction);
    
    let totalTax = 0;
    const breakdown: TaxBracket[] = [];
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const bracketWidth = bracket.to - bracket.from;
      const taxableInBracket = Math.min(remainingIncome, bracketWidth);
      const taxInBracket = taxableInBracket * (bracket.rate / 100);
      
      if (taxableInBracket > 0) {
        breakdown.push({
          level: bracket.level,
          from: bracket.from,
          to: bracket.to === Infinity ? taxableIncome : bracket.to,
          rate: bracket.rate,
          taxableAmount: taxableInBracket,
          taxAmount: taxInBracket
        });
        
        totalTax += taxInBracket;
        remainingIncome -= taxableInBracket;
      }
    }

    return {
      grossSalary,
      personalDeduction: PERSONAL_DEDUCTION,
      dependentDeduction: dependents * DEPENDENT_DEDUCTION,
      totalDeduction,
      taxableIncome,
      personalIncomeTax: totalTax,
      netSalary: grossSalary - insurance - totalTax,
      breakdown
    };
  }, [grossSalary, dependents, insuranceType, customInsurance]);

  useEffect(() => {
    if (onCalculate) {
      onCalculate(result);
    }
  }, [result, onCalculate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <Paper elevation={0} sx={{ 
      p: 4, 
      borderRadius: 3,
      border: `2px solid ${theme.palette.primary.main}20`,
      background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CalculatorIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Công cụ tính Thuế thu nhập cá nhân chuẩn 2025
        </Typography>
      </Box>

      {/* Quy định áp dụng */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.success.main + '08', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="success.main" fontWeight={600} sx={{ mb: 1 }}>
          ✓ Áp dụng quy định:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip size="small" label="Mới nhất" color="success" />
            Từ 01/07/2025 (Mới nhất)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Áp dụng mức lương cơ sở mới nhất có hiệu lực từ ngày 01/07/2024 (Theo Nghị định số 73/2024/NĐ-CP)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Áp dụng mức lương tối thiểu vùng mới nhất có hiệu lực từ ngày 01/07/2025 (Theo Nghị định 128/2025/NĐ-CP)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Áp dụng mức giảm trừ gia cảnh mới nhất 11 triệu đồng/tháng (132 triệu đồng/năm) với người nộp thuế và 4.4 triệu đồng/tháng với người phụ thuộc (Theo Nghị Quyết số 954/2020/UBTVQH14)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Left Column - Input */}
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Thu Nhập (Gross)
          </Typography>
          
          <TextField
            fullWidth
            label="Thu nhập"
            value={grossSalary}
            onChange={(e) => setGrossSalary(Number(e.target.value) || 0)}
            InputProps={{
              endAdornment: <InputAdornment position="end">VND</InputAdornment>,
            }}
            sx={{ mb: 3 }}
            type="number"
          />

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Mức lương đóng bảo hiểm
          </Typography>
          
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value as 'official' | 'other')}
            >
              <FormControlLabel 
                value="official" 
                control={<Radio />} 
                label="Trên lương chính thức" 
              />
              <FormControlLabel 
                value="other" 
                control={<Radio />} 
                label="Khác" 
              />
            </RadioGroup>
          </FormControl>

          {insuranceType === 'other' && (
            <TextField
              fullWidth
              label="Mức bảo hiểm tùy chỉnh"
              value={customInsurance}
              onChange={(e) => setCustomInsurance(Number(e.target.value) || 0)}
              InputProps={{
                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
              }}
              sx={{ mb: 3 }}
              type="number"
            />
          )}

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Số người phụ thuộc
          </Typography>
          
          <TextField
            fullWidth
            label="Số người"
            value={dependents}
            onChange={(e) => setDependents(Number(e.target.value) || 0)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Người</InputAdornment>,
            }}
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>

        {/* Right Column - Results */}
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Kết quả tính toán
          </Typography>
          
          {/* Summary Boxes */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.error.main}20, ${theme.palette.error.main}10)`,
              border: `1px solid ${theme.palette.error.main}30`
            }}>
              <Typography variant="caption" color="text.secondary">
                Giảm trừ gia cảnh bản thân
              </Typography>
              <Typography variant="h6" fontWeight={700} color="error.main">
                {formatCurrency(result.personalDeduction)}đ
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.success.main}20, ${theme.palette.success.main}10)`,
              border: `1px solid ${theme.palette.success.main}30`
            }}>
              <Typography variant="caption" color="text.secondary">
                Người phụ thuộc
              </Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {formatCurrency(result.dependentDeduction)}đ
              </Typography>
            </Paper>
          </Box>

          {/* Detailed Breakdown */}
          <Paper sx={{ p: 2, backgroundColor: theme.palette.background.default }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Chi tiết tính toán:
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Thu nhập gốc:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(result.grossSalary)}đ
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Bảo hiểm:</Typography>
              <Typography variant="body2" color="error.main">
                -{formatCurrency(calculateInsuranceAmount(grossSalary, insuranceType, customInsurance))}đ
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Giảm trừ gia cảnh:</Typography>
              <Typography variant="body2" color="error.main">
                -{formatCurrency(result.totalDeduction)}đ
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>Thu nhập chịu thuế:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(result.taxableIncome)}đ
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="error.main">Thuế TNCN:</Typography>
              <Typography variant="body2" fontWeight={600} color="error.main">
                -{formatCurrency(result.personalIncomeTax)}đ
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight={700}>Thu nhập ròng:</Typography>
              <Typography variant="subtitle1" fontWeight={700} color="success.main">
                {formatCurrency(result.netSalary)}đ
              </Typography>
            </Box>
          </Paper>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              fontWeight: 600
            }}
            onClick={() => {
              const newResult = result; // Sử dụng result đã tính
              if (onCalculate) onCalculate(newResult);
            }}
          >
            Tính thuế TNCN
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaxCalculator;