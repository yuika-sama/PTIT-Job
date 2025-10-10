import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import {
  Search
} from '@mui/icons-material';

interface CompaniesPageHeaderProps {
  currentTab: number;
  searchTerm: string;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

const CompaniesPageHeader: React.FC<CompaniesPageHeaderProps> = ({
  currentTab,
  searchTerm,
  onTabChange,
  onSearchTermChange,
  onSearch
}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Illustration */}
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
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Tabs */}
          <Tabs
            value={currentTab}
            onChange={onTabChange}
            sx={{ 
              mb: 4,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16,
                color: '#666',
                '&.Mui-selected': {
                  color: '#009a3e'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#009a3e',
                height: 3
              }
            }}
          >
            <Tab label="Danh sách công ty" />
            <Tab label="Top công ty" />
          </Tabs>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#009a3e' }}>
            Khám phá 100.000+ công ty nổi bật
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#666', maxWidth: 600 }}>
            Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn
          </Typography>
          
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
              placeholder="Nhập tên công ty"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
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
              onClick={onSearch}
              sx={{
                backgroundColor: '#009a3e',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': { backgroundColor: '#008035' }
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CompaniesPageHeader;