import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl,
  Chip,
  Pagination,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  Star
} from '@mui/icons-material';
import JobListCard, { JobListCardData } from '../../components/candidate/JobListCard';

// Mock data for attractive jobs
const mockAttractiveJobs: JobListCardData[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer - React/Next.js - Lương Up To 40M',
    company: 'CÔNG TY CÔNG NGHỆ DIGITEQ',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '25 - 40 triệu',
    location: 'Hà Nội, TP.HCM',
    postedTime: '15 ngày để ứng tuyển',
    deadline: '1 giờ trước',
    isVerified: true,
    isUrgent: true,
    tags: ['Hot Job', 'Remote'],
    salaryColor: '#ff6b35'
  },
  {
    id: 2,
    title: 'Marketing Manager - Thương Hiệu Quốc Tế - Package Hấp Dẫn',
    company: 'UNILEVER VIETNAM',
    companyLogo: 'https://via.placeholder.com/80',
    salary: 'Từ 30 triệu',
    location: 'TP.HCM',
    postedTime: '20 ngày để ứng tuyển',
    deadline: '2 giờ trước',
    isVerified: true,
    tags: ['Thương hiệu lớn', 'Phúc lợi cao'],
    salaryColor: '#ff6b35'
  },
  {
    id: 3,
    title: 'DevOps Engineer - Startup Fintech - Equity + High Salary',
    company: 'MOMO E-WALLET',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '35 - 55 triệu',
    location: 'TP.HCM',
    postedTime: '25 ngày để ứng tuyển',
    deadline: '30 phút trước',
    isUrgent: true,
    isVerified: true,
    tags: ['Fintech', 'Equity', 'Startup'],
    salaryColor: '#ff6b35'
  },
  {
    id: 4,
    title: 'Sales Director - B2B Software - Commission Không Giới Hạn',
    company: 'FPT SOFTWARE',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '50 - 100 triệu',
    location: 'Hà Nội, TP.HCM, Đà Nẵng',
    postedTime: '18 ngày để ứng tuyển',
    deadline: '45 phút trước',
    isVerified: true,
    tags: ['Leadership', 'Commission cao'],
    salaryColor: '#ff6b35'
  },
  {
    id: 5,
    title: 'Product Manager - E-commerce Platform - Multinational Company',
    company: 'SHOPEE VIETNAM',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '40 - 60 triệu',
    location: 'TP.HCM',
    postedTime: '12 ngày để ứng tuyển',
    deadline: '1 giờ trước',
    isVerified: true,
    isUrgent: true,
    tags: ['E-commerce', 'Quốc tế'],
    salaryColor: '#ff6b35'
  }
];

const AttractiveJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobType, setJobType] = useState('');

  const totalJobs = 642;
  const jobsPerPage = 10;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching for:', searchTerm, selectedLocation, jobType);
  };

  const handleApply = (jobId: number) => {
    console.log('Applying to job:', jobId);
  };

  const handleSave = (jobId: number) => {
    console.log('Saving job:', jobId);
  };

  return (
    <Box>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 300,
            height: 300,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpolygon points="30,15 45,45 15,45"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />
        
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Việc làm hấp dẫn
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Khám phá những cơ hội việc làm hấp dẫn nhất với mức lương và phúc lợi vượt trội
          </Typography>
          
          {/* Feature Tags */}
          <Stack direction="row" spacing={2}>
            <Chip 
              icon={<Star sx={{ color: 'white !important' }} />}
              label="Lương cao nhất" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
            <Chip 
              label="Thưởng hấp dẫn" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
            <Chip 
              label="Cơ hội thăng tiến" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
            <Chip 
              label="Làm việc quốc tế" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Search Form */}
        <Box
          sx={{
            backgroundColor: 'white',
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            mb: 4,
            mt: -3,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              placeholder="Tên công việc, vị trí"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Tất cả tình/thành phố</MenuItem>
                <MenuItem value="hanoi">Hà Nội</MenuItem>
                <MenuItem value="hcm">TP. Hồ Chí Minh</MenuItem>
                <MenuItem value="danang">Đà Nẵng</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <Work sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Tất cả lĩnh vực</MenuItem>
                <MenuItem value="it">Công nghệ thông tin</MenuItem>
                <MenuItem value="sales">Kinh doanh</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="finance">Tài chính</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: '#ff6b35',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#e55a2b' }
              }}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Box>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Tìm thấy <strong style={{ color: '#ff6b35' }}>{totalJobs} việc</strong> làm hấp dẫn phù hợp với yêu cầu của bạn.
          </Typography>
        </Box>

        {/* Job Listings */}
        <Box sx={{ mb: 4 }}>
          {mockAttractiveJobs.map((job) => (
            <JobListCard
              key={job.id}
              job={job}
              onApply={handleApply}
              onSave={handleSave}
            />
          ))}
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.min(totalPages, 18)} // Limit to 18 pages
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#e55a2b'
                  }
                }
              }
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default AttractiveJobsPage;