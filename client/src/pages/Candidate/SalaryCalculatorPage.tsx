import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SalaryCalculator, { SalaryCalculationResult } from '../../components/candidate/SalaryCalculator';
import SalaryResultDisplay from '../../components/candidate/SalaryResultDisplay';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`salary-tabpanel-${index}`}
      aria-labelledby={`salary-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `salary-tab-${index}`,
    'aria-controls': `salary-tabpanel-${index}`,
  };
}

const SalaryCalculatorPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [calculationResult, setCalculationResult] = useState<SalaryCalculationResult | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setCalculationResult(null); // Reset result when switching tabs
  };

  const handleCalculationResult = useCallback((result: SalaryCalculationResult) => {
    setCalculationResult(result);
  }, []);

  const faqData = [
    {
      question: "Thuế thu nhập cá nhân được tính như thế nào?",
      answer: "Thuế TNCN được tính theo thang thuế lũy tiến từng phần với các mức thuế suất từ 5% đến 35%. Thu nhập chịu thuế = Lương Gross - Bảo hiểm - Giảm trừ gia cảnh."
    },
    {
      question: "Mức giảm trừ gia cảnh năm 2025 là bao nhiêu?",
      answer: "Giảm trừ bản thân: 11.000.000 VND/tháng. Giảm trừ người phụ thuộc: 4.800.000 VND/người/tháng."
    },
    {
      question: "Tỷ lệ đóng bảo hiểm bao gồm những gì?",
      answer: "Bảo hiểm xã hội: 8%, Bảo hiểm y tế: 1.5%, Bảo hiểm thất nghiệp: 1%. Tổng cộng 10.5% trên mức lương đóng bảo hiểm."
    },
    {
      question: "Lương tối thiểu vùng năm 2025?",
      answer: "Vùng 1: 4.960.000 VND, Vùng 2: 4.410.000 VND, Vùng 3: 3.860.000 VND, Vùng 4: 3.450.000 VND."
    },
    {
      question: "Sự khác biệt giữa lương Gross và Net?",
      answer: "Lương Gross là lương trước thuế và bảo hiểm. Lương Net là lương thực nhận sau khi trừ thuế TNCN và các khoản bảo hiểm."
    },
    {
      question: "Kết quả tính toán có chính xác 100%?",
      answer: "Kết quả chỉ mang tính chất tham khảo, dựa trên quy định hiện hành. Mức thuế thực tế có thể khác do các yếu tố đặc thù của từng trường hợp."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}30, transparent)`,
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center">
            Tính Lương Gross - Net
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9, mb: 2 }}>
            Công cụ tính toán lương chính xác theo quy định thuế thu nhập cá nhân 2025
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
            Phát triển bởi Học viện Công nghệ Bưu chính Viễn thông
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mt: 3,
            flexWrap: 'wrap'
          }}>
            <Chip 
              label="Cập nhật 2025" 
              sx={{ 
                color: 'white', 
                backgroundColor: theme.palette.secondary.main,
                fontWeight: 'bold'
              }}
            />
            <Chip 
              label="Tính toán chính xác" 
              sx={{ 
                color: 'white', 
                backgroundColor: `${theme.palette.warning.main}DD`,
                fontWeight: 'bold'
              }}
            />
            <Chip 
              label="Miễn phí" 
              sx={{ 
                color: 'white', 
                backgroundColor: `${theme.palette.success.main}DD`,
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Calculator Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          background: `linear-gradient(90deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="salary calculator tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 'bold',
                py: 2,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  backgroundColor: `${theme.palette.primary.main}08`
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3
              }
            }}
          >
            <Tab 
              label="Tính Gross → Net" 
              {...a11yProps(0)} 
              icon={
                <Box sx={{ color: theme.palette.secondary.main }}>
                  <Typography variant="body2">Từ lương gộp sang thực nhận</Typography>
                </Box>
              }
              iconPosition="bottom"
            />
            <Tab 
              label="Tính Net → Gross" 
              {...a11yProps(1)}
              icon={
                <Box sx={{ color: theme.palette.secondary.main }}>
                  <Typography variant="body2">Từ lương thực nhận sang gộp</Typography>
                </Box>
              }
              iconPosition="bottom"
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <SalaryCalculator
            calculationType="gross-to-net"
            onCalculate={handleCalculationResult}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <SalaryCalculator
            calculationType="net-to-gross"
            onCalculate={handleCalculationResult}
          />
        </TabPanel>
      </Paper>

      {/* Results */}
      {calculationResult && (
        <SalaryResultDisplay
          result={calculationResult}
          calculationType={tabValue === 0 ? 'gross-to-net' : 'net-to-gross'}
        />
      )}

      {/* FAQ Section */}
      <Paper sx={{ 
        p: 4, 
        mt: 4, 
        borderRadius: 2,
        background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        boxShadow: 3
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
            Câu hỏi thường gặp
          </Typography>
          <Box sx={{ 
            width: 80, 
            height: 4, 
            backgroundColor: theme.palette.primary.main,
            mx: 'auto',
            borderRadius: 2
          }} />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          {faqData.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 1,
                borderRadius: 1,
                '&:before': {
                  display: 'none',
                },
                boxShadow: 1,
                '&.Mui-expanded': {
                  boxShadow: 2,
                  '& .MuiAccordionSummary-root': {
                    backgroundColor: `${theme.palette.primary.main}08`
                  }
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                  },
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}04`
                  }
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: theme.palette.text.primary }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

      {/* Footer Note */}
      <Paper sx={{ 
        p: 3, 
        mt: 4, 
        backgroundColor: theme.palette.grey[50],
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }} />
        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ pt: 1 }}>
          <strong style={{ color: theme.palette.primary.main }}>Lưu ý:</strong> Kết quả tính toán chỉ mang tính chất tham khảo, 
          dựa trên quy định thuế thu nhập cá nhân và bảo hiểm xã hội hiện hành. 
          Để có kết quả chính xác nhất, vui lòng tham khảo ý kiến của chuyên gia tài chính hoặc kế toán.
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mt: 1, fontStyle: 'italic' }}>
          © 2025 Học viện Công nghệ Bưu chính Viễn thông - PTIT Job Portal
        </Typography>
      </Paper>
    </Container>
  );
};

export default SalaryCalculatorPage;