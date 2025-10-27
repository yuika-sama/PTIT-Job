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
  InputAdornment,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface JobSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  experienceFilter: string;
  setExperienceFilter: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

const JobSearchFilters: React.FC<JobSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  jobTypeFilter,
  setJobTypeFilter,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
  experienceFilter,
  setExperienceFilter,
  filteredCount,
  totalCount
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {/* Search Box */}
          <TextField
            placeholder="Tìm kiếm theo tiêu đề, mô tả, công ty, địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: '1 1 300px', minWidth: 300 }}
          />
          
          {/* Job Type Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Loại hình</InputLabel>
            <Select
              value={jobTypeFilter}
              label="Loại hình"
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="full_time">Toàn thời gian</MenuItem>
              <MenuItem value="part_time">Bán thời gian</MenuItem>
              <MenuItem value="contract">Hợp đồng</MenuItem>
              <MenuItem value="internship">Thực tập</MenuItem>
              <MenuItem value="freelance">Freelance</MenuItem>
            </Select>
          </FormControl>
          
          {/* Experience Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Kinh nghiệm</InputLabel>
            <Select
              value={experienceFilter}
              label="Kinh nghiệm"
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="entry">Mới tốt nghiệp</MenuItem>
              <MenuItem value="mid">Trung cấp</MenuItem>
              <MenuItem value="senior">Cao cấp</MenuItem>
              <MenuItem value="lead">Trưởng nhóm</MenuItem>
              <MenuItem value="executive">Lãnh đạo</MenuItem>
            </Select>
          </FormControl>
          
          {/* Status Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="draft">Nháp</MenuItem>
              <MenuItem value="published">Đã xuất bản</MenuItem>
              <MenuItem value="expired">Hết hạn</MenuItem>
              <MenuItem value="closed">Đã đóng</MenuItem>
            </Select>
          </FormControl>
          
          {/* Location Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Địa điểm</InputLabel>
            <Select
              value={locationFilter}
              label="Địa điểm"
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="hà nội">Hà Nội</MenuItem>
              <MenuItem value="hồ chí minh">TP. Hồ Chí Minh</MenuItem>
              <MenuItem value="đà nẵng">Đà Nẵng</MenuItem>
              <MenuItem value="hải phòng">Hải Phòng</MenuItem>
              <MenuItem value="cần thơ">Cần Thơ</MenuItem>
              <MenuItem value="remote">Làm việc từ xa</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Result Count */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="body2" color="text.secondary">
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} việc làm
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobSearchFilters;