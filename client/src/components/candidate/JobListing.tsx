import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  useTheme
} from '@mui/material';
import {
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  LocationOn as LocationOnIcon,
  BusinessCenter as BusinessCenterIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  location: string;
  experience: string;
  jobType: string;
  postedDate: string;
  isUrgent?: boolean;
  isSaved?: boolean;
  skills?: string[];
  description?: string;
}

interface JobListingProps {
  jobs?: Job[];
  isLoading?: boolean;
  onJobClick?: (jobId: string) => void;
  onSaveJob?: (jobId: string) => void;
  onCompanyClick?: (companyId: string) => void;
}

const JobListing: React.FC<JobListingProps> = ({
  jobs = [],
  isLoading = false,
  onJobClick,
  onSaveJob,
  onCompanyClick
}) => {
  const theme = useTheme();

  // Mock data for demonstration
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Kỹ Sư Công Trình',
      company: {
        id: 'evercon',
        name: 'CÔNG TY TNHH XÂY DỰNG EVERCON',
        logo: '/api/placeholder/60/60'
      },
      salary: {
        min: 12,
        max: 16,
        currency: 'triệu',
        period: 'tháng'
      },
      location: 'Hà Nội',
      experience: '2 năm',
      jobType: 'Kỹ sư xây dựng, Xây dựng',
      postedDate: '1 ngày trước',
      isUrgent: false,
      isSaved: false,
      skills: ['Tuổi 25 - 40']
    },
    {
      id: '2',
      title: 'Nhân Viên Kinh Doanh Thiết Bị Implant',
      company: {
        id: 'im8',
        name: 'CÔNG TY TNHH THƯƠNG MẠI SIV',
        logo: '/api/placeholder/60/60'
      },
      salary: {
        min: 12,
        max: 14,
        currency: 'triệu',
        period: 'tháng'
      },
      location: 'Đà Nẵng, Hồ Chí Minh',
      experience: '1 năm',
      jobType: 'Kinh doanh',
      postedDate: '1 ngày trước',
      isUrgent: true,
      isSaved: false
    },
    {
      id: '3',
      title: 'Nhân Viên Kinh Doanh - Lương Cứng 10 Triệu - 20 Triệu - Được Đào Tạo Nghề - Không Giới Hạn Thu Nhập...',
      company: {
        id: 'phoxanh',
        name: 'CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN PHỐ XANH HOLDINGS',
        logo: '/api/placeholder/60/60'
      },
      salary: {
        min: 20,
        max: 50,
        currency: 'triệu',
        period: 'tháng'
      },
      location: 'Hà Nội',
      experience: 'Không yêu cầu',
      jobType: 'Thiết kế nội thất, Xây dựng',
      postedDate: '1 ngày trước',
      isUrgent: false,
      isSaved: true,
      skills: ['Từ 25 tuổi trở lên', '+1']
    },
    {
      id: '4',
      title: 'Nhân Viên Kinh Doanh Điện Mặt Trời Ngành T7, CN Thu Nhập Từ 10 - 20 Triệu',
      company: {
        id: 'yuxiang',
        name: 'CÔNG TY TNHH CÔNG NGHỆ HỆ THỐNG YUXIANG',
        logo: '/api/placeholder/60/60'
      },
      salary: {
        min: 10,
        max: 20,
        currency: 'triệu',
        period: 'tháng'
      },
      location: 'Hà Nội, Hồ Chí Minh',
      experience: '1 năm',
      jobType: 'Thiết kế nội thất, Xây dựng',
      postedDate: '1 ngày trước',
      isUrgent: false,
      isSaved: false,
      skills: ['Từ 25 tuổi trở lên', '+1']
    }
  ];

  const displayJobs = jobs.length > 0 ? jobs : mockJobs;

  const formatSalary = (salary: Job['salary']) => {
    if (salary.min && salary.max) {
      return `${salary.min} - ${salary.max} ${salary.currency}`;
    } else if (salary.min) {
      return `Từ ${salary.min} ${salary.currency}`;
    } else {
      return 'Thỏa thuận';
    }
  };

  const handleSaveToggle = (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onSaveJob?.(jobId);
  };

  const handleJobClick = (jobId: string) => {
    onJobClick?.(jobId);
  };

  const handleCompanyClick = (companyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onCompanyClick?.(companyId);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {displayJobs.map((job) => (
        <Paper
          key={job.id}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderColor: theme.palette.primary.main,
              transform: 'translateY(-2px)'
            }
          }}
          onClick={() => handleJobClick(job.id)}
        >
          {/* Urgent Badge */}
          {job.isUrgent && (
            <Chip
              label="Đề xuất cho bạn"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 60,
                backgroundColor: '#e8f5e8',
                color: '#4caf50',
                fontSize: '0.75rem'
              }}
            />
          )}

          {/* Save Button */}
          <IconButton
            onClick={(e) => handleSaveToggle(job.id, e)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: job.isSaved ? theme.palette.primary.main : '#ccc'
            }}
          >
            {job.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            {/* Company Logo */}
            <Box
              onClick={(e) => handleCompanyClick(job.company.id, e)}
              sx={{ cursor: 'pointer' }}
            >
              {job.company.logo ? (
                <Avatar
                  src={job.company.logo}
                  alt={job.company.name}
                  variant="rounded"
                  sx={{
                    width: 80,
                    height: 80,
                    border: `2px solid ${theme.palette.divider}`,
                    borderRadius: 2
                  }}
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: theme.palette.primary.light,
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  {job.company.name.charAt(0)}
                </Avatar>
              )}
            </Box>

            {/* Job Details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Job Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {job.title}
              </Typography>

              {/* Company Name */}
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
                onClick={(e) => handleCompanyClick(job.company.id, e)}
              >
                {job.company.name}
              </Typography>

              {/* Job Info Row */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BusinessCenterIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.experience}
                  </Typography>
                </Box>
              </Box>

              {/* Job Type and Skills */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {job.jobType}
                </Typography>
                {job.skills && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Bottom Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="caption" color="text.secondary">
                    {job.postedDate}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.success.main,
                    fontSize: '1.1rem'
                  }}
                >
                  {formatSalary(job.salary)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}

      {/* Load More Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            px: 4,
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}08`,
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Xem thêm việc làm
        </Button>
      </Box>
    </Box>
  );
};

export default JobListing;