import React from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  Tune as TuneIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import JobSearchHeader from '../../components/candidate/JobSearchHeader';
import JobFiltersSidebar from '../../components/candidate/JobFiltersSidebar';
import JobListing from '../../components/candidate/JobListing';

interface SearchFilters {
  category: string;
  keyword: string;
  location: string;
  categories: string[];
  levels: string[];
  salaryRange: string;
  locations: string[];
  experience: string;
}

const JobSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = React.useState<SearchFilters>({
    category: '',
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('locationName') || '',
    categories: [],
    levels: [],
    salaryRange: 'Tất cả',
    locations: [],
    experience: ''
  });
  const [showFilters, setShowFilters] = React.useState(true);
  const [currentFilters, setCurrentFilters] = React.useState<string[]>([]);

  // Initialize filters from URL params
  React.useEffect(() => {
    const keyword = searchParams.get('keyword');
    const locationName = searchParams.get('locationName');
    const category = searchParams.get('category');
    
    if (keyword || locationName || category) {
      setFilters(prev => ({
        ...prev,
        keyword: keyword || '',
        location: locationName || '',
        category: category || ''
      }));
    }
  }, [searchParams]);

  const handleSearch = (searchParams: { category: string; keyword: string; location: string }) => {
    setFilters(prev => ({
      ...prev,
      ...searchParams
    }));
  };

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));

    // Update current filters display
    const activeFilters: string[] = [];
    if (newFilters.categories?.length) {
      activeFilters.push(...newFilters.categories);
    }
    if (newFilters.levels?.length) {
      activeFilters.push(...newFilters.levels);
    }
    if (newFilters.salaryRange && newFilters.salaryRange !== 'Tất cả') {
      activeFilters.push(newFilters.salaryRange);
    }
    setCurrentFilters(activeFilters);
  };

  const removeFilter = (filterToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== filterToRemove),
      levels: prev.levels.filter(l => l !== filterToRemove),
      salaryRange: prev.salaryRange === filterToRemove ? 'Tất cả' : prev.salaryRange
    }));
    setCurrentFilters(prev => prev.filter(f => f !== filterToRemove));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      keyword: '',
      location: '',
      categories: [],
      levels: [],
      salaryRange: 'Tất cả',
      locations: [],
      experience: ''
    });
    setCurrentFilters([]);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Search Header */}
      <JobSearchHeader onSearch={handleSearch} />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Filters Sidebar */}
          {showFilters && (
            <Box sx={{ width: 320, flexShrink: 0 }}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <JobFiltersSidebar onFiltersChange={handleFiltersChange} />
              </Box>
            </Box>
          )}

          {/* Job Listings */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Filter Controls */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                  Tìm việc làm mới nhất
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<TuneIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    borderColor: '#4caf50',
                    color: '#4caf50'
                  }}
                >
                  Bộ lọc
                </Button>
              </Box>

              {/* Search Results Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Tìm kiếm theo:{' '}
                  <Box component="span" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    ✓ Tên việc làm
                  </Box>
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" color="text.secondary">
                  Tên công ty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cả hai
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ưu tiên hiển thị theo:
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  sx={{ 
                    color: '#4caf50',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Search by AI ▼
                </Button>
              </Box>

              {/* Active Filters */}
              {currentFilters.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Bộ lọc đang áp dụng:
                  </Typography>
                  {currentFilters.map((filter) => (
                    <Chip
                      key={filter}
                      label={filter}
                      size="small"
                      onDelete={() => removeFilter(filter)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  <Button
                    variant="text"
                    size="small"
                    onClick={clearAllFilters}
                    sx={{ 
                      color: '#4caf50',
                      textTransform: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Xóa tất cả
                  </Button>
                </Box>
              )}

              {/* Results Count */}
              <Typography variant="body2" color="text.secondary">
                Hiển thị 53.454 việc làm phù hợp
              </Typography>
            </Box>

            {/* Job Listings */}
            <JobListing 
              onJobClick={(jobId) => console.log('Job clicked:', jobId)}
              onSaveJob={(jobId) => console.log('Job saved:', jobId)}
              onCompanyClick={(companyId) => console.log('Company clicked:', companyId)}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default JobSearchPage;