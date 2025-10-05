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

interface CompanyFilters {
  search: string;
  size: string;
  status: string;
}

interface CompanySearchFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
}

const CompanySearchFilters: React.FC<CompanySearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleSizeChange = (value: string) => {
    onFiltersChange({ ...filters, size: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tên công ty, website, email..."
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
            <InputLabel>Quy mô</InputLabel>
            <Select
              value={filters.size}
              label="Quy mô"
              onChange={(e) => handleSizeChange(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="small">Nhỏ (1-50)</MenuItem>
              <MenuItem value="medium">Trung bình (51-200)</MenuItem>
              <MenuItem value="large">Lớn (201-1000)</MenuItem>
              <MenuItem value="enterprise">Doanh nghiệp (1000+)</MenuItem>
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
              <MenuItem value="with-website">Có website</MenuItem>
              <MenuItem value="with-logo">Có logo</MenuItem>
              <MenuItem value="with-email">Có email</MenuItem>
              <MenuItem value="complete">Đầy đủ thông tin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanySearchFilters;