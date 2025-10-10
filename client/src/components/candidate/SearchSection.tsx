import React from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import { JobCategory, Location } from '../../services/types';
import { useSearchJobs } from '../../hooks/useApi';
import SearchBar from './SearchBar';
import CategoryList from './CategoryList';
import HeroBanner from './HeroBanner';
import StatsBar from './StatsBar';
import SearchSuggestions from './SearchSuggestions';

// Interface for props
interface SearchSectionProps {
  locations?: Location[];
  categories?: JobCategory[];
  isLoading?: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  locations = [],
  categories = [],
  isLoading = false
}) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<JobCategory | null>(null);
  const [searchKeyword, setSearchKeyword] = React.useState<string>('');
  
  const { searchJobs, loading: searchLoading, error: searchError } = useSearchJobs();

  // Handle search functionality
  const handleSearch = async (params: { keyword: string; locationId?: number }) => {
    const searchCriteria = {
      title: params.keyword || undefined,
      location_id: params.locationId,
      category_id: selectedCategory ? parseInt(selectedCategory.id) : undefined,
    };

    try {
      await searchJobs(searchCriteria);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (keyword: string) => {
    // Pass the keyword to SearchBar component
    setSearchKeyword(keyword);
  };

  // Clear search
  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        borderRadius: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          background: `${theme.palette.secondary.main}30`,
          borderRadius: '50%'
        }} />
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
          Tìm việc làm tại PTIT Job
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
          Nền tảng tuyển dụng chính thức của Học viện Công nghệ Bưu chính Viễn thông
        </Typography>
      </Box>

      {/* Search Bar */}
      <SearchBar 
        locations={locations}
        onSearch={handleSearch}
        isLoading={searchLoading}
        initialKeyword={searchKeyword}
      />

      {/* Search Results Preview */}
      {searchError && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="error">
            Lỗi tìm kiếm: {searchError}
          </Typography>
        </Box>
      )}

      {/* Active category filter display */}
      {selectedCategory && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Bộ lọc:</Typography>
          <Chip 
            label={`🏢 ${selectedCategory.name}`}
            size="small" 
            onDelete={handleClearCategory}
            sx={{ backgroundColor: `${theme.palette.secondary.main}08` }}
          />
        </Box>
      )}

      {/* Search Suggestions */}
      <Box sx={{ mb: 3 }}>
        <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Category List */}
        <CategoryList categories={categories} />

        {/* Right Content */}
        <Box sx={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Hero Banner */}
          <HeroBanner onPlayVideo={() => console.log('Play video')} />

          {/* Stats Bar */}
          <StatsBar onRefresh={() => console.log('Refresh stats')} />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchSection;
