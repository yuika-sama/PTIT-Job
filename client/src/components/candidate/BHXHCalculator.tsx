import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ThemeContext } from '@emotion/react';

// Hệ số trượt giá theo năm (từ 2024)
const INFLATION_RATES: { [key: number]: number } = {
  1994: 5.43, 1995: 4.61, 1996: 4.36, 1997: 4.22, 1998: 3.92, 1999: 3.75,
  2000: 3.82, 2001: 3.83, 2002: 3.68, 2003: 3.57, 2004: 3.31, 2005: 3.06,
  2006: 2.85, 2007: 2.63, 2008: 2.14, 2009: 2.00, 2010: 1.83, 2011: 1.54,
  2012: 1.41, 2013: 1.33, 2014: 1.27, 2015: 1.27, 2016: 1.23, 2017: 1.19,
  2018: 1.15, 2019: 1.12, 2020: 1.08, 2021: 1.07, 2022: 1.03, 2023: 1.00,
  2024: 1.00, 2025: 1.00
};

interface BHXHPeriod {
  id: string;
  startYear: number;
  endYear?: number;
  months: number;
  salary: number;
}

interface BHXHCalculatorProps {
  type: 'mandatory' | 'voluntary' | 'both';
  onCalculate: (result: BHXHResult) => void;
}

interface BHXHResult {
  totalAmount: number;
  averageSalary: number;
  totalMonths: number;
  periods: BHXHPeriod[];
}

const BHXHCalculator: React.FC<BHXHCalculatorProps> = ({ type, onCalculate }) => {
  const theme = useTheme();
  const [periods, setPeriods] = useState<BHXHPeriod[]>([
    { id: '1', startYear: 2024, months: 1, salary: 5000000 }
  ]);

  const addPeriod = () => {
    const newId = (periods.length + 1).toString();
    setPeriods([...periods, { 
      id: newId, 
      startYear: 2024, 
      months: 1, 
      salary: 5000000 
    }]);
  };

  const addPregnancyPeriod = () => {
    const newId = `pregnancy-${Date.now()}`;
    setPeriods([...periods, { 
      id: newId, 
      startYear: 2024, 
      months: 1, 
      salary: 0 
    }]);
  };

  const removePeriod = (id: string) => {
    setPeriods(periods.filter(period => period.id !== id));
  };

  const updatePeriod = (id: string, field: keyof BHXHPeriod, value: any) => {
    setPeriods(periods.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    ));
  };

  const calculateBHXH = () => {
    let totalSalaryWithInflation = 0;
    let totalMonths = 0;

    periods.forEach(period => {
      const inflationRate = INFLATION_RATES[period.startYear] || 1;
      const salaryWithInflation = period.salary * inflationRate * period.months;
      
      totalSalaryWithInflation += salaryWithInflation;
      totalMonths += period.months;
    });

    const averageSalary = totalMonths > 0 ? totalSalaryWithInflation / totalMonths : 0;
    
    // Tính theo công thức
    let totalAmount = 0;
    
    if (totalMonths < 12) {
      // Chưa đóng đủ 1 năm: 22% của tổng lương đã đóng, tối đa 2 tháng lương bình quân
      totalAmount = Math.min(
        totalSalaryWithInflation * 0.22,
        averageSalary * 2
      );
    } else {
      // Đủ 1 năm trở lên
      const years = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      const adjustedYears = years + (remainingMonths >= 7 ? 1 : (remainingMonths >= 1 ? 0.5 : 0));
      
      totalAmount = averageSalary * adjustedYears * 2; // Từ 2014 trở đi dùng hệ số 2
    }

    const result: BHXHResult = {
      totalAmount,
      averageSalary,
      totalMonths,
      periods
    };

    onCalculate(result);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1994; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <Box>
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4 
            }}
            >
                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    Giai đoạn nộp BHXH
                </Typography>
                <Button
                    variant="contained"
                    onClick={calculateBHXH}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        px: 6,
                        py: 1.5,
                        fontSize: 16,
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark 
                        }
                    }}
                >
                    Tính bảo hiểm xã hội
                </Button>
            </Box>

      {periods.map((period, index) => (
        <Paper key={period.id} elevation={1} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Giai đoạn {index + 1}
            </Typography>
            {periods.length > 1 && (
              <IconButton onClick={() => removePeriod(period.id)} color="error">
                <Delete />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '2fr', md: '2fr 2fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Từ năm</InputLabel>
              <Select
                value={period.startYear}
                label="Từ năm"
                onChange={(e) => updatePeriod(period.id, 'startYear', e.target.value)}
              >
                {generateYearOptions().map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Đến năm</InputLabel>
              <Select
                value={period.endYear || period.startYear}
                label="Đến năm"
                onChange={(e) => updatePeriod(period.id, 'endYear', e.target.value)}
              >
                {generateYearOptions().map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '2fr', md: '2fr 2fr' }, gap: 2, mt: 3}}>
                <TextField
                    label="Số tháng"
                    type="number"
                    value={period.months}
                    onChange={(e) => updatePeriod(period.id, 'months', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1, max: 60 }}
                    fullWidth
                />

                <TextField
                    label="Mức lương đóng BHXH"
                    type="number"
                    value={period.salary}
                    onChange={(e) => updatePeriod(period.id, 'salary', parseInt(e.target.value) || 0)}
                    InputProps={{
                    endAdornment: <InputAdornment position="end">VND</InputAdornment>
                    }}
                    fullWidth
                />
            </Box>
        </Paper>
      ))}

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          onClick={addPeriod}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            textTransform: 'none',
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: 'rgba(0, 154, 62, 0.04)'
            }
          }}
        >
          Thêm giai đoạn
        </Button>

        {type === 'voluntary' && (
          <Button
            variant="outlined"
            onClick={addPregnancyPeriod}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              textTransform: 'none',
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: 'rgba(0, 154, 62, 0.04)'
              }
            }}
          >
            Thêm BHXH tự nguyện
          </Button>
        )}

        {type === 'both' && (
          <Button
            variant="outlined"
            onClick={addPregnancyPeriod}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              textTransform: 'none',
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: 'rgba(0, 154, 62, 0.04)'
              }
            }}
          >
            Thêm giai đoạn thai sản
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BHXHCalculator;
export type { BHXHResult, BHXHPeriod };