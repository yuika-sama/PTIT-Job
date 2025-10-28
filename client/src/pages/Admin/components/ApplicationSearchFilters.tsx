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
  Button,
  Typography,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

interface ApplicationSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  jobTitleFilter: string;
  setJobTitleFilter: (value: string) => void;
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

const ApplicationSearchFilters: React.FC<ApplicationSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  jobTitleFilter,
  setJobTitleFilter,
  companyFilter,
  setCompanyFilter,
  filteredCount,
  totalCount
}) => {
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setJobTitleFilter('');
    setCompanyFilter('');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 2
        }}>
          {/* Search Box */}
          <TextField
            placeholder="Tìm theo tên ứng viên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ flex: '1 1 250px', minWidth: 250 }}
          />
          
          {/* Status Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="reviewing">Đang xem xét</MenuItem>
              <MenuItem value="shortlisted">Vào danh sách ngắn</MenuItem>
              <MenuItem value="hired">Đã tuyển</MenuItem>
              <MenuItem value="rejected">Đã từ chối</MenuItem>
            </Select>
          </FormControl>

          {/* Job Title Filter */}
          <TextField
            label="Vị trí công việc"
            placeholder="Tìm theo vị trí..."
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          />

          {/* Company Filter */}
          <TextField
            label="Công ty"
            placeholder="Tìm theo công ty..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          />

          {/* Clear Filters Button */}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleClearFilters}
            sx={{ flexShrink: 0 }}
          >
            Xóa bộ lọc
          </Button>
        </Box>

        {/* Result Count */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="body2" color="text.secondary">
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} đơn ứng tuyển
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApplicationSearchFilters;