import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  CircularProgress,
  Chip
} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Company } from '../../services/types';

const thuongHieuLonBg = new URL('../../assets/thuong_hieu_lon_bg.jpg', import.meta.url).href;

interface CompaniesSectionProps {
  companies?: Company[];
  isLoading?: boolean;
  maxCompanies?: number;
}

interface CompanyItem {
  id: number;
  name: string;
  category: string;
  jobs: number;
  logo?: string | null;
  sector: string;
  location: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  uniqueKey?: string;
}

const PAGE_SIZE = 8; 
const DEFAULT_MAX_COMPANIES = 24; 

const REGIONS = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'] as const;
type RegionFilter = typeof REGIONS[number];

const MIEN_BAC = [
  'Hà Nội', 'Hải Phòng', 'Hải Dương', 'Hưng Yên', 'Thái Bình', 'Nam Định', 'Ninh Bình',
  'Vĩnh Phúc', 'Bắc Ninh', 'Quảng Ninh', 'Lạng Sơn', 'Cao Bằng', 'Bắc Kạn', 'Thái Nguyên',
  'Phú Thọ', 'Tuyên Quang', 'Lào Cai', 'Yên Bái', 'Hà Giang', 'Điện Biên', 'Lai Châu',
  'Sơn La', 'Hòa Bình', 'Hà Nam', 'Bắc Giang'
];

const MIEN_TRUNG = [
  'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế',
  'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
  'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'
];

const MIEN_NAM = [
  'Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Tây Ninh', 'Bình Phước',
  'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang',
  'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau'
];

// Function để xác định vùng miền của một tỉnh thành
const getRegionByLocation = (location: string): 'Miền Bắc' | 'Miền Trung' | 'Miền Nam' => {
  const normalizedLocation = location.trim();
  
  if (MIEN_BAC.some(province => normalizedLocation.includes(province))) {
    return 'Miền Bắc';
  }
  if (MIEN_TRUNG.some(province => normalizedLocation.includes(province))) {
    return 'Miền Trung';
  }
  if (MIEN_NAM.some(province => normalizedLocation.includes(province))) {
    return 'Miền Nam';
  }
  
  // Fallback: nếu không match được, xem theo từ khóa chính
  if (normalizedLocation.includes('Hà Nội') || normalizedLocation.includes('Hải Phòng')) {
    return 'Miền Bắc';
  }
  if (normalizedLocation.includes('Đà Nẵng') || normalizedLocation.includes('Huế')) {
    return 'Miền Trung';
  }
  if (normalizedLocation.includes('Hồ Chí Minh') || normalizedLocation.includes('TP.HCM') || normalizedLocation.includes('Sài Gòn')) {
    return 'Miền Nam';
  }
  
  return 'Miền Bắc'; // Default fallback
}; 

const CompaniesSection: React.FC<CompaniesSectionProps> = ({ 
  companies = [],
  isLoading = false,
  maxCompanies = DEFAULT_MAX_COMPANIES
}) => {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [regionFilter, setRegionFilter] = React.useState<RegionFilter>('Tất cả');

  const limitedCompanies = React.useMemo(() => {
    return companies.slice(0, maxCompanies);
  }, [companies, maxCompanies]);

  const displayCompanies: CompanyItem[] = React.useMemo(() => {
    const sortedLimitedCompanies = limitedCompanies.sort((a, b) => {
      const jobCountA = a.job_count || 0;
      const jobCountB = b.job_count || 0;
      return jobCountB - jobCountA;
    });
    return sortedLimitedCompanies.map((company, index) => {
      const jobCount = company.job_count || 0;
      const location = company.address || 'Không xác định';
      
      if (company.job_count === undefined) {
        console.warn(`Company ${company.name} (ID: ${company.id}) missing job_count`);
      }
      
      return {
        id: parseInt(company.id),
        name: company.name,
        category: company.description || 'N/A',
        jobs: jobCount,
        logo: company.logo_url || null,
        location: location,
        region: getRegionByLocation(location),
        sector: 'all',
        uniqueKey: `${company.id}-${index}`
      };
    });
  }, [limitedCompanies]);

  // Thống kê tổng số việc làm
  const totalJobs = React.useMemo(() => {
    return displayCompanies.reduce((total, company) => total + company.jobs, 0);
  }, [displayCompanies]);

  // Filter theo region
  const filteredCompanies = React.useMemo(() => {
    return regionFilter === 'Tất cả'
      ? displayCompanies
      : displayCompanies.filter(c => c.region === regionFilter);
  }, [displayCompanies, regionFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);
  
  const currentItems = React.useMemo(() => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, page]);

  const handlePrev = React.useCallback(() => {
    setPage(prevPage => Math.max(0, prevPage - 1));
  }, []);
  
  const handleNext = React.useCallback(() => {
    setPage(prevPage => Math.min(totalPages - 1, prevPage + 1));
  }, [totalPages]);

  // Reset page khi filter thay đổi
  React.useEffect(() => {
    setPage(0);
  }, [regionFilter]);

  // Reset page khi companies thay đổi
  React.useEffect(() => {
    if (page >= totalPages && totalPages > 0) {
      setPage(0);
    }
  }, [limitedCompanies.length, page, totalPages]);

  // Debug: Log để kiểm tra duplicate
  React.useEffect(() => {
    const ids = currentItems.map(item => item.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn('Duplicate company IDs detected in currentItems:', ids);
    }
  }, [currentItems]);

  if (isLoading) {
    return (
      <Box sx={{ mb: 5 }}>
        <Paper sx={{
          p: 3,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200
        }}>
          <CircularProgress />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Paper sx={{
        mb: 2,
        p: 3,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderRadius: 4,
        backgroundImage: `
          linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}),
          url(${thuongHieuLonBg})

        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        overflow: 'hidden',
        boxShadow: `0 8px 32px ${theme.palette.primary.main}30`
      }}>
        <Box sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          background: `${theme.palette.secondary.main}30`,
          borderRadius: '50%'
        }} />
        <Typography variant="h5" fontWeight={700} sx={{ position: 'relative', zIndex: 1 }}>
          Thương hiệu lớn tiêu biểu
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: 5000, opacity: .9, position: 'relative', zIndex: 1 }}>
          Hàng trăm thương hiệu lớn tiêu biểu đang tuyển dụng nổi bật tại PTIT Job.
        </Typography>
      </Paper>

      {/* Region Filter Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems:"center", justifyContent: 'space-between', gap: 1.5, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          {REGIONS.map(r => {
            const active = r === regionFilter;
            // Đếm số công ty theo vùng miền
            const companyCount = r === 'Tất cả' 
              ? displayCompanies.length 
              : displayCompanies.filter(company => company.region === r).length;
            
            return (
              <Chip
                key={r}
                label={`${r} (${companyCount})`}
                onClick={() => setRegionFilter(r)}
                color={active ? 'primary' : undefined}
                variant={active ? 'filled' : 'outlined'}
                sx={{ 
                  fontWeight: active ? 600 : 400,
                  ...(active ? {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  } : {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}08`,
                      borderColor: theme.palette.primary.dark,
                    }
                  })
                }}
              />
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2, mt: 1 }}>
          <Box sx={{ flexGrow: 1 }} />
          {filteredCompanies.length > PAGE_SIZE && (
            <>
              <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                Trang {page + 1} / {totalPages}
              </Typography>
              <IconButton 
                size="small" 
                onClick={handlePrev} 
                disabled={page === 0 || totalPages <= 1}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: `${theme.palette.primary.main}08` }
                }}
              >
                <ArrowBackIosNew fontSize="inherit" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleNext} 
                disabled={page >= totalPages - 1 || totalPages <= 1}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: `${theme.palette.primary.main}08` }
                }}
              >
                <ArrowForwardIos fontSize="inherit" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
        gap: 2
      }}>
        {currentItems.map((c: CompanyItem) => (
          <Paper
            key={c.uniqueKey || `company-${c.id}`}
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1.2,
              position: 'relative',
              minHeight: 120, 
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: `${theme.palette.primary.main}30`,
              transition: 'all .18s ease',
              '&:hover': {
                boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {c.logo && c.logo.startsWith('http') ? (
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '8px',
                  bgcolor: `${theme.palette.primary.main}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${theme.palette.primary.main}20`,
                  overflow: 'hidden',
                }}>
                  <img
                    src={c.logo}
                    alt={c.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      objectFit: 'contain',
                      borderRadius: '6px'
                    }}
                  />
                </Box>
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    bgcolor: `${theme.palette.primary.main}10`, 
                    color: theme.palette.primary.main,
                    fontSize: 14, 
                    fontWeight: 600,
                    border: `2px solid ${theme.palette.primary.main}20`
                  }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Tooltip title={c.name} arrow disableInteractive>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {c.name}
                  </Typography>
                </Tooltip>
                <Typography variant="caption" color="text.secondary">
                  {c.category}
                </Typography>
              </Box>
            </Box>
            
            {/* Chip hiển thị địa điểm */}
            <Box sx={{ alignSelf: 'flex-start', mt: 'auto' }}>
              <Chip
                label={c.location}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: 11, 
                  height: 24,
                  maxWidth: '100%',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            </Box>
            
            <Box sx={{ alignSelf: 'flex-start', mt: 'auto' }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                <span role="img" aria-label="jobs">🗂</span> 
                {c.jobs > 0 ? `${c.jobs.toLocaleString('vi-VN')} việc làm` : 'Đang cập nhật'}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default CompaniesSection;
