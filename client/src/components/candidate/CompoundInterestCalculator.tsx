import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  alpha
} from '@mui/material';
import { Calculate as CalculatorIcon, TrendingUp } from '@mui/icons-material';

// Định nghĩa types cho kết quả tính toán
export interface CompoundInterestResult {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  compoundingFrequency: number;
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: {
    year: number;
    principal: number;
    interest: number;
    total: number;
  }[];
}

interface CompoundInterestCalculatorProps {
  onCalculate?: (result: CompoundInterestResult) => void;
}

// Helper function để format tiền tệ
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// Công thức tính lãi kép: Fn = P * (1 + i/m)^(n*m) + PMT * [((1 + i/m)^(n*m) - 1) / (i/m)]
const calculateCompoundInterest = (
  principal: number,
  monthlyPayment: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = 12
): CompoundInterestResult => {
  const monthlyRate = annualRate / 100 / 12;
  
  let yearlyBreakdown: { year: number; principal: number; interest: number; total: number }[] = [];
  let currentAmount = principal;
  let totalContributions = principal;
  
  for (let year = 1; year <= years; year++) {
    
    // Tính lãi cho 12 tháng
    for (let month = 1; month <= 12; month++) {
      // Lãi của tháng hiện tại
      const monthlyInterest = currentAmount * monthlyRate;
      currentAmount += monthlyInterest + monthlyPayment;
      totalContributions += monthlyPayment;
    }
    
    const yearEndPrincipal = totalContributions;
    const yearEndInterest = currentAmount - totalContributions;
    
    yearlyBreakdown.push({
      year,
      principal: yearEndPrincipal,
      interest: yearEndInterest,
      total: currentAmount
    });
  }
  
  const totalInterest = currentAmount - totalContributions;
  
  return {
    initialInvestment: principal,
    monthlyContribution: monthlyPayment,
    annualInterestRate: annualRate,
    years,
    compoundingFrequency,
    finalAmount: currentAmount,
    totalContributions,
    totalInterest,
    yearlyBreakdown
  };
};

const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({ onCalculate }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  
  // State cho các input
  const [initialInvestment, setInitialInvestment] = useState<number>(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000000);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [compoundingPeriod, setCompoundingPeriod] = useState<string>('Hàng năm');

  // Tính toán kết quả
  const result = React.useMemo((): CompoundInterestResult => {
    return calculateCompoundInterest(
      initialInvestment,
      monthlyContribution,
      interestRate,
      investmentPeriod,
      12 // Ghép lãi hàng tháng
    );
  }, [initialInvestment, monthlyContribution, interestRate, investmentPeriod]);

  useEffect(() => {
    if (onCalculate) {
      onCalculate(result);
    }
  }, [result, onCalculate]);

  const steps = [
    {
      label: 'Đầu tư ban đầu',
      description: 'Số tiền bạn có sẵn để đầu tư ban đầu.',
      content: (
        <TextField
          fullWidth
          label="Số tiền gốc ban đầu (VNĐ)"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)}
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">₫</InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
      )
    },
    {
      label: 'Khoản đóng góp',
      description: 'Số tiền bạn định thêm vào tiền gốc hàng tháng.',
      content: (
        <Box>
          <TextField
            fullWidth
            label="Số tiền gửi mỗi tháng (VNĐ)"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">₫</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Thời gian gửi (Năm)"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value) || 0)}
            type="number"
            helperText="Khoảng thời gian, tính bằng năm, mà bạn dự định tiết kiệm."
            sx={{ mb: 2 }}
          />
        </Box>
      )
    },
    {
      label: 'Lãi suất',
      description: 'Lãi suất ước tính theo kỳ hạn gửi của bạn.',
      content: (
        <TextField
          fullWidth
          label="Lãi suất (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          helperText="Lãi suất ước tính theo kỳ hạn gửi của bạn."
          sx={{ mb: 2 }}
        />
      )
    },
    {
      label: 'Kỳ hạn',
      description: 'Kỳ hạn nhận lãi tiền gửi của bạn.',
      content: (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Định kỳ gửi</InputLabel>
          <Select
            value={compoundingPeriod}
            onChange={(e) => setCompoundingPeriod(e.target.value)}
            label="Định kỳ gửi"
          >
            <MenuItem value="Hàng năm">Hàng năm</MenuItem>
            <MenuItem value="Hàng tháng">Hàng tháng</MenuItem>
            <MenuItem value="Hàng quý">Hàng quý</MenuItem>
          </Select>
        </FormControl>
      )
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}
        >
          <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
            Công cụ tính Lãi Kép, Giá trị tiền gửi, Lợi nhuận đầu tư Miễn Phí
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Công cụ ứng dụng lãi suất kép để tính toán tiền gửi, lợi nhuận đầu tư thu được trong tương lai qua trên kế hoạch tiết kiệm, đầu tư hàng tháng và lãi suất kỳ vọng hoàn toàn miễn phí trên TopCV.
          </Typography>
        </Box>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                <Typography variant="caption" color="text.secondary">
                  {step.description}
                </Typography>
              }
            >
              <Typography variant="h6" fontWeight="medium">
                Bước {index + 1}: {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                {step.content}
              </Box>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={index === steps.length - 1}
                  >
                    {index === steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Quay lại
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper 
          square 
          elevation={0} 
          sx={{ 
            p: 3, 
            background: alpha(theme.palette.success.main, 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}
        >
          <Typography variant="h6" gutterBottom color="success.main">
            Đã hoàn thành tất cả các bước!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Kết quả tính toán lãi kép sẽ được hiển thị bên dưới.
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Tính lại
          </Button>
        </Paper>
      )}

      {/* Kết quả tổng quan */}
      <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          📊 Tổng quan kết quả
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 2 }}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">Tổng tiền gửi</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatCurrency(result.totalContributions)}đ
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">Lãi kiếm được</Typography>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              +{formatCurrency(result.totalInterest)}đ
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">Tổng giá trị cuối kỳ</Typography>
            <Typography variant="h6" color="error.main" fontWeight="bold">
              {formatCurrency(result.finalAmount)}đ
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nút tính lãi */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<CalculatorIcon />}
          onClick={() => {
            // Trigger calculation update
            if (onCalculate) {
              onCalculate(result);
            }
          }}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            background: '#00C853',
            '&:hover': {
              background: '#00A640'
            }
          }}
        >
          Tính lãi
        </Button>
      </Box>
    </Paper>
  );
};

export default CompoundInterestCalculator;