import React from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import { JobCategory, Location } from '../../services/types';
import { useSearchJobs } from '../../hooks/useApi';
import SearchBar from './SearchBar';
import CategoryList from './CategoryList';
import HeroBanner from './HeroBanner';
import StatsBar from './StatsBar';
import SearchSuggestions from './SearchSuggestions';

interface SearchSectionProps {
  locations?: Location[];
  categories?: JobCategory[];
  isLoading?: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  locations = [],
  categories = [],
  isLoading = false
}) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<JobCategory | null>(null);
  const [searchKeyword, setSearchKeyword] = React.useState<string>('');
  
  const { searchJobs, loading: searchLoading, error: searchError } = useSearchJobs();

  const handleSearch = async (params: { keyword: string; locationId?: number }) => {
    const searchCriteria = {
      title: params.keyword || undefined,
      location_id: params.locationId,
      category_id: selectedCategory ? parseInt(selectedCategory.id) : undefined,
    };

    try {
      await searchJobs(searchCriteria);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setSearchKeyword(keyword);
    const searchParams = new URLSearchParams({ categorySlug: keyword });
    window.location.href = `/candidate/job-search?${searchParams.toString()}`;
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Enhanced Hero Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        py: { xs: 6, sm: 8, md: 10 },
        px: 4,
        background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 25%, #1976d2 50%, #0d47a1 75%, #1a237e 100%)', // Enhanced PTIT gradient
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
        borderBottom: '4px solid rgba(255,255,255,0.1)'
      }}>
        {/* Dynamic Background Layers */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)
          `,
          animation: 'backgroundShift 10s ease-in-out infinite alternate'
        }} />
        
        {/* Geometric Decorations */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 120,
          height: 120,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animation: 'morphing 8s ease-in-out infinite',
          transform: 'rotate(15deg)'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: 'morphing 12s ease-in-out infinite reverse',
          transform: 'rotate(-20deg)'
        }} />
        
        {/* Main Content Container */}
        <Box sx={{ 
          position: 'relative', 
          zIndex: 2,
          maxWidth: '1400px',
          mx: 'auto',
          px: 2
        }}>
          {/* PTIT Brand Logo */}
          <Box sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}>
              {/* Logo Circle */}
              <Box sx={{
              width: { xs: 70, sm: 85, md: 100 },
              height: { xs: 70, sm: 85, md: 100 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 2px 16px rgba(255,255,255,0.1)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'rotate 4s linear infinite'
              }
              }}>
              <img 
                src="https://bizweb.dktcdn.net/thumb/grande/100/390/135/files/logo-white-circle.png?v=1749438223850" 
                alt="PTIT Logo" 
                style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
                }} 
              />
              </Box>
              
              {/* PTIT Text Brand */}
              <Box sx={{ 
                textAlign: 'left',
                display: { xs: 'none', sm: 'block' }
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { sm: '1.5rem', md: '2rem' },
                    background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2
                  }}
                >
                  PTIT
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { sm: '0.875rem', md: '1rem' },
                    fontWeight: 500,
                    letterSpacing: '1px'
                  }}
                >
                  JOB PORTAL
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Main Heading */}
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem', lg: '4.2rem' },
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ffffff 20%, #e3f2fd 40%, #ffffff 60%, #f3e5f5 80%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: '-0.5px',
              animation: 'textGlow 3s ease-in-out infinite alternate'
            }}
          >
            Khám phá cơ hội nghề nghiệp
            <br />
            <Box component="span" sx={{ 
              background: 'linear-gradient(45deg, #ffeb3b, #ffc107)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '0.9em'
            }}>
              cùng PTIT Job
            </Box>
          </Typography>
          
          {/* Subtitle */}
          <Typography 
            variant="h5" 
            sx={{ 
              opacity: 0.95,
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.4rem' },
              fontWeight: 400,
              lineHeight: 1.5,
              mb: 5,
              maxWidth: '900px',
              mx: 'auto',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Nền tảng việc làm hàng đầu dành cho sinh viên và cựu sinh viên
            <br />
            <Box component="span" sx={{ fontWeight: 600, color: '#ffeb3b' }}>
              Học viện Công nghệ Bưu chính Viễn thông
            </Box>
          </Typography>
          
          {/* Enhanced Feature Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: { xs: 2, sm: 3 },
            mt: 5,
            maxWidth: '1000px',
            mx: 'auto'
          }}>
            {[
              { 
                icon: '🚀', 
                title: 'Cơ hội IT hàng đầu',
                desc: 'Việc làm công nghệ từ startup đến tập đoàn',
                color: '#4fc3f7'
              },
              { 
                icon: '🤝', 
                title: 'Mạng lưới doanh nghiệp',
                desc: 'Kết nối với 2000+ công ty uy tín',
                color: '#81c784'
              },
              { 
                icon: '📈', 
                title: 'Phát triển sự nghiệp',
                desc: 'Định hướng và nâng cao kỹ năng',
                color: '#ffb74d'
              }
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                    borderRadius: '4px 4px 0 0'
                  }
                }}
              >
                <Box sx={{ 
                  fontSize: '2.5rem', 
                  mb: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 1,
                    color: feature.color,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    lineHeight: 1.4,
                    fontSize: { xs: '0.875rem', sm: '0.9rem' }
                  }}
                >
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Enhanced CSS Animations */}
        <style>
          {`
            @keyframes backgroundShift {
              0% { opacity: 0.8; transform: translateX(0); }
              100% { opacity: 1; transform: translateX(10px); }
            }
            @keyframes morphing {
              0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
              50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes textGlow {
              0% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
              100% { filter: drop-shadow(0 0 15px rgba(255,255,255,0.5)); }
            }
          `}
        </style>
      </Box>

      {/* Search Bar */}
      <SearchBar 
        locations={locations}
        onSearch={handleSearch}
        isLoading={searchLoading}
        initialKeyword={searchKeyword}
      />

      {/* Search Results Preview */}
      {searchError && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="error">
            Lỗi tìm kiếm: {searchError}
          </Typography>
        </Box>
      )}

      {/* Active category filter display */}
      {selectedCategory && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Bộ lọc:</Typography>
          <Chip 
            label={`🏢 ${selectedCategory.name}`}
            size="small" 
            onDelete={handleClearCategory}
            sx={{ backgroundColor: `${theme.palette.secondary.main}08` }}
          />
        </Box>
      )}

      {/* Search Suggestions */}
      <Box sx={{ mb: 3 }}>
        <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Category List */}
        <CategoryList categories={categories} />

        {/* Right Content */}
        <Box sx={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Hero Banner */}
          <HeroBanner onPlayVideo={() => console.log('Play video')} />

          {/* Stats Bar */}
          <StatsBar onRefresh={() => console.log('Refresh stats')} />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchSection;
