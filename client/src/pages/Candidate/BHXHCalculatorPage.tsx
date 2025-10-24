import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import BHXHCalculator, { BHXHResult } from '../../components/candidate/BHXHCalculator';
import BHXHResultDisplay from '../../components/candidate/BHXHResultDisplay';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bhxh-tabpanel-${index}`}
      aria-labelledby={`bhxh-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const BHXHCalculatorPage: React.FC = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [mandatoryResult, setMandatoryResult] = useState<BHXHResult | null>(null);
  const [voluntaryResult, setVoluntaryResult] = useState<BHXHResult | null>(null);
  const [bothResult, setBothResult] = useState<BHXHResult | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getTabType = (tabIndex: number): 'mandatory' | 'voluntary' | 'both' => {
    switch (tabIndex) {
      case 0: return 'mandatory';
      case 1: return 'voluntary';
      case 2: return 'both';
      default: return 'mandatory';
    }
  };

  const getCurrentResult = () => {
    switch (currentTab) {
      case 0: return mandatoryResult;
      case 1: return voluntaryResult;
      case 2: return bothResult;
      default: return null;
    }
  };

  const handleCalculate = (result: BHXHResult) => {
    switch (currentTab) {
      case 0: setMandatoryResult(result); break;
      case 1: setVoluntaryResult(result); break;
      case 2: setBothResult(result); break;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          py: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 400,
            height: 400,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23009a3e" opacity="0.1"%3E%3Cpath d="M100 100l50 50v100h100l50-50v-100z"/%3E%3Cpath d="M200 150l30 30v60h60l30-30v-60z"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        />

        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#009a3e' }}>
              Công cụ tính bảo hiểm xã hội một lần online miễn phí 2025
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              backgroundColor: '#f8f9fa',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16,
                py: 2,
                color: '#666',
                borderBottom: '3px solid transparent',
                '&.Mui-selected': {
                  color: '#009a3e',
                  borderBottom: '3px solid #009a3e'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab label="BHXH bắt buộc" />
            <Tab label="BHXH tự nguyện" />
            <Tab label="Cả BHXH bắt buộc & BHXH tự nguyện" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
            {/* Left Column - Calculator */}
            <Box>
              <TabPanel value={currentTab} index={0}>
                <BHXHCalculator
                  type="mandatory"
                  onCalculate={handleCalculate}
                />
              </TabPanel>
              <TabPanel value={currentTab} index={1}>
                <BHXHCalculator
                  type="voluntary"
                  onCalculate={handleCalculate}
                />
              </TabPanel>
              <TabPanel value={currentTab} index={2}>
                <BHXHCalculator
                  type="both"
                  onCalculate={handleCalculate}
                />
              </TabPanel>
            </Box>

            {/* Right Column - Results */}
            <Box>
              <BHXHResultDisplay
                result={getCurrentResult()}
                type={getTabType(currentTab)}
              />
            </Box>
          </Box>
        </Box>

        {/* Information Section */}
        <Box sx={{ mt: 6 }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#009a3e' }}>
                    Thông tin về bảo hiểm xã hội một lần
                </Typography>

                <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
                    <strong>Bảo hiểm xã hội một lần là gì?</strong>
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
                    Căn cứ theo Điều 3 Luật Bảo hiểm xã hội 2014, bảo hiểm xã hội một lần là sự bù đắp một phần thu nhập 
                    dành cho người lao động khi người lao động bị ốm đau, thai sản hay bị tai nạn lao động, bệnh nghề nghiệp, 
                    hết tuổi lao động hoặc chết.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    <strong>Điều kiện hưởng BHXH một lần theo Luật BHXH (sửa đổi):</strong>
                </Typography>

                <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
                    <strong>1. Đối với người lao động đã tham gia BHXH trước ngày 01/7/2025:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Đã nghỉ việc ít nhất 12 tháng và không tiếp tục tham gia đóng BHXH.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Chưa đủ 20 năm đóng BHXH.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Có đơn yêu cầu được hưởng BHXH một lần.
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
                    <strong>2. Đối với người lao động bắt đầu tham gia BHXH từ ngày 01/7/2025 trở đi:</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                    Người lao động trong nhóm này vẫn được rút BHXH một lần nếu thuộc một trong các trường hợp đặc biệt sau:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Đủ tuổi nghỉ hưu nhưng thời gian đóng BHXH dưới 15 năm.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Ra nước ngoài để định cư.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Mắc các bệnh hiểm nghèo như: Ung thư, bại liệt, xơ gan mất bù, lao nặng, AIDS.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Suy giảm khả năng lao động từ 81% trở lên.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.7, color: 'text.secondary' }}>
                        Thuộc nhóm người khuyết tật đặc biệt nặng.
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 3 }}>
                    * Thông tin trên chỉ mang tính chất tham khảo theo dự thảo Luật Bảo hiểm xã hội (sửa đổi). Vui lòng tham khảo thêm các quy định pháp luật chính thức được ban hành.
                </Typography>
            </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default BHXHCalculatorPage;