import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Avatar,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../services/types';

interface JobsGridSectionProps {
  jobs?: Job[];
  isLoading?: boolean;
  maxJobs?: number;
}

interface JobItem {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  tags: string[];
  isTop?: boolean;
  logo?: string | null;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  uniqueKey?: string;
}

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

const PAGE_SIZE = 12; // Limit 12 jobs mỗi trang
const DEFAULT_MAX_JOBS = 36; // Limit mặc định để tránh quá tải

const JobsGridSection: React.FC<JobsGridSectionProps> = ({ 
  jobs = [],
  isLoading = false,
  maxJobs = DEFAULT_MAX_JOBS
}) => {
  const theme = useTheme();
  const [regionFilter, setRegionFilter] = React.useState<RegionFilter>('Tất cả');
  const [page, setPage] = React.useState(0);

  // Limit jobs ngay từ đầu để tránh xử lý quá nhiều data
  const limitedJobs = React.useMemo(() => {
    return jobs.slice(0, maxJobs);
  }, [jobs, maxJobs]);

  // Convert Job[] to JobItem[] format với limit data
  const displayJobs: JobItem[] = React.useMemo(() => {
    return limitedJobs.map((job, index) => ({
      id: parseInt(job.id),
      title: job.title,
      company: job.company_name || 'N/A',
      location: job.location_name || 'N/A',
      salary: job.salary_min && job.salary_max 
        ? `${job.salary_min} - ${job.salary_max} ${job.currency || 'VND'}`
        : 'Thoả thuận',
      tags: [job.location_name || 'N/A'],
      region: getRegionByLocation(job.location_name || ''),
      logo: job.company_logo || null,
      uniqueKey: `${job.id}-${index}` // Thêm unique key
    }));
  }, [limitedJobs]);

  const [favorites, setFavorites] = React.useState<Record<number, boolean>>({});

  const handleToggleFav = (id: number) => {
    setFavorites(f => ({ ...f, [id]: !f[id] }));
  };

  // Filter theo region
  const filteredJobs = React.useMemo(() => {
    return regionFilter === 'Tất cả'
      ? displayJobs
      : displayJobs.filter(j => j.region === regionFilter);
  }, [displayJobs, regionFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  
  const currentItems = React.useMemo(() => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, page]);

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

  // Reset page khi jobs thay đổi
  React.useEffect(() => {
    if (page >= totalPages && totalPages > 0) {
      setPage(0);
    }
  }, [limitedJobs.length, page, totalPages]);

  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate('/candidate/jobs');
  }

  if (isLoading) {
    return (
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 3,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200
      }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3,
      borderRadius: 3,
      background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 3
    }}>
      {/* Header Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: theme.palette.primary.main,
          '&::before': {
            content: '""',
            width: 4,
            height: 24,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 2
          }
        }}>
          Việc làm tốt nhất
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo vùng miền:</InputLabel>
          <Select
            label="Lọc theo vùng miền"
            value={regionFilter === 'Tất cả' ? '' : regionFilter}
            onChange={(e) => setRegionFilter((e.target.value || 'Tất cả') as RegionFilter)}
            renderValue={(selected: string) => {
              if (selected === '') {
                return <Typography color="text.secondary">Vùng miền</Typography>;
              }
              return selected;
            }}
          >
            {REGIONS.filter(r => r !== 'Tất cả').map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        {filteredJobs.length > PAGE_SIZE && (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
              Trang {page + 1} / {totalPages}
            </Typography>
          </>
        )}
        <Button size="small" variant="text">Xem tất cả</Button>
        <IconButton 
          size="small" 
          onClick={handlePrev}
          disabled={page === 0 || totalPages <= 1}
          sx={{ 
            color: theme.palette.primary.main,
            '&:hover': { bgcolor: `${theme.palette.primary.main}08` }
          }}
        >
          <ArrowBackIosNewIcon fontSize="inherit" />
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
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Region Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
        {REGIONS.map(r => {
          const active = r === regionFilter;
          // Đếm số jobs theo vùng miền
          const jobCount = r === 'Tất cả' 
            ? displayJobs.length 
            : displayJobs.filter(job => job.region === r).length;
          
          return (
            <Chip
              key={r}
              label={`${r} (${jobCount})`}
              onClick={() => setRegionFilter(r)}
              color={active ? 'success' : undefined}
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

      {/* Suggestion bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        px: 2,
        mb: 2,
        borderRadius: 2,
        bgcolor: 'rgba(25,118,210,0.06)',
        fontSize: 13
      }}>
        <TuneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary">
          {filteredJobs.length > 0 
            ? `Hiển thị ${currentItems.length} / ${filteredJobs.length} việc làm ${regionFilter !== 'Tất cả' ? `tại ${regionFilter}` : 'trên toàn quốc'}. Di chuột vào tiêu đề việc làm để xem thêm thông tin chi tiết`
            : `Không có việc làm nào ${regionFilter !== 'Tất cả' ? `tại ${regionFilter}` : ''}. Hãy thử chọn vùng miền khác.`
          }
        </Typography>
      </Box>

      {/* Jobs Grid */}
      <Box sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))'
      }}>
        {currentItems.map(job => {
          const fav = favorites[job.id];
            return (
              <Paper
                key={job.uniqueKey || `job-${job.id}`}
                variant="outlined"
                sx={{
                  position: 'relative',
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  borderRadius: 3,
                  transition: 'all .18s ease',
                  '&:hover': {
                    boxShadow: 3,
                    borderColor: 'primary.light'
                  }
                }}
              >
                {/* Logo & favorite */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  {job.logo && job.logo.startsWith('http') ? (
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'white',
                        border: '1px solid #808080',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={job.logo}
                        alt={job.title}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ) : (
                    <Avatar sx={{ width: 44, height: 44, bgcolor: 'grey.100', fontSize: 14, fontWeight: 600 }} variant="rounded">
                      {job.company.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Tooltip title={job.title} arrow disableInteractive>
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
                        onClick={handleCardClick}
                      >
                        {job.title}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: .5 }} noWrap>
                      {job.company}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleToggleFav(job.id)}>
                    {fav ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                </Box>

                {/* Salary & tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {job.salary && (
                    <Chip label={job.salary} size="small" sx={{ fontSize: 11, height: 24 }} />
                  )}
                  {job.tags.map(t => (
                    <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: 11, height: 24 }} />
                  ))}
                </Box>

                {job.isTop && (
                  <Chip
                    label="TOP"
                    size="small"
                    color="success"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      fontSize: 10,
                      fontWeight: 700
                    }}
                  />
                )}
              </Paper>
            );
        })}
      </Box>
    </Paper>
  );
};

export default JobsGridSection;
