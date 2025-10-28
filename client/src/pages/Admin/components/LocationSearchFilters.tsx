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
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface LocationSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

// Major cities in Vietnam and popular international tech hubs
const majorCities = [
  // Vietnam
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Biên Hòa',
  'Nha Trang',
  'Huế',
  'Vũng Tàu',
  'Buôn Ma Thuột',
];

const LocationSearchFilters: React.FC<LocationSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount
}) => {
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
            placeholder="Tìm theo thành phố, quốc gia..."
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
          
          {/* City Filter */}
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Thành phố</InputLabel>
            <Select
              value={cityFilter}
              label="Thành phố"
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {majorCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
        </Box>

        {/* Result Count */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="body2" color="text.secondary">
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} địa điểm
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LocationSearchFilters;