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

interface LocationFilters {
  search: string;
  country: string;
  status: string;
}

interface LocationSearchFiltersProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
}

// Common countries for Vietnam job market
const commonCountries = [
  'Vietnam',
  'Singapore',
  'Japan',
  'South Korea',
  'United States',
  'Australia',
  'Canada',
  'United Kingdom',
  'Germany',
  'France'
];

const LocationSearchFilters: React.FC<LocationSearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (field: keyof LocationFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      country: '',
      status: ''
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
            placeholder="Tìm theo thành phố, bang/tỉnh..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <FormControl>
            <InputLabel>Quốc gia</InputLabel>
            <Select
              value={filters.country}
              label="Quốc gia"
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {commonCountries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filters.status}
              label="Trạng thái"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>

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

export default LocationSearchFilters;