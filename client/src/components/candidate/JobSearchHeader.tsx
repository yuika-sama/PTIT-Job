import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Container
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon
} from '@mui/icons-material';

interface JobSearchHeaderProps {
  onSearch?: (searchParams: {
    category: string;
    keyword: string;
    location: string;
  }) => void;
}

const JobSearchHeader: React.FC<JobSearchHeaderProps> = ({ onSearch }) => {
  const [category, setCategory] = React.useState('Danh mục Nghề');
  const [keyword, setKeyword] = React.useState('');
  const [location, setLocation] = React.useState('Địa điểm');

  const categories = [
    'Danh mục Nghề',
    'IT - Phần mềm',
    'Marketing',
    'Kế toán',
    'Sales - Bán hàng',
    'Nhân sự',
    'Chăm sóc khách hàng',
    'Xây dựng',
    'Giáo dục',
    'Y tế'
  ];

  const locations = [
    'Địa điểm',
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ'
  ];

  const handleSearch = () => {
    onSearch?.({
      category: category === 'Danh mục Nghề' ? '' : category,
      keyword,
      location: location === 'Địa điểm' ? '' : location
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        {/* Header Text */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1
            }}
          >
            Tuyển dụng 53.454 việc làm [Update 10/10/2025]
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 2
            }}
          >
            Trang chủ &gt; Tuyển dụng 53.454 việc làm 2025 [Update 10/10/2025]
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            Xem việc làm tại:{' '}
            <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
              Hà Nội | Hồ Chí Minh | Chọn tỉnh thành của tôi →
            </Box>
          </Typography>
        </Box>

        {/* Search Form */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'stretch',
            backgroundColor: 'white',
            borderRadius: 2,
            p: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {/* Category Dropdown */}
          <TextField
            select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': { border: 'none' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkIcon sx={{ color: '#666' }} />
                </InputAdornment>
              )
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Search Input */}
          <TextField
            placeholder="Vị trí tuyển dụng"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': { border: 'none' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              )
            }}
          />

          {/* Location Dropdown */}
          <TextField
            select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': { border: 'none' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: '#666' }} />
                </InputAdornment>
              )
            }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              px: 4,
              minHeight: 56,
              fontWeight: 600,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#2e7d32'
              }
            }}
          >
            Tìm kiếm
          </Button>
        </Box>

        {/* Notification Button */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white'
              }
            }}
          >
            🔔 Tạo thông báo việc làm
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default JobSearchHeader;