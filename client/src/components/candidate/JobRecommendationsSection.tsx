import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  IconButton, 
  Button,
  Stack,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  MonetizationOn,
  Work,
  BookmarkBorder,
  Bookmark,
  AccessTime,
  TrendingUp,
  ArrowForward,
  FilterList
} from '@mui/icons-material';

// Mock data for job recommendations
const mockRecommendedJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Solutions Vietnam',
    companyLogo: 'https://via.placeholder.com/48',
    salary: '25 - 35 triệu',
    location: 'Hà Nội',
    experience: '3+ năm',
    matchPercentage: 95,
    isNew: true,
    isFeatured: true,
    postedTime: '2 giờ trước',
    tags: ['React', 'TypeScript', 'Remote']
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'Startup Innovation Hub',
    companyLogo: 'https://via.placeholder.com/48',
    salary: '20 - 30 triệu',
    location: 'TP.HCM',
    experience: '2+ năm',
    matchPercentage: 88,
    isNew: false,
    isFeatured: false,
    postedTime: '1 ngày trước',
    tags: ['Vue.js', 'JavaScript', 'CSS']
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Digital Agency Pro',
    companyLogo: 'https://via.placeholder.com/48',
    salary: '18 - 28 triệu',
    location: 'Đà Nẵng',
    experience: '2+ năm',
    matchPercentage: 82,
    isNew: true,
    isFeatured: false,
    postedTime: '3 giờ trước',
    tags: ['Node.js', 'React', 'MongoDB']
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Creative Studio X',
    companyLogo: 'https://via.placeholder.com/48',
    salary: '15 - 25 triệu',
    location: 'TP.HCM',
    experience: '1+ năm',
    matchPercentage: 75,
    isNew: false,
    isFeatured: true,
    postedTime: '5 giờ trước',
    tags: ['Figma', 'Adobe XD', 'Design']
  }
];

const filterOptions = ['Tất cả', 'Phù hợp nhất', 'Mới nhất', 'Lương cao'];

const JobRecommendationsSection: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const toggleSaveJob = (jobId: number) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#ff9800';
    return '#2196f3';
  };

  return (
    <Box sx={{ mt: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Gợi ý việc làm phù hợp
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dựa trên hồ sơ và sở thích của bạn
          </Typography>
        </Box>
        <Button
          endIcon={<ArrowForward />}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600,
            color: '#009a3e',
            '&:hover': { backgroundColor: 'rgba(0,154,62,0.05)' }
          }}
        >
          Xem tất cả
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterList sx={{ color: 'text.secondary', mr: 1 }} />
          {filterOptions.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: activeFilter === filter ? '#009a3e' : 'transparent',
                color: activeFilter === filter ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: activeFilter === filter ? '#008035' : 'rgba(0,154,62,0.05)'
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Jobs Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3
        }}
      >
        {mockRecommendedJobs.map((job) => (
          <Paper
            key={job.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {/* Status badges */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
              {job.isNew && (
                <Chip 
                  label="MỚI" 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2',
                    fontSize: 10,
                    height: 20
                  }} 
                />
              )}
              {job.isFeatured && (
                <Chip 
                  label="NỔI BẬT" 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#fff3e0', 
                    color: '#f57c00',
                    fontSize: 10,
                    height: 20
                  }} 
                />
              )}
            </Box>

            {/* Company info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={job.companyLogo} 
                variant="rounded" 
                sx={{ width: 48, height: 48, mr: 2 }} 
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company}
                </Typography>
              </Box>
              <IconButton
                onClick={() => toggleSaveJob(job.id)}
                sx={{ 
                  color: savedJobs.has(job.id) ? '#009a3e' : 'text.secondary',
                  '&:hover': { backgroundColor: 'rgba(0,154,62,0.05)' }
                }}
              >
                {savedJobs.has(job.id) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Box>

            {/* Job details */}
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MonetizationOn sx={{ fontSize: 16, color: '#009a3e', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {job.salary}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Work sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.experience}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {job.postedTime}
                  </Typography>
                </Box>
                <Tooltip title={`Độ phù hợp: ${job.matchPercentage}%`}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ fontSize: 16, color: getMatchColor(job.matchPercentage), mr: 0.5 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: getMatchColor(job.matchPercentage)
                      }}
                    >
                      {job.matchPercentage}%
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            </Stack>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {job.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: 11,
                    height: 24,
                    borderColor: '#e0e0e0',
                    color: 'text.secondary'
                  }}
                />
              ))}
            </Box>

            {/* Action button */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#009a3e',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#008035' }
              }}
            >
              Ứng tuyển ngay
            </Button>
          </Paper>
        ))}
      </Box>

      {/* Load more button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#009a3e',
            color: '#009a3e',
            px: 4,
            '&:hover': {
              borderColor: '#008035',
              backgroundColor: 'rgba(0,154,62,0.05)'
            }
          }}
        >
          Xem thêm việc làm
        </Button>
      </Box>
    </Box>
  );
};

export default JobRecommendationsSection;