import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  backgroundcolor: "theme.palette.background.paper",
  border: '1px solid #e8e8e8',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: '16px 16px 0 0',
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #1B5E20, #2E7D32, #4CAF50)',
  }
}));

const ResultCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
  border: '2px solid #4CAF50',
  borderRadius: 12,
  marginTop: theme.spacing(2),
}));

interface FormData {
  applicableDate: 'old' | 'new';
  salaryChangeType: 'noChange' | 'hasChange';
  monthlySalary: number;
  totalMonths: number;
  employeeType: 'state' | 'private';
  region: 1 | 2 | 3 | 4;
}

interface CalculationResult {
  monthlyBenefit: number;
  maxMonthlyBenefit: number;
  benefitPeriod: number;
  totalBenefit: number;
}

const UnemploymentInsuranceCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    applicableDate: 'new',
    salaryChangeType: 'noChange',
    monthlySalary: 6000000,
    totalMonths: 12,
    employeeType: 'state',
    region: 1
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  // Lương cơ sở mới nhất từ 01/07/2024
  const baseSalary = 2340000;

  // Lương tối thiểu vùng từ 01/07/2024
  const minWageByRegion = React.useMemo(() => ({
    1: 4960000, // Vùng I
    2: 4410000, // Vùng II  
    3: 3860000, // Vùng III
    4: 3450000  // Vùng IV
  }), []);

  const calculateBenefit = React.useCallback(() => {
    setError('');
    
    try {
      // Validate input
      if (formData.monthlySalary <= 0) {
        setError('Tiền lương phải lớn hơn 0');
        return;
      }
      
      if (formData.totalMonths < 12) {
        setError('Thời gian đóng bảo hiểm phải ít nhất 12 tháng');
        return;
      }

      // Tính mức hưởng theo công thức: 60% lương bình quân
      const calculatedBenefit = formData.monthlySalary * 0.6;

      // Tính mức hưởng tối đa
      let maxBenefit: number;
      if (formData.employeeType === 'state') {
        // Nhà nước: không quá 5 lần lương cơ sở
        maxBenefit = baseSalary * 5;
      } else {
        // Tư nhân: không quá 5 lần lương tối thiểu vùng
        maxBenefit = minWageByRegion[formData.region] * 5;
      }

      // Mức hưởng thực tế (lấy số nhỏ hơn)
      const actualBenefit = Math.min(calculatedBenefit, maxBenefit);

      // Tính thời gian hưởng
      let benefitMonths: number;
      if (formData.totalMonths >= 12 && formData.totalMonths <= 36) {
        benefitMonths = 3;
      } else {
        // Sau 36 tháng, mỗi 12 tháng thêm 1 tháng
        const extraMonths = Math.floor((formData.totalMonths - 36) / 12);
        benefitMonths = Math.min(3 + extraMonths, 12); // Tối đa 12 tháng
      }

      setResult({
        monthlyBenefit: actualBenefit,
        maxMonthlyBenefit: maxBenefit,
        benefitPeriod: benefitMonths,
        totalBenefit: actualBenefit * benefitMonths
      });

    } catch (err) {
      setError('Có lỗi xảy ra khi tính toán');
    }
  }, [formData, baseSalary, minWageByRegion]);

  useEffect(() => {
    if (formData.monthlySalary > 0 && formData.totalMonths >= 12) {
      calculateBenefit();
    }
  }, [formData, calculateBenefit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <StyledPaper>
        <HeaderSection>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Công cụ tính mức hưởng bảo hiểm thất nghiệp chính xác nhất 2025
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Tính toán mức trợ cấp thất nghiệp theo quy định mới nhất
          </Typography>
        </HeaderSection>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Form Input */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#2E7D32' }}>
                  Áp dụng quy định:
                </FormLabel>
                <RadioGroup
                  value={formData.applicableDate}
                  onChange={(e) => setFormData({...formData, applicableDate: e.target.value as 'old' | 'new'})}
                >
                  <FormControlLabel 
                    value="old" 
                    control={<Radio />} 
                    label="Từ 01/07/2024 - 30/06/2025" 
                  />
                  <FormControlLabel 
                    value="new" 
                    control={<Radio />} 
                    label="Từ 01/07/2025 (Mới nhất)" 
                    sx={{ color: '#4CAF50', fontWeight: 600 }}
                  />
                </RadioGroup>
              </FormControl>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Áp dụng <strong>mức lương cơ sở</strong> mới nhất có hiệu lực từ ngày 01/07/2024 (Theo Nghị định số 73/2024/NĐ-CP)
                  <br />
                  Áp dụng <strong>mức lương tối thiểu vùng</strong> mới nhất có hiệu lực từ ngày 01/07/2025 (Theo Nghị định 128/2025/NĐ-CP)
                </Typography>
              </Alert>

              <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#2E7D32' }}>
                  Lương đóng BH không thay đổi trong 6 tháng
                </FormLabel>
                <RadioGroup
                  value={formData.salaryChangeType}
                  onChange={(e) => setFormData({...formData, salaryChangeType: e.target.value as 'noChange' | 'hasChange'})}
                >
                  <FormControlLabel 
                    value="noChange" 
                    control={<Radio />} 
                    label="Lương đóng BH không thay đổi trong 6 tháng" 
                  />
                  <FormControlLabel 
                    value="hasChange" 
                    control={<Radio />} 
                    label="Lương đóng BH thay đổi trong 6 tháng" 
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label="Tiền lương đóng BHTN:"
                type="number"
                value={formData.monthlySalary}
                onChange={(e) => setFormData({...formData, monthlySalary: Number(e.target.value)})}
                InputProps={{
                  endAdornment: <Typography variant="body2" color="text.secondary">(VND)</Typography>
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                (Bình quân tiền lương tháng đóng BHTN của 06 tháng liền kề trước khi thất nghiệp)
              </Typography>

              <TextField
                fullWidth
                label="Tổng thời gian đóng BHTN chưa hưởng:"
                type="number"
                value={formData.totalMonths}
                onChange={(e) => setFormData({...formData, totalMonths: Number(e.target.value)})}
                InputProps={{
                  endAdornment: <Typography variant="body2" color="text.secondary">(Tháng)</Typography>
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                (Thời gian đóng bảo hiểm thất nghiệp – Thời gian đã hưởng trợ cấp thất nghiệp)
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ fontWeight: 600, mb: 1, color: '#2E7D32' }}>
                      Chế độ tiền lương
                    </FormLabel>
                    <RadioGroup
                      value={formData.employeeType}
                      onChange={(e) => setFormData({...formData, employeeType: e.target.value as 'state' | 'private'})}
                    >
                      <FormControlLabel 
                        value="state" 
                        control={<Radio />} 
                        label="Doanh nghiệp nhà nước" 
                      />
                      <FormControlLabel 
                        value="private" 
                        control={<Radio />} 
                        label="Doanh nghiệp tư nhân" 
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>Vùng (Địa thích):</InputLabel>
                    <Select
                      value={formData.region}
                      label="Vùng (Địa thích):"
                      onChange={(e) => setFormData({...formData, region: e.target.value as 1 | 2 | 3 | 4})}
                    >
                      <MenuItem value={1}>Vùng 1</MenuItem>
                      <MenuItem value={2}>Vùng 2</MenuItem>
                      <MenuItem value={3}>Vùng 3</MenuItem>
                      <MenuItem value={4}>Vùng 4</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={calculateBenefit}
                sx={{
                  mt: 3,
                  py: 2,
                  background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                  }
                }}
              >
                Tính bảo hiểm
              </Button>
            </Box>
          </Box>

          {/* Results */}
          <Box sx={{ flex: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {result && (
              <ResultCard>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2E7D32' }}>
                    🎯 Kết quả tính toán
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="black" gutterBottom>
                      Mức hưởng hàng tháng:
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#2E7D32">
                      {formatCurrency(result.monthlyBenefit)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="black" gutterBottom>
                      Thời gian hưởng:
                    </Typography>
                    <Chip 
                      label={`${result.benefitPeriod} tháng`}
                      color="success"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="black" gutterBottom>
                      Tổng số tiền được hưởng:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#1B5E20">
                      {formatCurrency(result.totalBenefit)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="body2" color="black" gutterBottom>
                      Mức hưởng tối đa:
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="#185E20">
                      {formatCurrency(result.maxMonthlyBenefit)}
                    </Typography>
                  </Box>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Mức hưởng bảo hiểm thất nghiệp được quy định tại Điều 50, Luật việc làm 2013 và được hướng dẫn chi tiết tại Nghị định 28/2015/NĐ-CP
                    </Typography>
                  </Alert>
                </CardContent>
              </ResultCard>
            )}

            {/* Additional Info */}
            <Card sx={{ mt: 3, backgroundcolor:'theme.palette' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#1976d2' }}>
                  📋 Thông tin quan trọng
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Mức lương cơ sở:</strong> {formatCurrency(baseSalary)} (từ 01/07/2024)
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Mức lương tối thiểu vùng {formData.region}:</strong> {formatCurrency(minWageByRegion[formData.region])}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Công thức tính:</strong> 60% × lương bình quân 6 tháng
                </Typography>
                
                <Typography variant="body2">
                  • <strong>Thời hạn nộp hồ sơ:</strong> Trong vòng 3 tháng kể từ ngày chấm dứt hợp đồng
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default UnemploymentInsuranceCalculator;