import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItemButton,
  IconButton,
  useTheme,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { JobCategory } from '../../services/types';
import { useNavigate } from 'react-router-dom';

interface CategoryListProps {
  categories?: JobCategory[];
  pageSize?: number;
}

// Fallback categories with slugs for navigation
const FALLBACK_CATEGORIES = [
  { name: 'Kinh doanh/Bán hàng', slug: 'kinh-doanh-ban-hang', icon: '💼', color: '#2196f3' },
  { name: 'Marketing/PR/Quảng cáo', slug: 'marketing-pr-quang-cao', icon: '📢', color: '#ff9800' },
  { name: 'Chăm sóc khách hàng', slug: 'cham-soc-khach-hang', icon: '🎧', color: '#4caf50' },
  { name: 'Nhân sự/Hành chính/Pháp chế', slug: 'nhan-su-hanh-chinh-phap-che', icon: '👥', color: '#9c27b0' },
  { name: 'Công nghệ Thông tin', slug: 'cong-nghe-thong-tin', icon: '💻', color: '#00bcd4' },
  { name: 'Lao động phổ thông', slug: 'lao-dong-pho-thong', icon: '🔧', color: '#795548' },
  { name: 'Tài chính/Kế toán', slug: 'tai-chinh-ke-toan', icon: '💰', color: '#4caf50' },
  { name: 'Thiết kế/Sáng tạo', slug: 'thiet-ke-sang-tao', icon: '🎨', color: '#e91e63' },
  { name: 'Logistics/XNK', slug: 'logistics-xnk', icon: '🚚', color: '#607d8b' },
  { name: 'Giáo dục/Đào tạo', slug: 'giao-duc-dao-tao', icon: '📚', color: '#3f51b5' },
  { name: 'Y tế/Chăm sóc sức khoẻ', slug: 'y-te-cham-soc-suc-khoe', icon: '🏥', color: '#f44336' },
  { name: 'Bất động sản', slug: 'bat-dong-san', icon: '🏠', color: '#ff5722' }
];

const CategoryList: React.FC<CategoryListProps> = ({
  categories = [],
  pageSize = 6
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const displayCategories = categories.length > 0 
    ? categories.map((cat, index) => ({
        name: cat.name,
        slug: cat.slug || `category-${cat.id}`,
        icon: cat.icon_url,
        color: FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length]?.color || theme.palette.primary.main,
        jobCount: cat.job_count || 0
      }))
    : [];

  const totalPages = Math.ceil(displayCategories.length / pageSize);
  const pagedCategories = displayCategories.slice(page * pageSize, page * pageSize + pageSize);

  const handlePrev = () => setPage(p => (p > 0 ? p - 1 : p));
  const handleNext = () => setPage(p => (p < totalPages - 1 ? p + 1 : p));

  const handleCategoryClick = (category: typeof displayCategories[0]) => {
    setSelectedCategory(category.name);
    
    // Navigate to job-search page with category parameter
    const searchParams = new URLSearchParams();
    searchParams.set('category', category.slug);
    searchParams.set('categoryName', category.name);
    
    navigate(`/candidate/job-search?${searchParams.toString()}`);
  };

  const getRandomJobCount = () => {
    return Math.floor(Math.random() * 1000) + 50;
  };

  return (
    <Paper sx={{ 
      flex: '1 1 320px', 
      maxWidth: 360, 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: 4, 
      overflow: 'hidden',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)'
      },
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <CategoryIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Ngành nghề hot
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {displayCategories.length} danh mục
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Category List */}
      <List dense disablePadding sx={{ flex: 1 }}>
        {pagedCategories.map((cat, index) => {
          const selected = cat.name === selectedCategory;
          const jobCount = getRandomJobCount();
          
          return (
            <ListItemButton
              key={cat.name}
              onClick={() => handleCategoryClick(cat)}
              sx={{ 
                py: 2, 
                px: 3,
                borderBottom: index < pagedCategories.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                bgcolor: selected ? `${cat.color}08` : 'transparent',
                position: 'relative',
                '&:hover': {
                  bgcolor: `${cat.color}04`,
                  '& .category-arrow': {
                    transform: 'translateX(4px)',
                    color: cat.color
                  },
                  '& .category-icon': {
                    transform: 'scale(1.1)'
                  }
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                {/* Category Icon */}
                <Box 
                  className="category-icon"
                  sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `${cat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <img src={cat.icon ?? undefined} alt={cat.name} width='40px' height='40px'/>
                </Box>

                {/* Category Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: selected ? 700 : 600,
                      color: selected ? cat.color : 'text.primary',
                      lineHeight: 1.3,
                      mb: 0.5
                    }}
                  >
                    {cat.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${cat.jobCount} công việc`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        backgroundColor: `${cat.color}10`,
                        color: cat.color,
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Arrow */}
                <ArrowForwardIosIcon 
                  className="category-arrow"
                  sx={{ 
                    fontSize: 16, 
                    color: selected ? cat.color : 'text.disabled',
                    transition: 'all 0.2s ease'
                  }} 
                />
              </Box>
            </ListItemButton>
          );
        })}
      </List>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'grey.50'
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Trang {page + 1} / {totalPages}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Trang trước">
              <IconButton 
                size="small" 
                onClick={handlePrev} 
                disabled={page === 0}
                sx={{
                  color: theme.palette.primary.main,
                  '&:disabled': {
                    color: 'text.disabled'
                  }
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Trang sau">
              <IconButton 
                size="small" 
                onClick={handleNext} 
                disabled={page === totalPages - 1}
                sx={{
                  color: theme.palette.primary.main,
                  '&:disabled': {
                    color: 'text.disabled'
                  }
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* CSS for animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Paper>
  );
};

export default CategoryList;