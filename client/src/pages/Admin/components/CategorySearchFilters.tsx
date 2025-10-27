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
  Typography,
  InputAdornment,
  Button
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

interface CategorySearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

const CategorySearchFilters: React.FC<CategorySearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount
}) => {
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
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
            placeholder="Tìm theo tên danh mục, slug, mô tả, số lượng việc làm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ flex: '1 1 300px', minWidth: 300 }}
          />
          
          {/* Status Filter */}
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>

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
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} danh mục
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategorySearchFilters;