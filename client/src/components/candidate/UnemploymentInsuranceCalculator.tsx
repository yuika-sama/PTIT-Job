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
  InputAdornment,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  Stack,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.getContrastText(theme.palette.primary.main),
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
    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  }
}));

const ResultCard = styled(Card)(({ theme }) => ({
  // Use PTIT theme tokens for a consistent look
  background: theme.palette.background.paper,
  // subtle border using divider for neutral edge, keep accent via boxShadow
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  borderRadius: Number(theme.shape.borderRadius ?? 8) * 1.25,
  marginTop: theme.spacing(2),
  transition: 'transform 150ms ease, box-shadow 150ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],  
  }
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
  const theme = useTheme();
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
        maxBenefit = (minWageByRegion as any)[formData.region] * 5;
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
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <StyledPaper>
        {/* Header: dùng Box + flex thay Grid */}
        <HeaderSection>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ flex: '1 1 260px', minWidth: 0 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                Công cụ tính mức hưởng bảo hiểm thất nghiệp — PTIT
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                Tính nhanh, chính xác theo quy định mới nhất. Điền thông tin dưới đây để nhận kết quả.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Thông tin luật và cập nhật">
                  <IconButton
                    size="small"
                    aria-label="info"
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.getContrastText(theme.palette.primary.light),
                      '&:hover': { bgcolor: theme.palette.primary.main }
                    }}
                  >
                    <InfoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Box>
        </HeaderSection>

        {/* Main content: thay Grid container bằng Box flex */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4
          }}
        >
          {/* Left column (form) */}
          <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
            <Stack spacing={2}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                  Áp dụng quy định
                </FormLabel>
                <RadioGroup
                  value={formData.applicableDate}
                  onChange={(e) => setFormData({ ...formData, applicableDate: e.target.value as 'old' | 'new' })}
                >
                  <FormControlLabel value="old" control={<Radio />} label="Từ 01/07/2024 - 30/06/2025" />
                  <FormControlLabel value="new" control={<Radio />} label="Từ 01/07/2025 (Mới nhất)" />
                </RadioGroup>
              </FormControl>

              <Alert severity="info" sx={{ mb: 0 }}>
                Áp dụng <strong>mức lương cơ sở</strong> và <strong>mức lương tối thiểu vùng</strong> theo quy định cập nhật.
              </Alert>

              <FormControl component="fieldset" fullWidth>
                <FormLabel sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                  Lương đóng BH
                </FormLabel>
                <RadioGroup
                  value={formData.salaryChangeType}
                  onChange={(e) => setFormData({ ...formData, salaryChangeType: e.target.value as 'noChange' | 'hasChange' })}
                >
                  <FormControlLabel value="noChange" control={<Radio />} label="Không thay đổi trong 6 tháng" />
                  <FormControlLabel value="hasChange" control={<Radio />} label="Có thay đổi trong 6 tháng" />
                </RadioGroup>
              </FormControl>

                <TextField
                fullWidth
                label="Tiền lương đóng BHTN (VND)"
                type="number"
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  )
                }}
                inputProps={{
                  'aria-label': 'Tiền lương đóng BHTN'
                }}
                  helperText="Bình quân 6 tháng liền kề trước khi thất nghiệp"
              />

              <TextField
                fullWidth
                label="Tổng thời gian đóng BHTN chưa hưởng (tháng)"
                type="number"
                value={formData.totalMonths}
                onChange={(e) => setFormData({ ...formData, totalMonths: Number(e.target.value) })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  )
                }}
                inputProps={{
                  'aria-label': 'Tổng thời gian đóng BHTN'
                }}
                helperText="Thời gian đóng bảo hiểm chưa từng hưởng trợ cấp"
              />

              {/* 2 cột nhỏ: employeeType + region */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
                  <FormControl fullWidth>
                    <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Chế độ tiền lương</FormLabel>
                    <RadioGroup
                      value={formData.employeeType}
                      onChange={(e) => setFormData({ ...formData, employeeType: e.target.value as 'state' | 'private' })}
                    >
                      <FormControlLabel value="state" control={<Radio />} label="Doanh nghiệp nhà nước" />
                      <FormControlLabel value="private" control={<Radio />} label="Doanh nghiệp tư nhân" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Vùng</InputLabel>
                    <Select
                      value={formData.region}
                      label="Vùng"
                      onChange={(e) => setFormData({ ...formData, region: e.target.value as 1 | 2 | 3 | 4 })}
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
                color="primary"
                fullWidth
                size="large"
                onClick={calculateBenefit}
                sx={{ mt: 1, py: 1.6, fontWeight: 700 }}
              >
                Tính bảo hiểm
              </Button>
            </Stack>
          </Box>

          {/* Right column (results) */}
          <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {result && (
              <ResultCard>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    <Box sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                      borderRadius: 1.5,
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MonetizationOnIcon fontSize="small" />
                    </Box>

                    <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.dark }}>
                      Kết quả tính toán
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <Tooltip title="Công thức: 60% × lương bình quân; giới hạn theo mức tối đa">
                      <IconButton size="small" aria-label="explain" sx={{ color: theme.palette.text.secondary }}>
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  {/* Hero number + small labels */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Box sx={{
                      flex: '1 1 220px',
                      minWidth: 180,
                      background: theme.palette.background.paper,
                      borderRadius: 2,
                      p: 2,
                      boxShadow: theme.shadows[1]
                    }}>
                      <Typography variant="body2" color="text.secondary">Mức hưởng hàng tháng</Typography>
                      <Typography variant="h4" fontWeight={900} sx={{ color: theme.palette.primary.dark }}>
                        {formatCurrency(result.monthlyBenefit)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">(Sau khi áp dụng giới hạn tối đa)</Typography>
                    </Box>

                    <Box sx={{ flex: '1 1 200px', minWidth: 160 }}>
                      <Typography variant="body2" color="text.secondary">Mức hưởng tối đa</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {formatCurrency(result.maxMonthlyBenefit)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* breakdown rows */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1.25, alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">Thời gian hưởng</Typography>
                    <Chip label={`${result.benefitPeriod} tháng`} color="primary" sx={{ fontWeight: 700, borderRadius: 1 }} />

                    <Typography variant="body2" color="text.secondary">Tổng số tiền được hưởng</Typography>
                    <Typography variant="body1" fontWeight={800} sx={{ color: theme.palette.primary.dark }}>
                      {formatCurrency(result.totalBenefit)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">Căn cứ</Typography>
                    <Typography variant="body2" color="text.secondary">Điều 50, Luật việc làm 2013</Typography>
                  </Box>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    Mức hưởng bảo hiểm thất nghiệp được quy định tại Điều 50, Luật việc làm 2013 và hướng dẫn liên quan.
                  </Alert>
                </CardContent>
              </ResultCard>
            )}

            <Card sx={{ mt: 3, background: theme.palette.background.default }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: theme.palette.primary.main }}>
                  Thông tin quan trọng
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  • <strong>Mức lương cơ sở:</strong> {formatCurrency(baseSalary)} (từ 01/07/2024)
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  • <strong>Mức lương tối thiểu vùng {formData.region}:</strong> {formatCurrency((minWageByRegion as any)[formData.region])}
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
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
