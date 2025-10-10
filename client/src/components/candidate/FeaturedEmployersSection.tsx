import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Button,
  Stack,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import {
  Business,
  People,
  LocationOn,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Star,
  Verified
} from '@mui/icons-material';

// Mock data for featured employers
const mockFeaturedEmployers = [
  {
    id: 1,
    name: 'FPT Software',
    logo: 'https://via.placeholder.com/80',
    industry: 'Công nghệ thông tin',
    size: '10,000+ nhân viên',
    location: 'Hà Nội, TP.HCM',
    openJobs: 125,
    rating: 4.5,
    isVerified: true,
    isFeatured: true,
    description: 'Công ty công nghệ hàng đầu Việt Nam với nhiều dự án quốc tế',
    benefits: ['Lương cao', 'Đào tạo', 'Du lịch'],
    establishedYear: 1999
  },
  {
    id: 2,
    name: 'Vietcombank',
    logo: 'https://via.placeholder.com/80',
    industry: 'Ngân hàng - Tài chính',
    size: '5,000+ nhân viên',
    location: 'Toàn quốc',
    openJobs: 89,
    rating: 4.3,
    isVerified: true,
    isFeatured: false,
    description: 'Ngân hàng thương mại cổ phần hàng đầu Việt Nam',
    benefits: ['Bảo hiểm', 'Thưởng', 'Ổn định'],
    establishedYear: 1963
  },
  {
    id: 3,
    name: 'Vingroup',
    logo: 'https://via.placeholder.com/80',
    industry: 'Bất động sản - Xây dựng',
    size: '15,000+ nhân viên',
    location: 'Hà Nội, TP.HCM',
    openJobs: 156,
    rating: 4.4,
    isVerified: true,
    isFeatured: true,
    description: 'Tập đoàn kinh tế tư nhân lớn nhất Việt Nam',
    benefits: ['Môi trường', 'Phúc lợi', 'Phát triển'],
    establishedYear: 1993
  },
  {
    id: 4,
    name: 'Samsung Vietnam',
    logo: 'https://via.placeholder.com/80',
    industry: 'Sản xuất - Điện tử',
    size: '20,000+ nhân viên',
    location: 'Bắc Ninh, TP.HCM',
    openJobs: 78,
    rating: 4.6,
    isVerified: true,
    isFeatured: false,
    description: 'Tập đoàn công nghệ hàng đầu thế giới',
    benefits: ['Quốc tế', 'Công nghệ', 'Lương cao'],
    establishedYear: 1969
  },
  {
    id: 5,
    name: 'Shopee Vietnam',
    logo: 'https://via.placeholder.com/80',
    industry: 'Thương mại điện tử',
    size: '3,000+ nhân viên',
    location: 'TP.HCM, Hà Nội',
    openJobs: 67,
    rating: 4.2,
    isVerified: true,
    isFeatured: true,
    description: 'Nền tảng thương mại điện tử hàng đầu Đông Nam Á',
    benefits: ['Startup', 'Năng động', 'Sáng tạo'],
    establishedYear: 2015
  },
  {
    id: 6,
    name: 'Grab Vietnam',
    logo: 'https://via.placeholder.com/80',
    industry: 'Công nghệ - Dịch vụ',
    size: '2,000+ nhân viên',
    location: 'TP.HCM, Hà Nội',
    openJobs: 45,
    rating: 4.3,
    isVerified: true,
    isFeatured: false,
    description: 'Ứng dụng gọi xe và giao hàng hàng đầu',
    benefits: ['Tech', 'Linh hoạt', 'Sáng tạo'],
    establishedYear: 2012
  }
];

const industryFilters = ['Tất cả', 'Công nghệ', 'Tài chính', 'Bất động sản', 'Sản xuất', 'Thương mại'];

const FeaturedEmployersSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const itemsPerPage = 3;
  
  const filteredEmployers = activeFilter === 'Tất cả' 
    ? mockFeaturedEmployers 
    : mockFeaturedEmployers.filter(emp => emp.industry.includes(activeFilter === 'Công nghệ' ? 'Công nghệ' : activeFilter));
  
  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage);
  const currentEmployers = filteredEmployers.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        sx={{
          fontSize: 14,
          color: index < Math.floor(rating) ? '#ffc107' : '#e0e0e0'
        }}
      />
    ));
  };

  return (
    <Box sx={{ mt: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Các nhà tuyển dụng nổi bật
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Khám phá những công ty hàng đầu đang tuyển dụng
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            sx={{ 
              border: '1px solid #e0e0e0',
              '&:disabled': { opacity: 0.5 }
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            sx={{ 
              border: '1px solid #e0e0e0',
              '&:disabled': { opacity: 0.5 }
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
          <Button
            endIcon={<ArrowForward />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              color: '#009a3e',
              ml: 2,
              '&:hover': { backgroundColor: 'rgba(0,154,62,0.05)' }
            }}
          >
            Xem tất cả
          </Button>
        </Box>
      </Box>

      {/* Industry Filters */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {industryFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(0);
              }}
              variant={activeFilter === filter ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: activeFilter === filter ? '#009a3e' : 'transparent',
                color: activeFilter === filter ? 'white' : 'text.primary',
                minWidth: 'fit-content',
                '&:hover': {
                  backgroundColor: activeFilter === filter ? '#008035' : 'rgba(0,154,62,0.05)'
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Employers Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3
        }}
      >
        {currentEmployers.map((employer) => (
          <Paper
            key={employer.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)',
                borderColor: '#009a3e'
              }
            }}
          >
            {/* Featured badge */}
            {employer.isFeatured && (
              <Box sx={{ position: 'absolute', top: -8, left: 16 }}>
                <Chip 
                  label="NỔI BẬT" 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#009a3e', 
                    color: 'white',
                    fontSize: 10,
                    height: 20,
                    fontWeight: 600
                  }} 
                />
              </Box>
            )}

            {/* Company header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={employer.logo} 
                variant="rounded" 
                sx={{ width: 64, height: 64, mr: 2 }} 
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                    {employer.name}
                  </Typography>
                  {employer.isVerified && (
                    <Verified sx={{ fontSize: 18, color: '#009a3e' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {employer.industry}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderStars(employer.rating)}
                  <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                    ({employer.rating})
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Company info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                {employer.description}
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {employer.size}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {employer.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ fontSize: 16, color: '#009a3e', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#009a3e', fontWeight: 600 }}>
                    {employer.openJobs} vị trí đang tuyển
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Benefits */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Phúc lợi nổi bật:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {employer.benefits.slice(0, 3).map((benefit, index) => (
                  <Chip
                    key={index}
                    label={benefit}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontSize: 10,
                      height: 20,
                      borderColor: '#e0e0e0',
                      color: 'text.secondary'
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Action button */}
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#009a3e',
                color: '#009a3e',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#008035',
                  backgroundColor: 'rgba(0,154,62,0.05)'
                }
              }}
            >
              Xem công ty
            </Button>
          </Paper>
        ))}
      </Box>

      {/* Pagination indicator */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Stack direction="row" spacing={1}>
            {Array.from({ length: totalPages }, (_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === currentPage ? '#009a3e' : '#e0e0e0',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default FeaturedEmployersSection;