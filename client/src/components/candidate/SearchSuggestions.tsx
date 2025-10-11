import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  LocalOffer as LocalOfferIcon,
  Star as StarIcon,
  School as SchoolIcon
} from '@mui/icons-material';

interface SearchSuggestionsProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSuggestionClick }) => {
  const theme = useTheme();

  const trendingKeywords = [
    { text: 'ReactJS Developer', count: 234, hot: false },
    { text: 'Backend Node.js', count: 189, hot: false },
    { text: 'UI/UX Designer', count: 156, hot: false },
    { text: 'DevOps Engineer', count: 145, hot: false },
    { text: 'Data Analyst', count: 132, hot: false },
    { text: 'Mobile Developer', count: 128, hot: false },
    { text: 'Product Manager', count: 115, hot: false },
    { text: 'QA Tester', count: 98, hot: false }
  ];

  const categories = [
    { name: 'Công nghệ thông tin', icon: '💻', color: '#2196f3' },
    { name: 'Marketing - Truyền thông', icon: '📢', color: '#ff9800' },
    { name: 'Kinh doanh - Bán hàng', icon: '💼', color: '#4caf50' },
    { name: 'Tài chính - Kế toán', icon: '💰', color: '#9c27b0' },
    { name: 'Thiết kế - Sáng tạo', icon: '🎨', color: '#e91e63' },
    { name: 'Nhân sự - Tuyển dụng', icon: '👥', color: '#00bcd4' }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick?.(suggestion);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${theme.palette.divider}`,
        mt: 3
      }}
    >
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
        p: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            p: 1,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #d32f2f 0%, #1976d2 100%)', // PTIT colors
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUpIcon sx={{ fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Gợi ý tìm kiếm phổ biến
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Trending Keywords */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SearchIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Từ khóa hot nhất tuần
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5,
            mb: 2
          }}>
            {trendingKeywords.map((keyword, index) => (
              <Tooltip 
                key={index}
                title={`Tìm kiếm việc làm: ${keyword.text} (${keyword.count} việc làm)`}
                placement="top"
              >
                <Chip
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {keyword.hot && <StarIcon sx={{ fontSize: 14, color: '#ff9800' }} />}
                      <span>{keyword.text}</span>
                      <Box component="span" sx={{
                        ml: 0.5,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                        background: 'rgba(255,255,255,0.9)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: keyword.hot ? '#d32f2f' : '#666'
                      }}>
                        {keyword.count}
                      </Box>
                    </Box>
                  }
                  onClick={() => handleSuggestionClick(keyword.text)}
                  sx={{
                    background: keyword.hot 
                      ? 'linear-gradient(135deg, #d32f2f 0%, #1976d2 100%)'
                      : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    color: keyword.hot ? 'white' : 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 40,
                    px: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      background: keyword.hot
                        ? 'linear-gradient(135deg, #b71c1c 0%, #1565c0 100%)'
                        : 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: keyword.hot
                        ? '0 4px 12px rgba(211, 47, 47, 0.3)'
                        : '0 4px 12px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Popular Categories */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LocalOfferIcon sx={{ color: '#1976d2', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Danh mục nghề nghiệp nổi bật
            </Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 2
          }}>
            {categories.map((category, index) => (
              <Card
                key={index}
                onClick={() => handleSuggestionClick(category.name)}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(category.color, 0.05)} 0%, #ffffff 100%)`,
                  border: `2px solid ${alpha(category.color, 0.1)}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: alpha(category.color, 0.3),
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(category.color, 0.2)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Background decoration */}
                <Box sx={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  width: 80,
                  height: 80,
                  background: alpha(category.color, 0.08),
                  borderRadius: '50%'
                }} />

                <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      fontSize: '2rem',
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      background: alpha(category.color, 0.1)
                    }}>
                      {category.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={600}
                        sx={{ 
                          color: category.color,
                          lineHeight: 1.3
                        }}
                      >
                        {category.name}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchSuggestions;