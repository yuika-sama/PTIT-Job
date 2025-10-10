import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon,
  Functions as FunctionsIcon,
  Help as HelpIcon,
  TrendingUp
} from '@mui/icons-material';
import CandidateLayout from '../../components/CandidateLayout';
import CompoundInterestCalculator, { CompoundInterestResult } from '../../components/candidate/CompoundInterestCalculator';
import CompoundInterestResultDisplay from '../../components/candidate/CompoundInterestResultDisplay';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`compound-interest-tabpanel-${index}`}
      aria-labelledby={`compound-interest-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const CompoundInterestPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [calculationResult, setCalculationResult] = useState<CompoundInterestResult | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCalculationResult = (result: CompoundInterestResult) => {
    setCalculationResult(result);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3
            }}
          >
            <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Công cụ tính Lãi suất kép
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Công cụ miễn phí giúp bạn tính toán lãi suất kép, đầu tư và tiết kiệm hiệu quả
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs Navigation */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '& .MuiTab-root': {
              py: 2,
              minHeight: 72,
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            icon={<CalculateIcon />} 
            label="Máy tính lãi kép" 
            iconPosition="start"
            sx={{ 
              '&.Mui-selected': { 
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          />
          <Tab 
            icon={<FunctionsIcon />} 
            label="Công thức tính toán" 
            iconPosition="start"
            sx={{ 
              '&.Mui-selected': { 
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          />
          <Tab 
            icon={<HelpIcon />} 
            label="Câu hỏi thường gặp" 
            iconPosition="start"
            sx={{ 
              '&.Mui-selected': { 
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          />
        </Tabs>

        {/* Tab 1: Calculator */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <CompoundInterestCalculator onCalculate={handleCalculationResult} />
            {calculationResult && (
              <CompoundInterestResultDisplay result={calculationResult} />
            )}
          </Box>
        </TabPanel>

        {/* Tab 2: Formula */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Công thức tính lãi suất kép
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Lãi suất kép trong tiếng Anh là Compound Interest, được Einstein nhận định là "kỳ quan thứ 8 của thế giới. 
              Những ai hiểu được nó sẽ có được tiền, ai không hiểu sẽ phải trả chi phí cho điều đó". 
              "Thiên tài đầu tư" Warren Buffett cũng từng chia sẻ kinh nghiệm đầu tư của tôi kể hợp từ cuộc sống tại Mỹ, 
              gần tới và Lãi suất kép.
            </Typography>

            <Card elevation={0} sx={{ mb: 4, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`, borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" color="info.main" gutterBottom>
                  Lãi suất kép là gì?
                </Typography>
                <Typography variant="body1" paragraph>
                  Lãi suất kép (lãi kép) hay còn được gọi là lãi cộng dồn, có nghĩa là khi đến kỳ nhận lãi của khoản đầu tư thì 
                  bạn lấy đó nhập vào thành gốc và tiếp tục đầu tư chuỗi chu kỳ tiếp theo. Cứ lặp đi lặp lại như vậy xuyên suốt 
                  thời gian đầu tư hoặc gửi tiết kiệm thì được gọi là lãi suất kép.
                </Typography>
              </CardContent>
            </Card>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Công thức tính lãi suất kép trong toán học
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Công thức: F<sub>n</sub> = P * (1 + i/m)^(n * m)
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                my: 4, 
                p: 4, 
                bgcolor: 'white', 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontFamily: 'math',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                >
                  F<sub>n</sub> = P(1 + <sup>i</sup>/<sub>m</sub>)<sup>n.m</sup>
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Công thức tính lãi suất kép
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 3 }}>Trong đó:</Typography>
              
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" paragraph>• <strong>Fn</strong> là giá trị của khoản đầu tư trong khoảng thời gian n năm mà bạn nhận được.</Typography>
                <Typography variant="body2" paragraph>• <strong>P</strong> là giá trị khoản đầu tư hiện tại của bạn.</Typography>
                <Typography variant="body2" paragraph>• <strong>i</strong> là lãi suất hàng năm của khoản đầu tư đó. Ví dụ lãi suất 10%/năm, thì i được hiểu là 0,1.</Typography>
                <Typography variant="body2" paragraph>• <strong>n</strong> là số năm bạn đầu tư.</Typography>
                <Typography variant="body2" paragraph>• <strong>m</strong> là số lần nhận lãi trong 1 năm, nếu lãi nhận hàng năm thì m là 1.</Typography>
              </Box>
            </Paper>

            <Card elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`, borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                  Sức mạnh của lãi suất kép
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Bạn đang có trong tay 100 triệu. Bạn muốn đầu tư với lãi suất 8%/năm.</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                  Nếu áp dụng lãi đơn, sau 5 năm bạn nhận được: 100 * (1 + 8%*5) = 140 triệu đồng. 
                  Số tiền này còn cao hơn khi bạn sử dụng công thức lãi kép như sau: 100 * (1 + 8%)^5 = 146,93 triệu đồng.
                </Typography>
                <Typography variant="body2">
                  Sức mạnh của lãi kép trở nên rõ ràng hơn khi bạn nhìn vào biểu đồ tăng trưởng dài hạn dưới đây.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Tab 3: FAQ */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Câu hỏi thường gặp
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Những câu hỏi phổ biến về lãi suất kép và đầu tư
            </Typography>

            <Box sx={{ space: 2 }}>
              <Accordion elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 2, mb: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight="medium">
                    Mức lãi suất là bao nhiêu?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    Lãi suất là tỷ lệ mà theo đó tiền lãi được người vay trả cho việc sử dụng tiền mà họ vay từ người cho vay. 
                    Tùy vào chính sách của mỗi ngân hàng hay đơn vị/tổ chức tài chính sẽ có mức lãi suất khác nhau. 
                    Nếu bạn gửi tiết kiệm - tức là bạn đang cho ngân hàng vay tạm thì lãi suất cũng cao có lợi cho bạn. 
                    Tham khảo cảng nhiều ngân hàng hay gói tiết kiệm / đầu tư để lựa chọn được nơi gửi tiết kiệm / đầu tư hiệu quả nhất.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 2, mb: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight="medium">
                    Lãi suất hàng năm, hàng tháng là gì?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    Với dịch vụ gửi tiết kiệm có kỳ hạn, số tiền gửi sẽ được quy định một mức kỳ hạn đi kèm với mức lãi suất cam kết. 
                    Ngân hàng sẽ đưa ra nhiều mức kỳ hạn khác nhau cho khách hàng lựa chọn theo nhu cầu, ví dụ gửi tiết kiệm hàng tháng, 
                    quý, năm,... Công cụ tình lãi kép của TopCV bao gồm 2 lựa chọn đơn vị lãi kép phổ biến nhất đó là theo năm và theo tháng.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 2, mb: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight="medium">
                    Làm thế nào để tận dụng được sức mạnh của lãi kép?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Hãy bắt đầu tiết kiệm/đầu tư từ sớm
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Dù bạn bao nhiêu tuổi, bạn cũng nên bắt đầu tiết kiệm ngay. Kể cả với số tiền nhỏ, 
                    lãi kép sẽ giúp nhân số tiền tiết kiệm của bạn lên nhiều lần cùng thời gian.
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Hãy tiết kiệm/đầu tư thường xuyên
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Hãy gửi nguyên tắc và tiết kiệm mỗi tháng. Nhờ bạn thấy, chỉ cần tiết kiệm đều mỗi tháng 1 triệu / tháng 
                    cũng có thể sinh ra số tiền lớn tối đa 500 triệu sau 20 năm. Và nếu bạn tiết kiệm lâu hơn, 
                    là 40 năm thay vì 20 năm, con số mà bạn nhận được sẽ là tới 2.356.274.847 VND sau 40 năm!
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Lựa chọn kênh tiết kiệm/đầu tư hiệu quả nhất
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mỗi ngân hàng hay tổ chức tài chính trên thị trường đều có mức lãi suất khác nhau qua vào chính sách 
                    dành cho khách hàng và lợi thế cạnh tranh mà họ muốn. Thận chí, trong cùng một ngân hàng cũng sẽ có 
                    nhiều gói tiết kiệm / đầu tư và chính sách khác nhau. Vì vậy, hãy tham khảo nhiều chương trình tiết kiệm / 
                    đầu tư để lựa chọn kênh phù hợp nhất với mức tài chính và kế hoạch của bạn.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Container>

  );
};

export default CompoundInterestPage;