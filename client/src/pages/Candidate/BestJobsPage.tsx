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
  Work
} from '@mui/icons-material';
import JobListCard, { JobListCardData } from '../../components/candidate/JobListCard';

// Mock data for best jobs
const mockBestJobs: JobListCardData[] = [
  {
    id: 1,
    title: 'Giám Sát MEP - Từ 1 Năm Kinh Nghiệm - Thu Nhập Hấp Dẫn',
    company: 'CÔNG TY CỔ PHẦN THIÊN PHÚ E&C',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '10 - 18 triệu',
    location: 'Hồ Chí Minh & 7 nơi khác',
    postedTime: '23 ngày để ứng tuyển',
    deadline: '3 phút trước',
    isVerified: true,
    tags: ['Cấp nhật 3 phút trước'],
    salaryColor: '#009a3e'
  },
  {
    id: 2,
    title: 'Trưởng Nhóm Kinh Doanh / Sales Leader Dịch Vụ Pilates - Từ 2 Năm Kinh Nghiệm (Thu Nhập Từ 25 Triệu++)',
    company: 'CÔNG TY TNHH ME GAU PILATES',
    companyLogo: 'https://via.placeholder.com/80',
    salary: 'Từ 25 triệu',
    location: 'Hà Nội',
    postedTime: '25 ngày để ứng tuyển',
    deadline: '3 phút trước',
    isUrgent: true,
    tags: ['Cấp nhật 3 phút trước'],
    salaryColor: '#009a3e'
  },
  {
    id: 3,
    title: 'Nam Nhân Viên Kinh Doanh Khối KH Khu Công Nghiệp Nhật Bản/Trung/Anh Thu Nhập Upto 15 Triệu + Thưởng...',
    company: 'Công Ty Cổ phần Công Nghệ Phúc Bình',
    companyLogo: 'https://via.placeholder.com/80',
    salary: 'Thỏa thuận',
    location: 'TP.HCM',
    postedTime: '30 ngày để ứng tuyển',
    isVerified: true,
    salaryColor: '#4caf50'
  },
  {
    id: 4,
    title: 'Performance Marketing Executive (Lĩnh Vực POD)',
    company: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ BORDER-X',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '9 - 18 triệu',
    location: 'Hồ Chí Minh',
    postedTime: '27 ngày để ứng tuyển',
    deadline: '11 phút trước',
    tags: ['Cập nhật 11 phút trước'],
    salaryColor: '#009a3e'
  },
  {
    id: 5,
    title: 'Chuyên Viên Sale Admin - Thử Tục (Từ 2 Năm Kinh Nghiệm) Ưu Tiên Có Kinh Nghiệm Bất Động Sản',
    company: 'Công ty Cổ phần VNT Invest Group',
    companyLogo: 'https://via.placeholder.com/80',
    salary: '12 - 15 triệu',
    location: 'Hà Nội',
    postedTime: '25 ngày để ứng tuyển',
    deadline: '12 phút trước',
    isVerified: true,
    tags: ['Cập nhật 12 phút trước'],
    salaryColor: '#009a3e'
  }
];

const BestJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobType, setJobType] = useState('');

  const totalJobs = 861;
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
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
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
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />
        
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Việc làm tốt nhất
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Tìm kiếm công việc mơ ước từ những cơ hội việc làm tốt nhất trên TopCV
          </Typography>
          
          {/* Feature Tags */}
          <Stack direction="row" spacing={2}>
            <Chip 
              label="Lương cao" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
            <Chip 
              label="Phúc lợi hấp dẫn" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }} 
            />
            <Chip 
              label="Môi trường chuyên nghiệp" 
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
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: '#009a3e',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#008035' }
              }}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Box>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Tìm thấy <strong style={{ color: '#009a3e' }}>{totalJobs} việc</strong> làm phù hợp với yêu cầu của bạn.
          </Typography>
        </Box>

        {/* Job Listings */}
        <Box sx={{ mb: 4 }}>
          {mockBestJobs.map((job) => (
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
            count={Math.min(totalPages, 18)} // Limit to 18 pages as shown in image
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#009a3e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#008035'
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

export default BestJobsPage;