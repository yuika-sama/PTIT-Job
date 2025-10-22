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

interface CompanySearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sizeFilter: string;
  setSizeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

const CompanySearchFilters: React.FC<CompanySearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sizeFilter,
  setSizeFilter,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tên công ty, website, email..."
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
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Quy mô</InputLabel>
            <Select
              value={sizeFilter}
              label="Quy mô"
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="1-10">1-10 nhân viên</MenuItem>
              <MenuItem value="11-50">11-50 nhân viên</MenuItem>
              <MenuItem value="51-200">51-200 nhân viên</MenuItem>
              <MenuItem value="201-500">201-500 nhân viên</MenuItem>
              <MenuItem value="501-1000">501-1000 nhân viên</MenuItem>
              <MenuItem value="1000+">1000+ nhân viên</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="with-website">Có website</MenuItem>
              <MenuItem value="with-logo">Có logo</MenuItem>
              <MenuItem value="with-email">Có email</MenuItem>
              <MenuItem value="complete">Đầy đủ thông tin</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Result Count */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="body2" color="text.secondary">
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} công ty
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanySearchFilters;