import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import TaxCalculator from '../../components/candidate/TaxCalculator';
import TaxResultDisplay from '../../components/candidate/TaxResultDisplay';

interface TaxCalculationResult {
  grossSalary: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
  netSalary: number;
  breakdown: any[];
}

const PersonalIncomeTaxPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCalculationResult = (result: TaxCalculationResult) => {
    setCalculationResult(result);
  };

  const faqData = [
    {
      question: "Thuế thu nhập cá nhân là gì?",
      answer: "Thuế thu nhập cá nhân (Personal income tax) là khoản tiền mà người có thu nhập cần trích từ lương và các nguồn thu khác (nếu có) của mình để nộp vào ngân sách nhà nước sau khi đã được giảm trừ. Thuế thu nhập cá nhân không đánh vào tất cả các đối tượng mà có mức lương quy định cần đóng riêng, góp phần thu hẹp khoảng cách giữa các tầng lớp trong xã hội."
    },
    {
      question: "Mức lương bao nhiêu phải nộp thuế TNCN?",
      answer: "Cá nhân không có người phụ thuộc thì cần phải nộp thuế thu nhập khi có tổng thu nhập từ tiền lương, tiền công trên 11 triệu đồng/tháng (132 triệu đồng/năm). Đối với người có người phụ thuộc: 1 người phụ thuộc: >15.4 triệu/tháng, 2 người: >19.8 triệu/tháng, 3 người: >24.2 triệu/tháng, 4 người: >28.4 triệu/tháng."
    },
    {
      question: "Các khoản được miễn thuế TNCN?",
      answer: "Các khoản được miễn thuế bao gồm: trợ cấp, phụ cấp ưu đãi hàng tháng theo quy định pháp luật về ưu đãi người có công; phụ cấp độc hại, nguy hiểm; phụ cấp thu hút, phụ cấp khu vực; trợ cấp khó khăn đột xuất, tai nạn lao động; trợ cấp thôi việc, thất nghiệp; phần thu nhập từ tiền lương làm thêm giờ, ban đêm được trả cao hơn mức bình thường."
    },
    {
      question: "Thử việc có cần đóng thuế TNCN không?",
      answer: "Theo quy định, các trường hợp có thu nhập từ 2 triệu đồng/lần trở lên thì phải khấu trừ thuế theo mức 10% trên tổng thu nhập. Ví dụ: lương thử việc 3.5 triệu sẽ bị khấu trừ 350,000 đồng, thực nhận 3.15 triệu đồng."
    },
    {
      question: "Tiền tăng ca có bị áp thuế TNCN không?",
      answer: "Tiền làm thêm giờ, ban đêm được miễn thuế TNCN nhưng chỉ miễn phần chênh lệch so với mức lương bình thường. Ví dụ: lương bình thường 100k/giờ, tăng ca 150k/giờ thì chỉ miễn thuế cho 50k/giờ, còn 100k/giờ vẫn phải tính thuế."
    }
  ];

  const taxBracketInfo = [
    { level: 1, range: "Đến 5 triệu", rate: "5%", description: "Mức thuế thấp nhất" },
    { level: 2, range: "Trên 5 - 10 triệu", rate: "10%", description: "Mức thuế cơ bản" },
    { level: 3, range: "Trên 10 - 18 triệu", rate: "15%", description: "Mức thuế trung bình" },
    { level: 4, range: "Trên 18 - 32 triệu", rate: "20%", description: "Mức thuế cao" },
    { level: 5, range: "Trên 32 - 52 triệu", rate: "25%", description: "Mức thuế rất cao" },
    { level: 6, range: "Trên 52 - 80 triệu", rate: "30%", description: "Mức thuế cực cao" },
    { level: 7, range: "Trên 80 triệu", rate: "35%", description: "Mức thuế tối đa" }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: { xs: 3, md: 4 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        borderRadius: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        
        <CalculateIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
        <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
          Công cụ tính Thuế thu nhập cá nhân chuẩn 2025
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
          Tính toán chính xác theo quy định mới nhất của Bộ Tài chính
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Cập nhật 2025" color="primary" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="Miễn phí" color="primary" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="Chính xác 100%" color="primary" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Box>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 600
            }
          }}
        >
          <Tab 
            icon={<CalculateIcon />} 
            label="Máy tính thuế" 
            iconPosition="start"
          />
          <Tab 
            icon={<InfoIcon />} 
            label="Bảng thuế suất" 
            iconPosition="start"
          />
          <Tab 
            icon={<SchoolIcon />} 
            label="Hướng dẫn & FAQ" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          <TaxCalculator onCalculate={handleCalculationResult} />
          {calculationResult && (
            <TaxResultDisplay result={calculationResult} />
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Bảng thuế suất thuế thu nhập cá nhân 2025
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 2 }}>
            {taxBracketInfo.map((bracket) => (
              <Paper
                key={bracket.level}
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderLeft: `4px solid ${
                    bracket.level <= 2 ? theme.palette.success.main :
                    bracket.level <= 4 ? theme.palette.warning.main :
                    theme.palette.error.main
                  }`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Bậc {bracket.level}: {bracket.range}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bracket.description}
                  </Typography>
                </Box>
                <Chip
                  label={bracket.rate}
                  size="medium"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    bgcolor: bracket.level <= 2 ? theme.palette.success.main + '20' :
                             bracket.level <= 4 ? theme.palette.warning.main + '20' :
                             theme.palette.error.main + '20',
                    color: bracket.level <= 2 ? theme.palette.success.main :
                           bracket.level <= 4 ? theme.palette.warning.main :
                           theme.palette.error.main
                  }}
                />
              </Paper>
            ))}
          </Box>

          <Box sx={{ mt: 4, p: 3, bgcolor: theme.palette.info.main + '08', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Lưu ý quan trọng:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Thuế suất áp dụng theo phương pháp lũy tiến từng phần
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Giảm trừ gia cảnh bản thân: 11 triệu đồng/tháng (132 triệu/năm)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Giảm trừ người phụ thuộc: 4.4 triệu đồng/người/tháng
            </Typography>
            <Typography variant="body2">
              • Bảo hiểm bắt buộc (BHXH, BHYT, BHTN) được trừ trước khi tính thuế
            </Typography>
          </Box>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Hướng dẫn và câu hỏi thường gặp
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Công thức tính thuế TNCN:
            </Typography>
            <Paper sx={{ p: 3, bgcolor: theme.palette.grey[50] }}>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                Thuế TNCN = Thu nhập chịu thuế × Thuế suất
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Thu nhập chịu thuế =</strong> Thu nhập gốc - Bảo hiểm - Giảm trừ gia cảnh
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Giảm trừ gia cảnh =</strong> 11,000,000đ + (Số người phụ thuộc × 4,400,000đ)
              </Typography>
              <Typography variant="body2">
                <strong>Bảo hiểm =</strong> Lương × 10.5% (BHXH 8% + BHYT 1.5% + BHTN 1%)
              </Typography>
            </Paper>
          </Box>

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Câu hỏi thường gặp:
          </Typography>
          
          {faqData.map((faq, index) => (
            <Accordion 
              key={index}
              elevation={0}
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                '&:not(:last-child)': { mb: 1 },
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  '&:hover': { backgroundColor: theme.palette.grey[100] }
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default PersonalIncomeTaxPage;