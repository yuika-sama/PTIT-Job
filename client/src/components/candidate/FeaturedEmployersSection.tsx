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
  Divider,
  Skeleton
} from '@mui/material';
import {
  Business,
  LocationOn,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Star,
  Verified,
  Work
} from '@mui/icons-material';
import { Company } from '../../services/types';
import { useNavigate } from 'react-router-dom';

const industryFilters = ['Tất cả', 'Công nghệ', 'Tài chính', 'Bất động sản', 'Sản xuất', 'Thương mại'];

interface FeaturedEmployersSectionProps {
  companies?: Company[];
  isLoading?: boolean;
}

const FeaturedEmployersSection: React.FC<FeaturedEmployersSectionProps> = ({ 
  companies = [], 
  isLoading = false 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const navigate = useNavigate();
  const itemsPerPage = 3;
  companies.sort((a, b) => (b.jobs_count || 0) - (a.jobs_count || 0));
  
  const featuredCompanies = companies.slice(0, 6);
  
  const filteredEmployers = activeFilter === 'Tất cả' 
    ? featuredCompanies 
    : featuredCompanies;
  
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

  const handleCompanyClick = (companyId: string) => {
    navigate(`/candidate/companies/${companyId}`);
  };

  const getRandomRating = () => (Math.random() * 2 + 3.5).toFixed(1);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        sx={{
          fontSize: 16,
          color: index < Math.floor(rating) ? '#ffc107' : '#e0e0e0'
        }}
      />
    ));
  };

  if (isLoading) {
    return (
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Skeleton variant="text" width={300} height={40} />
            <Skeleton variant="text" width={400} height={24} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1}>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width={80} height={32} />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {[...Array(3)].map((_, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Stack>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
            Các nhà tuyển dụng nổi bật
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Khám phá những công ty hàng đầu đang tuyển dụng
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 0 || totalPages <= 1}
            sx={{ 
              border: '1px solid #e0e0e0',
              background: 'linear-gradient(45deg, rgba(25,118,210,0.1) 30%, rgba(66,165,245,0.1) 90%)',
              '&:hover': { 
                background: 'linear-gradient(45deg, rgba(25,118,210,0.2) 30%, rgba(66,165,245,0.2) 90%)',
              },
              '&:disabled': { opacity: 0.5 }
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1 || totalPages <= 1}
            sx={{ 
              border: '1px solid #e0e0e0',
              background: 'linear-gradient(45deg, rgba(25,118,210,0.1) 30%, rgba(66,165,245,0.1) 90%)',
              '&:hover': { 
                background: 'linear-gradient(45deg, rgba(25,118,210,0.2) 30%, rgba(66,165,245,0.2) 90%)',
              },
              '&:disabled': { opacity: 0.5 }
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
          <Button
            endIcon={<ArrowForward />}
            onClick={() => navigate('/candidate/companies')}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              color: '#1976d2',
              background: 'linear-gradient(45deg, rgba(25,118,210,0.1) 30%, rgba(66,165,245,0.1) 90%)',
              borderRadius: 3,
              px: 3,
              py: 1,
              '&:hover': { 
                background: 'linear-gradient(45deg, rgba(25,118,210,0.2) 30%, rgba(66,165,245,0.2) 90%)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Xem tất cả
          </Button>
        </Box>
      </Box>

      {/* Companies Grid */}
      {currentEmployers.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {currentEmployers.map((company) => {
            const rating = parseFloat(getRandomRating());
            
            return (
              <Paper
                key={company.id}
                elevation={0}
                onClick={() => handleCompanyClick(company.id)}
                sx={{
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  cursor: 'pointer',
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #1976d2'
                  }
                }}
              >
                {/* Verified Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Verified sx={{ fontSize: 14 }} />
                </Box>

                {/* Company Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src={company.logo_url}
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      mx: 'auto', 
                      mb: 2,
                      border: '3px solid #e0e0e0',
                      background: 'white'
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: '#1976d2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {company.company_size || 'Quy mô công ty'}
                  </Typography>
                  
                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                    {renderStars(rating)}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {rating}
                    </Typography>
                  </Box>
                </Box>

                {/* Company Info */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                      minHeight: 36
                    }}
                  >
                    {company.description || 'Mô tả công ty sẽ được cập nhật sớm...'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Company Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'primary.50', borderRadius: 2 }}>
                    <Work sx={{ color: 'primary.main', mb: 0.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {company.job_count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Việc làm
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'secondary.50', borderRadius: 2 }}>
                    <LocationOn sx={{ color: 'secondary.main', mb: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                      {company.address ? company.address : 'Việt Nam'}
                    </Typography>
                  </Box>
                </Box>

                {/* Website Link */}
                {company.website && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Business />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(company.website, '_blank');
                    }}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        borderColor: '#1565c0',
                        backgroundColor: 'rgba(25,118,210,0.05)'
                      }
                    }}
                  >
                    Xem website
                  </Button>
                )}
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            border: '1px solid #e0e0e0',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
            Chưa có nhà tuyển dụng nổi bật
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy khám phá các công ty tuyển dụng khác hoặc quay lại sau để xem thêm
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/candidate/companies')}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              borderRadius: 3
            }}
          >
            Khám phá công ty
          </Button>
        </Paper>
      )}    
    </Box>
  );
};

export default FeaturedEmployersSection;