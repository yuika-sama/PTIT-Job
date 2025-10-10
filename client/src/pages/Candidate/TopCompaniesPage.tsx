import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Tabs,
  Tab,
  InputAdornment,
  Pagination,
  Chip,
  Stack
} from '@mui/material';
import {
  Search,
  Star,
  TrendingUp,
  EmojiEvents
} from '@mui/icons-material';
import CompanyDetailCard, { CompanyDetailData } from '../../components/candidate/CompanyDetailCard';

// Mock data for top companies (premium/featured companies)
const mockTopCompanies: CompanyDetailData[] = [
  {
    id: 1,
    name: 'FPT SOFTWARE',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=500&h=200&fit=crop',
    description: 'FPT Software là công ty công nghệ thông tin hàng đầu Việt Nam, chuyên cung cấp các dịch vụ phần mềm và giải pháp công nghệ cho khách hàng toàn cầu. Với hơn 25 năm kinh nghiệm, chúng tôi đã phục vụ hơn 1000 khách hàng tại 30 quốc gia, mang đến những giải pháp công nghệ tiên tiến và chất lượng cao.',
    industry: 'Công nghệ thông tin',
    size: '10000+ nhân viên',
    location: 'Hà Nội, TP.HCM, Đà Nẵng',
    establishedYear: 1999,
    openJobs: 156,
    isTopCompany: true,
    isFeatured: true
  },
  {
    id: 2,
    name: 'VINGROUP',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=500&h=200&fit=crop',
    description: 'Vingroup là tập đoàn kinh tế tư nhân đa ngành hàng đầu Việt Nam, hoạt động trong các lĩnh vực bất động sản, du lịch nghỉ dưỡng, bán lẻ, giáo dục, y tế, nông nghiệp, công nghiệp và công nghệ. Với tầm nhìn trở thành tập đoàn công nghệ hàng đầu, Vingroup không ngừng đổi mới và phát triển.',
    industry: 'Tập đoàn đa ngành',
    size: '15000+ nhân viên',
    location: 'Hà Nội, TP.HCM',
    establishedYear: 1993,
    openJobs: 234,
    isTopCompany: true,
    isFeatured: true
  },
  {
    id: 3,
    name: 'SAMSUNG VIETNAM',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1565542959450-9f1dcfdeaefa?w=500&h=200&fit=crop',
    description: 'Samsung Electronics Việt Nam là chi nhánh của tập đoàn công nghệ Samsung toàn cầu, chuyên sản xuất và phát triển các sản phẩm điện tử tiêu dùng, thiết bị di động và linh kiện bán dẫn. Chúng tôi cam kết mang đến những sản phẩm công nghệ tiên tiến nhất cho người tiêu dùng Việt Nam.',
    industry: 'Sản xuất điện tử',
    size: '20000+ nhân viên',
    location: 'Bắc Ninh, TP.HCM',
    establishedYear: 2008,
    openJobs: 95,
    isTopCompany: true,
    isFeatured: true
  },
  {
    id: 4,
    name: 'SHOPEE VIETNAM',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=200&fit=crop',
    description: 'Shopee là nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan, thuộc sở hữu của Sea Limited. Tại Việt Nam, Shopee đã trở thành một trong những ứng dụng mua sắm trực tuyến phổ biến nhất, mang đến trải nghiệm mua sắm tuyệt vời cho hàng triệu người dùng.',
    industry: 'Thương mại điện tử',
    size: '3000+ nhân viên',
    location: 'TP.HCM, Hà Nội',
    establishedYear: 2015,
    openJobs: 78,
    isTopCompany: true,
    isFeatured: true
  },
  {
    id: 5,
    name: 'VIETCOMBANK',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=500&h=200&fit=crop',
    description: 'Ngân hàng Thương mại Cổ phần Ngoại thương Việt Nam (Vietcombank) là một trong những ngân hàng thương mại hàng đầu Việt Nam. Với mạng lưới chi nhánh rộng khắp cả nước và đội ngũ nhân viên chuyên nghiệp, Vietcombank cung cấp đầy đủ các dịch vụ ngân hàng hiện đại.',
    industry: 'Ngân hàng - Tài chính',
    size: '5000+ nhân viên',
    location: 'Toàn quốc',
    establishedYear: 1963,
    openJobs: 124,
    isTopCompany: true,
    isFeatured: true
  },
  {
    id: 6,
    name: 'GRAB VIETNAM',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=500&h=200&fit=crop',
    description: 'Grab là siêu ứng dụng hàng đầu Đông Nam Á, cung cấp dịch vụ đi lại, giao hàng, thanh toán và dịch vụ tài chính. Tại Việt Nam, Grab đã trở thành một phần không thể thiếu trong cuộc sống hàng ngày của hàng triệu người dùng, mang đến sự tiện lợi và an toàn.',
    industry: 'Công nghệ - Dịch vụ',
    size: '2000+ nhân viên',
    location: 'TP.HCM, Hà Nội',
    establishedYear: 2014,
    openJobs: 56,
    isTopCompany: true,
    isFeatured: true
  }
];

const TopCompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(1); // Start with "Top công ty" tab active
  const [currentPage, setCurrentPage] = useState(1);

  const totalCompanies = 1000;
  const companiesPerPage = 12;
  const totalPages = Math.ceil(totalCompanies / companiesPerPage);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleViewCompany = (companyId: number) => {
    console.log('Viewing company:', companyId);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Illustration */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 350,
            height: 350,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ff6b35" opacity="0.1"%3E%3Cpath d="M200 50l20 40h40l-32 24 12 38-40-28-40 28 12-38-32-24h40z"/%3E%3Cpath d="M300 150l15 30h30l-24 18 9 28-30-21-30 21 9-28-24-18h30z"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        />
        
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Tabs */}
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{ 
                mb: 4,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#666',
                  '&.Mui-selected': {
                    color: '#ff6b35'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ff6b35',
                  height: 3
                }
              }}
            >
              <Tab label="Danh sách công ty" />
              <Tab label="Top công ty" />
            </Tabs>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents sx={{ fontSize: 40, color: '#ff6b35', mr: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                Top công ty nổi bật nhất
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ mb: 4, color: '#666', maxWidth: 600 }}>
              Khám phá những công ty hàng đầu với môi trường làm việc tuyệt vời và cơ hội phát triển vượt trội
            </Typography>

            {/* Feature Tags */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Chip 
                icon={<Star sx={{ color: 'white !important' }} />}
                label="Đánh giá cao nhất" 
                sx={{ 
                  backgroundColor: '#ff6b35', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              <Chip 
                icon={<TrendingUp sx={{ color: 'white !important' }} />}
                label="Tăng trưởng nhanh" 
                sx={{ 
                  backgroundColor: '#ff6b35', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              <Chip 
                label="Phúc lợi tốt nhất" 
                sx={{ 
                  backgroundColor: '#ff6b35', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              <Chip 
                label="Thương hiệu uy tín" 
                sx={{ 
                  backgroundColor: '#ff6b35', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Stack>
            
            {/* Search Form */}
            <Box
              sx={{
                backgroundColor: 'white',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                gap: 2,
                maxWidth: 600
              }}
            >
              <TextField
                placeholder="Tìm kiếm top công ty"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
                variant="outlined"
              />
              
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: '#ff6b35',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#e55a2b' }
                }}
              >
                Tìm kiếm
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Results Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            TOP CÔNG TY NỔI BẬT NHẤT
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
            Được xếp hạng dựa trên đánh giá của nhân viên, tăng trưởng và uy tín thương hiệu
          </Typography>
        </Box>

        {/* Companies Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 4,
            mb: 6
          }}
        >
          {mockTopCompanies.map((company) => (
            <CompanyDetailCard
              key={company.id}
              company={company}
              onViewCompany={handleViewCompany}
            />
          ))}
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.min(totalPages, 15)}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#e55a2b'
                  }
                }
              }
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default TopCompaniesPage;