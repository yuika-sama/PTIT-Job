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
  Tooltip,
  Skeleton
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
  FilterList,
  Star
} from '@mui/icons-material';
import { Job } from '../../services/types';
import { useNavigate } from 'react-router-dom';

const filterOptions = ['Tất cả', 'Phù hợp nhất', 'Mới nhất', 'Lương cao'];

interface JobRecommendationsSectionProps {
  jobs?: Job[];
  isLoading?: boolean;
}

const JobRecommendationsSection: React.FC<JobRecommendationsSectionProps> = ({ 
  jobs = [], 
  isLoading = false 
}) => {
  const navigate = useNavigate();


  const handleJobClick = (jobId: string) => {
    navigate(`/candidate/job/${jobId}`);
  };

  const formatSalary = (minSalary?: number, maxSalary?: number) => {
    if (!minSalary && !maxSalary) return 'Thỏa thuận';
    if (minSalary && maxSalary) {
      return `${minSalary} - ${maxSalary} triệu`;
    }
    if (minSalary) return `Từ ${minSalary} triệu`;
    if (maxSalary) return `Đến ${maxSalary} triệu`;
    return 'Thỏa thuận';
  };

  const recommendedJobs = jobs.slice(0, 6);

  if (isLoading) {
    return (
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1}>
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width={80} height={32} />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {[...Array(6)].map((_, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
                <Skeleton variant="circular" width={40} height={40} />
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
            Gợi ý việc làm phù hợp
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dựa trên hồ sơ và sở thích của bạn
          </Typography>
        </Box>
      </Box>

      {/* Jobs Grid */}
      {recommendedJobs.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {recommendedJobs.map((job) => {
            return (
              <Paper
                key={job.id}
                elevation={0}
                onClick={() => handleJobClick(job.id)}
                sx={{
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  cursor: 'pointer',
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #1976d2'
                  }
                }}
              >

                {/* Header */}
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Avatar
                    src={job.logo_url || 'https://via.placeholder.com/48'}
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      mr: 2,
                      border: '2px solid #e0e0e0' 
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        color: '#1976d2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company_name}
                    </Typography>
                  </Box>
                </Box>

                {/* Job Details */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <MonetizationOn fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{job.location_name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Work fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{job.job_type || 'Full-time'}</Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Description */}
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
                    lineHeight: 1.4
                  }}
                >
                  {job.description || 'Mô tả công việc sẽ được cập nhật sớm...'}
                </Typography>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {new Date(job.created_at).toLocaleDateString('vi-VN') + ' - ' + (new Date(job.expiry_date).toLocaleDateString('vi-VN') || 'N/A')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#ff9800' }}>
                    <Star fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Nổi bật
                    </Typography>
                  </Box>
                </Box>
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
            🔍 Chưa có gợi ý việc làm phù hợp
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy cập nhật hồ sơ của bạn để nhận được những gợi ý việc làm phù hợp nhất
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/candidate/jobs')}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              borderRadius: 3
            }}
          >
            Khám phá việc làm
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default JobRecommendationsSection;