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
  Button
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

interface ApplicationFilters {
  search: string;
  status: string;
  jobTitle: string;
  company: string;
}

interface ApplicationSearchFiltersProps {
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
}

const ApplicationSearchFilters: React.FC<ApplicationSearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (field: keyof ApplicationFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      jobTitle: '',
      company: ''
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center',
          '& > *': { 
            flex: '1 1 200px',
            minWidth: 200
          }
        }}>
          <TextField
            label="Tìm kiếm"
            placeholder="Tìm theo tên ứng viên, email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <FormControl>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filters.status}
              label="Trạng thái"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="reviewing">Đang xem xét</MenuItem>
              <MenuItem value="shortlisted">Vào danh sách ngắn</MenuItem>
              <MenuItem value="accepted">Đã duyệt</MenuItem>
              <MenuItem value="rejected">Đã từ chối</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Vị trí công việc"
            placeholder="Tìm theo vị trí..."
            value={filters.jobTitle}
            onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
          />

          <TextField
            label="Công ty"
            placeholder="Tìm theo công ty..."
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleClearFilters}
            sx={{ flexShrink: 0, minWidth: 'auto' }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApplicationSearchFilters;