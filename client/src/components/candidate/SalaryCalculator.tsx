import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  FormLabel,
  Divider,
  Link,
  Modal,
} from '@mui/material';
import { Person } from '@mui/icons-material';

// Mức lương tối thiểu vùng 2025
const MINIMUM_WAGES = {
  I: 4960000,    // Vùng I
  II: 4410000,   // Vùng II  
  III: 3860000,  // Vùng III
  IV: 3450000    // Vùng IV
};

// Thông tin chi tiết về các vùng
const REGION_DETAILS = {
  I: {
    name: "Vùng I",
    wage: "4,960,000 đồng/tháng",
    areas: [
      "Các quận và các huyện Gia Lâm, Đông Anh, Sóc Sơn, Thanh Trì, Thường Tín, Hoài Đức, Thạch Thất, Quốc Oai, Thanh Oai, Mê Linh, Chương Mỹ và thị xã Sơn Tây thuộc thành phố Hà Nội",
      "Các thành phố Hạ Long, Uông Bí, Móng Cái và các thị xã Quảng Yên, Đông Triều thuộc tỉnh Quảng Ninh",
      "Các quận và các huyện Thủy Nguyên, An Dương, An Lão, Vĩnh Bảo, Tiên Lãng, Cát Hải, Kiến Thụy thuộc thành phố Hải Phòng",
      "Thành phố Hải Dương thuộc tỉnh Hải Dương",
      "Các quận, thành phố Thủ Đức và các huyện Củ Chi, Hóc Môn, Bình Chánh, Nhà Bè thuộc Thành phố Hồ Chí Minh",
      "Các thành phố Biên Hòa, Long Khánh và các huyện Nhơn Trạch, Long Thành, Vĩnh Cửu, Trảng Bom, Xuân Lộc, Thống Nhất thuộc tỉnh Đồng Nai",
      "Các thành phố Thủ Dầu Một, Thuận An, Dĩ An, Tân Uyên, Bến Cát và các huyện Bàu Bàng, Bắc Tân Uyên, Dầu Tiếng, Phú Giáo thuộc tỉnh Bình Dương",
      "Thành phố Vũng Tàu, thị xã Phú Mỹ thuộc tỉnh Bà Rịa - Vũng Tàu",
      "Thành phố Tân An và các huyện Đức Hòa, Bến Lức, Cần Giuộc thuộc tỉnh Long An"
    ]
  },
  II: {
    name: "Vùng II", 
    wage: "4,410,000 đồng/tháng",
    areas: [
      "Các huyện còn lại thuộc thành phố Hà Nội",
      "Thành phố Lào Cai thuộc tỉnh Lào Cai",
      "Các thành phố Thái Nguyên, Sông Công và Phổ Yên thuộc tỉnh Thái Nguyên",
      "Thành phố Hoà Bình và huyện Lương Sơn thuộc tỉnh Hòa Bình",
      "Thành phố Việt Trì thuộc tỉnh Phú Thọ",
      "Thành phố Bắc Giang, thị xã Việt Yên và huyện Yên Dũng thuộc tỉnh Bắc Giang",
      "Các thành phố Vĩnh Yên, Phúc Yên và các huyện Bình Xuyên, Yên Lạc thuộc tỉnh Vĩnh Phúc",
      "Các thành phố Bắc Ninh, Từ Sơn; các thị xã Thuận Thành, Quế Võ và các huyện Tiên Du, Yên Phong, Gia Bình, Lương Tài thuộc tỉnh Bắc Ninh",
      "Thành phố Hưng Yên, thị xã Mỹ Hào và các huyện Văn Lâm, Văn Giang, Yên Mỹ thuộc tỉnh Hưng Yên",
      "... và nhiều khu vực khác"
    ]
  },
  III: {
    name: "Vùng III",
    wage: "3,860,000 đồng/tháng", 
    areas: [
      "Các thành phố trực thuộc tỉnh còn lại (trừ các thành phố trực thuộc tỉnh nêu tại vùng I, vùng II)",
      "Thị xã Sa Pa, huyện Bảo Thắng thuộc tỉnh Lào Cai",
      "Các huyện Phú Bình, Phú Lương, Đồng Hỷ, Đại Từ thuộc tỉnh Thái Nguyên",
      "Các huyện Hiệp Hòa, Tân Yên, Lạng Giang thuộc tỉnh Bắc Giang",
      "Các huyện Ninh Giang, Thanh Miện, Thanh Hà thuộc tỉnh Hải Dương",
      "Thị xã Phú Thọ và các huyện Phù Ninh, Lâm Thao, Thanh Ba, Tam Nông thuộc tỉnh Phú Thọ",
      "... và nhiều khu vực khác"
    ]
  },
  IV: {
    name: "Vùng IV",
    wage: "3,450,000 đồng/tháng",
    areas: [
      "Các địa bàn còn lại không thuộc Vùng I, II, III"
    ]
  }
};

// Mức giảm trừ gia cảnh 2025
const BASE_DEDUCTION = 11000000; // 11 triệu/tháng
const DEPENDENT_DEDUCTION = 4400000; // 4.4 triệu/người phụ thuộc

// Thuế suất thuế TNCN
const TAX_BRACKETS = [
  { from: 0, to: 5000000, rate: 0.05 },
  { from: 5000000, to: 10000000, rate: 0.10 },
  { from: 10000000, to: 18000000, rate: 0.15 },
  { from: 18000000, to: 32000000, rate: 0.20 },
  { from: 32000000, to: 52000000, rate: 0.25 },
  { from: 52000000, to: 80000000, rate: 0.30 },
  { from: 80000000, to: Infinity, rate: 0.35 }
];

interface SalaryCalculatorProps {
  calculationType: 'gross-to-net' | 'net-to-gross';
  onCalculate: (result: SalaryCalculationResult) => void;
}

interface SalaryCalculationResult {
  grossSalary: number;
  netSalary: number;
  bhxh: number;
  bhyt: number;
  bhtn: number;
  totalInsurance: number;
  taxableIncome: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeduction: number;
  taxBase: number;
  personalIncomeTax: number;
  region: string;
  dependents: number;
  insuranceBase: number;
  insuranceType: 'official' | 'custom';
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ calculationType, onCalculate }) => {
  const [salary, setSalary] = useState<number>(15000000);
  const [dependents, setDependents] = useState<number>(0);
  const [region, setRegion] = useState<string>('I');
  const [insuranceType, setInsuranceType] = useState<'official' | 'custom'>('official');
  const [customInsuranceBase, setCustomInsuranceBase] = useState<number>(5000000);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const calculateTax = (taxableAmount: number): number => {
    let tax = 0;
    let remaining = taxableAmount;

    for (const bracket of TAX_BRACKETS) {
      if (remaining <= 0) break;
      
      const taxableInBracket = Math.min(remaining, bracket.to - bracket.from);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }

    return tax;
  };

  const calculateGrossToNet = useCallback((grossSalary: number): SalaryCalculationResult => {
    // Tính bảo hiểm
    const insuranceBase = insuranceType === 'official' ? grossSalary : customInsuranceBase;
    const bhxh = insuranceBase * 0.08;
    const bhyt = insuranceBase * 0.015;
    const bhtn = insuranceBase * 0.01;
    const totalInsurance = bhxh + bhyt + bhtn;

    // Tính thu nhập chịu thuế
    const taxableIncome = grossSalary - totalInsurance;
    
    // Tính giảm trừ
    const personalDeduction = BASE_DEDUCTION;
    const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
    const totalDeduction = personalDeduction + dependentDeduction;
    
    // Tính thuế TNCN
    const taxBase = Math.max(0, taxableIncome - totalDeduction);
    const personalIncomeTax = calculateTax(taxBase);
    
    // Lương Net
    const netSalary = grossSalary - totalInsurance - personalIncomeTax;

    return {
      grossSalary,
      netSalary,
      bhxh,
      bhyt,
      bhtn,
      totalInsurance,
      taxableIncome,
      personalDeduction,
      dependentDeduction,
      totalDeduction,
      taxBase,
      personalIncomeTax,
      region,
      dependents,
      insuranceBase,
      insuranceType
    };
  }, [insuranceType, customInsuranceBase, dependents, region]);

  const calculateNetToGross = useCallback((netSalary: number): SalaryCalculationResult => {
    // Tính ngược từ Net lên Gross (iterative approach)
    let grossEstimate = netSalary * 1.2; // Ước tính ban đầu
    let iterations = 0;
    const maxIterations = 100;
    
    while (iterations < maxIterations) {
      const result = calculateGrossToNet(grossEstimate);
      const netDifference = result.netSalary - netSalary;
      
      if (Math.abs(netDifference) < 1000) { // Độ chính xác 1000 VND
        return { ...result, grossSalary: grossEstimate };
      }
      
      // Điều chỉnh ước tính
      grossEstimate = grossEstimate - netDifference;
      iterations++;
    }
    
    // Fallback nếu không converge
    return calculateGrossToNet(grossEstimate);
  }, [calculateGrossToNet]);

  const handleCalculate = useCallback(() => {
    const result = calculationType === 'gross-to-net' 
      ? calculateGrossToNet(salary)
      : calculateNetToGross(salary);
    
    onCalculate(result);
  }, [salary, calculationType, onCalculate, calculateGrossToNet, calculateNetToGross]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const inputLabel = calculationType === 'gross-to-net' ? 'Thu Nhập:' : 'Lương thực nhận:';
  const inputPlaceholder = calculationType === 'gross-to-net' ? 'Nhập lương Gross' : 'Nhập lương Net';

  return (
    <Paper elevation={3} sx={{ 
      p: 3, 
      borderRadius: 2,
      backgroundColor: 'theme.palette.background.paper',
      border: `1px solid #e0e0e0`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative corner */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 60,
        height: 60,
        background: 'linear-gradient(135deg, #DE221A, #1976D2)',
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        opacity: 0.1
      }} />
      
      <Typography variant="h6" sx={{ 
        mb: 3, 
        color: '#DE221A', 
        fontWeight: 600,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: 40,
          height: 3,
          backgroundColor: '#DE221A',
          borderRadius: 2
        }
      }}>
        {calculationType === 'gross-to-net' ? 'Tính lương Net từ Gross' : 'Tính lương Gross từ Net'}
      </Typography>

      {/* Salary Input */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {inputLabel}
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value) || 0)}
          placeholder={inputPlaceholder}
          InputProps={{
            endAdornment: <InputAdornment position="end">VND</InputAdornment>
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Dependents */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Số người phụ thuộc:
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={dependents}
          onChange={(e) => setDependents(Number(e.target.value) || 0)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: <InputAdornment position="end">(Người)</InputAdornment>
          }}
          inputProps={{ min: 0, max: 20 }}
        />
      </Box>

      {/* Region */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Vùng lương tối thiểu{' '}
          <Link 
            component="button"
            variant="body2"
            onClick={() => setModalOpen(true)}
            sx={{ 
              color: '#1976D2', 
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem',
              '&:hover': {
                color: '#0D47A1'
              }
            }}
          >
            (giải thích)
          </Link>
        </Typography>
        <RadioGroup
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          sx={{ gap: 1 }}
        >
          <FormControlLabel 
            value="I" 
            control={<Radio sx={{ color: '#1976D2', '&.Mui-checked': { color: '#DE221A' } }} />}
            label={`Vùng I - ${(MINIMUM_WAGES.I).toLocaleString('vi-VN')}đ/tháng`}
          />
          <FormControlLabel 
            value="II" 
            control={<Radio sx={{ color: '#1976D2', '&.Mui-checked': { color: '#DE221A' } }} />}
            label={`Vùng II - ${(MINIMUM_WAGES.II).toLocaleString('vi-VN')}đ/tháng`}
          />
          <FormControlLabel 
            value="III" 
            control={<Radio sx={{ color: '#1976D2', '&.Mui-checked': { color: '#DE221A' } }} />}
            label={`Vùng III - ${(MINIMUM_WAGES.III).toLocaleString('vi-VN')}đ/tháng`}
          />
          <FormControlLabel 
            value="IV" 
            control={<Radio sx={{ color: '#1976D2', '&.Mui-checked': { color: '#DE221A' } }} />}
            label={`Vùng IV - ${(MINIMUM_WAGES.IV).toLocaleString('vi-VN')}đ/tháng`}
          />
        </RadioGroup>
      </Box>

      {/* Insurance Base */}
      <Box sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Mức lương đóng bảo hiểm:
        </FormLabel>
        <RadioGroup
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value as 'official' | 'custom')}
        >
          <FormControlLabel 
            value="official" 
            control={<Radio sx={{ color: '#1976D2', '&.Mui-checked': { color: '#DE221A' } }} />}
            label="Trên lương chính thức" 
          />
          <FormControlLabel 
            value="custom" 
            control={<Radio sx={{ color: '#1976D2', '&.Mui-checked': { color: '#DE221A' } }} />}
            label="Khác:" 
          />
        </RadioGroup>
        
        {insuranceType === 'custom' && (
          <TextField
            fullWidth
            type="number"
            value={customInsuranceBase}
            onChange={(e) => setCustomInsuranceBase(Number(e.target.value) || 0)}
            placeholder="Nhập mức lương đóng bảo hiểm"
            InputProps={{
              endAdornment: <InputAdornment position="end">VND</InputAdornment>
            }}
            sx={{ mt: 1, ml: 4 }}
          />
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Calculate Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handleCalculate}
          sx={{
            background: 'linear-gradient(45deg, #DE221A, #FF5A52)',
            color: 'white',
            px: 6,
            py: 1.5,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 15px rgba(222, 34, 26, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #B01B14, #DE221A)',
              boxShadow: '0 6px 20px rgba(222, 34, 26, 0.4)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {calculationType === 'gross-to-net' ? 'GROSS → NET' : 'NET → GROSS'}
        </Button>
      </Box>

      {/* Modal giải thích vùng */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="region-explanation-modal"
        aria-describedby="region-explanation-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%' },
          maxWidth: 800,
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: 'auto'
        }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary" fontWeight="bold">
            Mức lương tối thiểu vùng năm 2025
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic' }}>
            Áp dụng mức lương tối thiểu vùng mới nhất có hiệu lực từ ngày 01/07/2024
          </Typography>

          {Object.entries(REGION_DETAILS).map(([key, region]) => (
            <Box key={key} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                {region.name}: {region.wage}
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                Bao gồm các địa bàn:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {region.areas.map((area, index) => (
                  <Typography 
                    component="li" 
                    key={index} 
                    variant="body2" 
                    sx={{ mb: 0.5, lineHeight: 1.4 }}
                  >
                    {area}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => setModalOpen(false)}
              sx={{
                background: 'linear-gradient(45deg, #DE221A, #FF5A52)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #B01B14, #DE221A)',
                }
              }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default SalaryCalculator;
export type { SalaryCalculationResult };