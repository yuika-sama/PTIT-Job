import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface JobFilters {
  search: string;
  jobType: string;
  location: string;
  status: string;
  experienceLevel: string;
}

interface JobSearchFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

const JobSearchFilters: React.FC<JobSearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleJobTypeChange = (value: string) => {
    onFiltersChange({ ...filters, jobType: value });
  };

  const handleLocationChange = (value: string) => {
    onFiltersChange({ ...filters, location: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handleExperienceLevelChange = (value: string) => {
    onFiltersChange({ ...filters, experienceLevel: value });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tiêu đề, mô tả, yêu cầu..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: '1 1 300px', minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Loại hình</InputLabel>
            <Select
              value={filters.jobType}
              label="Loại hình"
              onChange={(e) => handleJobTypeChange(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="full_time">Toàn thời gian</MenuItem>
              <MenuItem value="part_time">Bán thời gian</MenuItem>
              <MenuItem value="contract">Hợp đồng</MenuItem>
              <MenuItem value="internship">Thực tập</MenuItem>
              <MenuItem value="freelance">Freelance</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Kinh nghiệm</InputLabel>
            <Select
              value={filters.experienceLevel}
              label="Kinh nghiệm"
              onChange={(e) => handleExperienceLevelChange(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="entry">Mới tốt nghiệp</MenuItem>
              <MenuItem value="mid">Trung cấp</MenuItem>
              <MenuItem value="senior">Cao cấp</MenuItem>
              <MenuItem value="lead">Trưởng nhóm</MenuItem>
              <MenuItem value="executive">Lãnh đạo</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filters.status}
              label="Trạng thái"
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Tạm ngưng</MenuItem>
              <MenuItem value="expired">Hết hạn</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Địa điểm</InputLabel>
            <Select
              value={filters.location}
              label="Địa điểm"
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="ha-noi">Hà Nội</MenuItem>
              <MenuItem value="ho-chi-minh">TP. Hồ Chí Minh</MenuItem>
              <MenuItem value="da-nang">Đà Nẵng</MenuItem>
              <MenuItem value="hai-phong">Hải Phòng</MenuItem>
              <MenuItem value="can-tho">Cần Thơ</MenuItem>
              <MenuItem value="remote">Làm việc từ xa</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobSearchFilters;