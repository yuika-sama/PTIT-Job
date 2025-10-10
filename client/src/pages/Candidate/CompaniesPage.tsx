import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Pagination
} from '@mui/material';
import CompanyDetailCard, { CompanyDetailData } from '../../components/candidate/CompanyDetailCard';
import CompaniesPageHeader from '../../components/candidate/CompaniesPageHeader';

// Mock data for companies
const mockCompanies: CompanyDetailData[] = [
  {
    id: 1,
    name: 'CÔNG TY TNHH BẢO TÍN MINH CHÂU',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=200&fit=crop',
    description: 'Bảo Tín Minh Châu là một trong những công ty uy tín hàng đầu tại Việt Nam trong lĩnh vực kinh doanh vàng bạc đá quý tại Việt Nam. Với gần 30 năm phát triển, Bảo Tín Minh Châu đã có 5 cơ sở kinh doanh tại Hà Nội và trên 100 đại lý, điểm kinh doanh trên toàn quốc với hai loại sản phẩm chính là Vàng miếng Thăng...',
    industry: 'Bán lẻ / Bán sỉ',
    size: '1000+ nhân viên',
    location: 'Hà Nội',
    establishedYear: 1994,
    openJobs: 25,
    isFeatured: true
  },
  {
    id: 2,
    name: 'HAPAS VIỆT NAM',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=200&fit=crop',
    description: 'HAPAS chào bạn!HAPAS với sứ mệnh đem lại hạnh phúc và sự tin cậy, chúng tôi luôn chăm sóc khách hàng một cách tận tâo, thứ đường tiến năng con người và đáng nể lực không ngừng để trở thành công ty thời trang số 1 tại Việt Nam vào năm 2028, cam kết mang đến trải nghiệm khách hàng vượt trội với những sản phẩm thời thượng.Ở HAPAS, chúng...',
    industry: 'Thời trang / May mặc',
    size: '500-999 nhân viên',
    location: 'TP.HCM',
    establishedYear: 2015,
    openJobs: 42,
    isTopCompany: true
  },
  {
    id: 3,
    name: 'NOVALAND GROUP CORP',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=200&fit=crop',
    description: 'Novaland là Tập đoàn đầu tư và phát triển bất động sản hàng đầu Việt Nam với hơn 15 năm kinh nghiệm và phát triển. Novaland đang có hữu danh mục hơn 50 dự án BDS và ghi dấu ấn với những công... Trải qua hành trình 31 năm hình thành và phát triển, Novaland đang có hữu danh mục hơn 50 dự án BDS và ghi dấu ấn với những công...',
    industry: 'Bất động sản',
    size: '5000+ nhân viên',
    location: 'TP.HCM',
    establishedYear: 1993,
    openJobs: 87,
    isFeatured: true,
    isTopCompany: true
  },
  {
    id: 4,
    name: 'FPT SOFTWARE',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=500&h=200&fit=crop',
    description: 'FPT Software là công ty công nghệ thông tin hàng đầu Việt Nam, chuyên cung cấp các dịch vụ phần mềm và giải pháp công nghệ cho khách hàng toàn cầu. Với hơn 25 năm kinh nghiệm, FPT Software đã phục vụ hơn 1000 khách hàng tại 30 quốc gia trên thế giới.',
    industry: 'Công nghệ thông tin',
    size: '10000+ nhân viên',
    location: 'Hà Nội, TP.HCM, Đà Nẵng',
    establishedYear: 1999,
    openJobs: 156,
    isTopCompany: true
  },
  {
    id: 5,
    name: 'VINGROUP',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=500&h=200&fit=crop',
    description: 'Vingroup là tập đoàn kinh tế tư nhân đa ngành hàng đầu Việt Nam, hoạt động trong các lĩnh vực bất động sản, du lịch nghỉ dưỡng, bán lẻ, giáo dục, y tế, nông nghiệp, công nghiệp và công nghệ.',
    industry: 'Tập đoàn đa ngành',
    size: '15000+ nhân viên',
    location: 'Hà Nội, TP.HCM',
    establishedYear: 1993,
    openJobs: 234,
    isTopCompany: true,
    isFeatured: true
  },
  {
    id: 6,
    name: 'SAMSUNG VIETNAM',
    logo: 'https://via.placeholder.com/80',
    coverImage: 'https://images.unsplash.com/photo-1565542959450-9f1dcfdeaefa?w=500&h=200&fit=crop',
    description: 'Samsung Electronics Việt Nam là chi nhánh của tập đoàn công nghệ Samsung, chuyên sản xuất và phát triển các sản phẩm điện tử tiêu dùng, thiết bị di động và linh kiện bán dẫn.',
    industry: 'Sản xuất điện tử',
    size: '20000+ nhân viên',
    location: 'Bắc Ninh, TP.HCM',
    establishedYear: 2008,
    openJobs: 95,
    isTopCompany: true
  }
];

const CompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalCompanies = 100000;
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
      <CompaniesPageHeader
        currentTab={currentTab}
        searchTerm={searchTerm}
        onTabChange={handleTabChange}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
      />

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Results Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            DANH SÁCH CÁC CÔNG TY NỔI BẬT
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
          {mockCompanies.map((company) => (
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
            count={Math.min(totalPages, 20)}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#009a3e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#008035'
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

export default CompaniesPage;