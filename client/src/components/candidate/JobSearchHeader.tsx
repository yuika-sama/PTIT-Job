import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Container,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon
} from '@mui/icons-material';

interface JobSearchHeaderProps {
  onSearch: (searchParams: SearchParams) => void;
  totalJobs?: number;
}

interface SearchParams {
  category: string;
  keyword: string;
  location: string;
}

const JobSearchHeader: React.FC<JobSearchHeaderProps> = ({ 
  onSearch,
  totalJobs = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [category, setCategory] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('all');

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'it', label: 'IT - Phần mềm' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'accounting', label: 'Kế toán' },
    { value: 'sales', label: 'Sales - Bán hàng' },
    { value: 'hr', label: 'Nhân sự' },
    { value: 'customer-service', label: 'Chăm sóc khách hàng' },
    { value: 'construction', label: 'Xây dựng' },
    { value: 'education', label: 'Giáo dục' },
    { value: 'healthcare', label: 'Y tế' }
  ];

  const locations = [
    { value: 'all', label: 'Tất cả địa điểm' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'ho-chi-minh', label: 'Hồ Chí Minh' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'hai-phong', label: 'Hải Phòng' },
    { value: 'can-tho', label: 'Cần Thơ' },
    { value: 'bien-hoa', label: 'Biên Hòa' },
    { value: 'nha-trang', label: 'Nha Trang' },
    { value: 'hue', label: 'Huế' }
  ];

  const handleSearch = useCallback(() => {
    onSearch({
      category: category === 'all' ? '' : category,
      keyword: keyword.trim(),
      location: location === 'all' ? '' : location
    });
  }, [category, keyword, location, onSearch]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setCategory('all');
    setKeyword('');
    setLocation('all');
    onSearch({ category: '', keyword: '', location: '' });
  };

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        py: { xs: 3, md: 4 },
        px: 2
      }}
    >
      <Container maxWidth="lg">
        {/* Header Text */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1
            }}
          >
            Tuyển dụng {totalJobs.toLocaleString()} việc làm
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: { xs: 1, md: 2 }
            }}
          >
            Cập nhật: {getCurrentDate()}
          </Typography>
          {!isMobile && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Xem việc làm tại:{' '}
              <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
                Hà Nội | Hồ Chí Minh | Đà Nẵng
              </Box>
            </Typography>
          )}
        </Box>

        {/* Search Form */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 1.5, md: 1 },
            alignItems: 'stretch',
            backgroundColor: 'white',
            borderRadius: 2,
            p: { xs: 1.5, md: 1 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {/* Category Dropdown */}
          <TextField
            select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              minWidth: { xs: '100%', md: 200 },
              '& .MuiOutlinedInput-root': {
                border: 'none',
                backgroundColor: { xs: theme.palette.grey[50], md: 'transparent' },
                '& fieldset': { border: 'none' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              )
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Search Input */}
          <TextField
            placeholder="Vị trí tuyển dụng, từ khóa..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                border: 'none',
                backgroundColor: { xs: theme.palette.grey[50], md: 'transparent' },
                '& fieldset': { border: 'none' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              )
            }}
          />

          {/* Location Dropdown */}
          <TextField
            select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              minWidth: { xs: '100%', md: 150 },
              '& .MuiOutlinedInput-root': {
                border: 'none',
                backgroundColor: { xs: theme.palette.grey[50], md: 'transparent' },
                '& fieldset': { border: 'none' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              )
            }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.value} value={loc.value}>
                {loc.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1,
              flexDirection: { xs: 'row', md: 'row' }
            }}
          >
            {/* Search Button */}
            <Button
              variant="contained"
              onClick={handleSearch}
              fullWidth={isMobile}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                px: { xs: 3, md: 4 },
                minHeight: { xs: 40, md: 56 },
                fontWeight: 600,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              Tìm kiếm
            </Button>

            {/* Clear Button */}
            {(category !== 'all' || keyword || location !== 'all') && (
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{
                  minWidth: { xs: 80, md: 100 },
                  minHeight: { xs: 40, md: 56 },
                  borderColor: theme.palette.grey[300],
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    borderColor: theme.palette.grey[400],
                    backgroundColor: theme.palette.grey[50]
                  }
                }}
              >
                Xóa
              </Button>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {(category !== 'all' || keyword || location !== 'all') && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Đang tìm kiếm:{' '}
              {category !== 'all' && (
                <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
                  {categories.find(c => c.value === category)?.label}
                </Box>
              )}
              {keyword && (
                <>
                  {category !== 'all' && ' • '}
                  <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
                    "{keyword}"
                  </Box>
                </>
              )}
              {location !== 'all' && (
                <>
                  {(category !== 'all' || keyword) && ' • '}
                  <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
                    {locations.find(l => l.value === location)?.label}
                  </Box>
                </>
              )}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default JobSearchHeader;