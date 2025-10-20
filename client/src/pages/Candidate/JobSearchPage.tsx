import React from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  Tune as TuneIcon
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { jobService, jobCategoryService } from '../../services';
import type { Job, JobCategory } from '../../services/types';
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
  jobType: string;
  minSalary: number | null;
  maxSalary: number | null;
}

interface SearchState {
  jobs: Job[];
  categories: JobCategory[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const JobSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useMuiTheme();
  
  const [filters, setFilters] = React.useState<SearchFilters>({
    category: '',
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('locationName') || '',
    categories: [],
    levels: [],
    salaryRange: 'Tất cả',
    locations: [],
    experience: '',
    jobType: '',
    minSalary: null,
    maxSalary: null
  });
  
  const [searchState, setSearchState] = React.useState<SearchState>({
    jobs: [],
    categories: [],
    totalJobs: 0,
    currentPage: 1,
    totalPages: 0,
    isLoading: false,
    error: null
  });
  
  const [showFilters, setShowFilters] = React.useState(true);
  const [currentFilters, setCurrentFilters] = React.useState<string[]>([]);

  const getCategoryBySlug = React.useCallback((slug: string): JobCategory | undefined => {
    return searchState.categories.find(cat => cat.slug === slug);
  }, [searchState.categories]);

  // Utility function to parse salary range
  const parseSalaryRange = (salaryRange: string): { min: number | null; max: number | null } => {
    if (!salaryRange || salaryRange === 'Tất cả') return { min: null, max: null };
    
    const ranges: Record<string, { min: number | null; max: number | null }> = {
      'Dưới 10 triệu': { min: 0, max: 10 },
      '10 - 15 triệu': { min: 10, max: 15 },
      '15 - 20 triệu': { min: 15, max: 20 },
      '20 - 25 triệu': { min: 20, max: 25 },
      '25 - 30 triệu': { min: 25, max: 30 },
      '30 - 50 triệu': { min: 30, max: 50 },
      'Trên 50 triệu': { min: 50, max: null },
      'Thỏa thuận': { min: null, max: null }
    };
    
    return ranges[salaryRange] || { min: null, max: null };
  };

  // Enhanced search params builder
  const buildSearchParams = React.useCallback(() => {
    const keyword = filters.keyword || searchParams.get('keyword') || '';
    const categorySlug = searchParams.get('categorySlug') || '';
    const category = searchParams.get('category') || filters.category || '';
    const location = filters.location || searchParams.get('locationName') || '';
    
    // Handle multiple categories from sidebar
    const activeCategories = filters.categories.length > 0 ? filters.categories : [];
    const activeLocations = filters.locations.length > 0 ? filters.locations : [location].filter(Boolean);
    
    // Parse salary range
    const salaryInfo = parseSalaryRange(filters.salaryRange);
    
    return {
      keyword,
      categorySlug,
      category,
      location,
      activeCategories,
      activeLocations,
      levels: filters.levels,
      jobType: filters.jobType,
      minSalary: salaryInfo.min,
      maxSalary: salaryInfo.max,
      experience: filters.experience
    };
  }, [filters, searchParams]);

  const loadJobs = React.useCallback(async (page: number = 1) => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Build comprehensive search parameters
      const searchConfig = buildSearchParams();
      
      console.log('🔍 Loading jobs with enhanced params:', searchConfig);
      
      // Find category ID by slug or name
      let categoryId: string | undefined;
      if (searchConfig.categorySlug) {
        const categoryBySlug = getCategoryBySlug(searchConfig.categorySlug);
        categoryId = categoryBySlug?.id;
        console.log('📂 Found category by slug:', categoryBySlug);
      } else if (searchConfig.category) {
        const categoryByName = searchState.categories.find(cat => 
          cat.name.toLowerCase().includes(searchConfig.category.toLowerCase())
        );
        categoryId = categoryByName?.id;
        console.log('📂 Found category by name:', categoryByName);
      }

      // Handle multiple categories from sidebar filters
      const activeCategoryIds: number[] = [];
      if (searchConfig.activeCategories.length > 0) {
        searchConfig.activeCategories.forEach(catName => {
          const foundCat = searchState.categories.find(cat => 
            cat.name.toLowerCase().includes(catName.toLowerCase())
          );
          if (foundCat) {
            activeCategoryIds.push(parseInt(foundCat.id));
          }
        });
      } else if (categoryId) {
        activeCategoryIds.push(parseInt(categoryId));
      }

      // Determine if we need filtered search
      const hasFilters = searchConfig.keyword || 
                        activeCategoryIds.length > 0 || 
                        searchConfig.activeLocations.length > 0 ||
                        searchConfig.levels.length > 0 ||
                        searchConfig.jobType ||
                        searchConfig.minSalary !== null ||
                        searchConfig.maxSalary !== null;

      let response;
      
      if (hasFilters) {
        console.log('🔍 Using enhanced search API with params:', {
          title: searchConfig.keyword,
          category_ids: activeCategoryIds,
          locations: searchConfig.activeLocations,
          levels: searchConfig.levels,
          job_type: searchConfig.jobType,
          min_salary: searchConfig.minSalary,
          max_salary: searchConfig.maxSalary,
          page,
          limit: 10
        });
        
        response = await jobService.searchJobs({
          title: searchConfig.keyword || undefined,
          category_id: activeCategoryIds[0] || undefined, // Primary category for compatibility
          page,
          limit: 10
        });
      } else {
        console.log('📋 Using getAllJobs with params:', { page, limit: 10 });
        response = await jobService.getAllJobs({
          page,
          limit: 10
        });
      }
      
      console.log('📊 API Response:', response);
      
      if (response.success && response.data) {
        let jobs = response.data || [];
        
        if (hasFilters) {
          jobs = jobs.filter(job => {
            // Filter by multiple categories
            if (activeCategoryIds.length > 1) {
              const jobCategoryId = parseInt(job.category_id || '0');
              if (!activeCategoryIds.includes(jobCategoryId)) return false;
            }
            
            // Filter by location (multiple locations from sidebar)
            if (searchConfig.activeLocations.length > 0) {
              const jobLocation = job.location_name?.toLowerCase() || '';
              const matchesLocation = searchConfig.activeLocations.some(loc => 
                jobLocation.includes(loc.toLowerCase()) || loc.toLowerCase().includes(jobLocation)
              );
              if (!matchesLocation) return false;
            }
            
            // Filter by salary range
            if (searchConfig.minSalary !== null && job.salary_min) {
              if (job.salary_min < searchConfig.minSalary * 1000000) return false;
            }
            if (searchConfig.maxSalary !== null && job.salary_max) {
              if (job.salary_max > searchConfig.maxSalary * 1000000) return false;
            }
            
            // Filter by job type
            if (searchConfig.jobType && job.job_type !== searchConfig.jobType) {
              return false;
            }
            
            return true;
          });
        }
        
        console.log('✅ Jobs loaded and filtered:', jobs.length);
        
        setSearchState(prev => ({
          ...prev,
          jobs,
          totalJobs: jobs.length,
          currentPage: page,
          totalPages: Math.ceil(jobs.length / 10),
          isLoading: false
        }));
      } else {
        throw new Error(response.message || 'Không thể tải danh sách công việc');
      }
    } catch (error: any) {
      console.error('❌ Error loading jobs:', error);
      let errorMessage = 'Có lỗi xảy ra khi tải công việc';
      
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy dữ liệu công việc.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSearchState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [buildSearchParams, getCategoryBySlug, searchState.categories]);

  // Load categories on mount
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await jobCategoryService.getAllCategories();
        if (response.success && response.data) {
          setSearchState(prev => ({
            ...prev,
            categories: response.data || []
          }));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  // Load jobs when filters or page changes
  React.useEffect(() => {
    loadJobs();
  }, [searchParams, loadJobs]);

  // Convert service Job to JobListing Job format
  const convertJobForListing = (job: Job): any => {
    return {
      id: job.id,
      title: job.title,
      company: {
        id: job.company_id,
        name: job.company_name || 'Unknown Company',
        logo: job.logo_url
      },
      salary: {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.currency || 'VND',
        period: 'month'
      },
      location: job.location_name || 'Không xác định',
      experience: 'Không yêu cầu',
      jobType: job.job_type || 'full_time',
      postedDate: job.created_at,
      isUrgent: false,
      isSaved: false,
      skills: [],
      description: job.description
    };
  };

  // Enhanced initialization from URL params
  React.useEffect(() => {
    const keyword = searchParams.get('keyword');
    const locationName = searchParams.get('locationName');
    const category = searchParams.get('category');
    const categorySlug = searchParams.get('categorySlug');
    
    const levels = searchParams.get('levels')?.split(',') || [];
    const salaryRange = searchParams.get('salaryRange') || 'Tất cả';
    const jobType = searchParams.get('jobType') || '';
    
    console.log('🔗 Initializing from URL params:', {
      keyword, locationName, category, categorySlug, levels, salaryRange, jobType
    });
    
    if (keyword || locationName || category || categorySlug || levels.length > 0 || salaryRange !== 'Tất cả' || jobType) {
      setFilters(prev => ({
        ...prev,
        keyword: keyword || '',
        location: locationName || '',
        category: category || categorySlug || '',
        levels: levels,
        salaryRange: salaryRange,
        jobType: jobType
      }));
      
      const activeFilters: string[] = [];
      if (category) activeFilters.push(category);
      if (!category && categorySlug) activeFilters.push(categorySlug);
      if (levels.length > 0) activeFilters.push(...levels);
      if (salaryRange !== 'Tất cả') activeFilters.push(salaryRange);
      if (jobType) activeFilters.push(jobType);
      
      setCurrentFilters(activeFilters);
    }
  }, [searchParams]);

  const handleSearch = (searchParams: { category: string; keyword: string; location: string }) => {
    // Update filters state
    setFilters(prev => ({
      ...prev,
      keyword: searchParams.keyword,
      location: searchParams.location,
      category: searchParams.category
    }));
    
    // Build URL search params
    const urlParams = new URLSearchParams();
    
    if (searchParams.keyword.trim()) {
      urlParams.set('keyword', searchParams.keyword.trim());
    }
    
    if (searchParams.location && searchParams.location !== 'Địa điểm') {
      urlParams.set('locationName', searchParams.location);
    }
    
    if (searchParams.category && searchParams.category !== 'Danh mục Nghề') {
      // Try to find category by name to get slug
      const categoryByName = searchState.categories.find(cat => 
        cat.name.toLowerCase() === searchParams.category.toLowerCase()
      );
      
      if (categoryByName && categoryByName.slug) {
        urlParams.set('categorySlug', categoryByName.slug);
        urlParams.set('category', categoryByName.name);
      } else {
        urlParams.set('category', searchParams.category);
      }
    }
    
    // Update URL without navigation - this will trigger loadJobs via useEffect
    const newUrl = urlParams.toString() 
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
      
    window.history.pushState({}, '', newUrl);
    
    // Manually trigger loadJobs since we're not using navigate
    loadJobs(1);
  };

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    console.log('📝 Filters changed:', newFilters);
    
    // Update filters state
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));

    // Update current filters display for chips
    const activeFilters: string[] = [];
    
    // Add category filters
    const categories = newFilters.categories || filters.categories;
    if (categories.length > 0) {
      activeFilters.push(...categories);
    }
    
    // Add level filters  
    const levels = newFilters.levels || filters.levels;
    if (levels.length > 0) {
      activeFilters.push(...levels);
    }
    
    // Add salary range filter
    const salaryRange = newFilters.salaryRange || filters.salaryRange;
    if (salaryRange && salaryRange !== 'Tất cả') {
      activeFilters.push(salaryRange);
    }
    
    // Add location filters
    const locations = newFilters.locations || filters.locations;
    if (locations.length > 0) {
      activeFilters.push(...locations);
    }
    
    // Add job type filter
    const jobType = newFilters.jobType || filters.jobType;
    if (jobType) {
      activeFilters.push(jobType);
    }
    
    // Add experience filter
    const experience = newFilters.experience || filters.experience;
    if (experience) {
      activeFilters.push(experience);
    }
    
    setCurrentFilters(activeFilters);
    
    // Trigger new search with updated filters
    // Small delay to ensure state is updated
    setTimeout(() => {
      loadJobs(1);
    }, 100);
  };

  const removeFilter = (filterToRemove: string) => {
    console.log('🗑️ Removing filter:', filterToRemove);
    
    setFilters(prev => {
      const updated = { ...prev };
      
      // Remove from categories
      updated.categories = prev.categories.filter(c => c !== filterToRemove);
      
      // Remove from levels
      updated.levels = prev.levels.filter(l => l !== filterToRemove);
      
      // Remove from locations
      updated.locations = prev.locations.filter(loc => loc !== filterToRemove);
      
      // Reset salary range if it matches
      if (prev.salaryRange === filterToRemove) {
        updated.salaryRange = 'Tất cả';
      }
      
      // Reset job type if it matches
      if (prev.jobType === filterToRemove) {
        updated.jobType = '';
      }
      
      // Reset experience if it matches
      if (prev.experience === filterToRemove) {
        updated.experience = '';
      }
      
      return updated;
    });
    
    // Update current filters display
    setCurrentFilters(prev => prev.filter(f => f !== filterToRemove));
    
    // Trigger new search
    setTimeout(() => {
      loadJobs(1);
    }, 100);
  };

  const clearAllFilters = () => {
    console.log('🧹 Clearing all filters');
    
    setFilters({
      category: '',
      keyword: '',
      location: '',
      categories: [],
      levels: [],
      salaryRange: 'Tất cả',
      locations: [],
      experience: '',
      jobType: '',
      minSalary: null,
      maxSalary: null
    });
    setCurrentFilters([]);
    
    // Clear URL params as well
    window.history.pushState({}, '', window.location.pathname);
    
    // Trigger new search to load all jobs
    setTimeout(() => {
      loadJobs(1);
    }, 100);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default 
    }}>
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
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
              }}>
                <Typography 
                  variant="h5" 
                  fontWeight={600}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Tìm việc làm mới nhất
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<TuneIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: `${theme.palette.primary.main}08`
                    }
                  }}
                >
                  Bộ lọc
                </Button>
              </Box>

              {/* Search Results Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Typography variant="body1" color="text.secondary">
                  Tìm kiếm theo:{' '}
                  <Box component="span" sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 600 
                  }}>
                    {filters.keyword ? `"${filters.keyword}"` : 'Tất cả công việc'}
                  </Box>
                </Typography>
                
                {(filters.category || filters.location) && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      {filters.category && (
                        <Chip 
                          label={filters.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main 
                          }}
                        />
                      )}
                      {filters.location && (
                        <Chip 
                          label={filters.location} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main 
                          }}
                        />
                      )}
                    </Box>
                  </>
                )}
                
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" color="text.secondary">
                  Ưu tiên hiển thị theo:
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  sx={{ 
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}08`
                    }
                  }}
                >
                  Độ phù hợp ▼
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
                      sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.primary.main
                        }
                      }}
                      variant="outlined"
                    />
                  ))}
                  <Button
                    variant="text"
                    size="small"
                    onClick={clearAllFilters}
                    sx={{ 
                      color: theme.palette.primary.main,
                      textTransform: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Xóa tất cả
                  </Button>
                </Box>
              )}

              {/* Results Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {searchState.isLoading 
                    ? 'Đang tải...' 
                    : `Hiển thị ${searchState.jobs.length} trong tổng số ${searchState.totalJobs} việc làm`
                  }
                  {currentFilters.length > 0 && (
                    <Box component="span" sx={{ color: theme.palette.primary.main, ml: 1 }}>
                      • {currentFilters.length} bộ lọc đang áp dụng
                    </Box>
                  )}
                </Typography>
                
                {!searchState.isLoading && searchState.jobs.length === 0 && !searchState.error && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearAllFilters}
                    sx={{ 
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main
                    }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </Box>
            </Box>

            {/* Loading State */}
            {searchState.isLoading && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                py: 4 
              }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
              </Box>
            )}

            {/* Error State */}
            {searchState.error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                action={
                  <Button 
                    onClick={() => loadJobs()} 
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Thử lại
                  </Button>
                }
              >
                {searchState.error}
              </Alert>
            )}

            {/* Job Listings */}
            {!searchState.isLoading && !searchState.error && (
              <>
                <JobListing 
                  jobs={searchState.jobs.map(convertJobForListing)}
                  onJobClick={(jobId) => navigate(`/jobs/${jobId}`)}
                  onSaveJob={(jobId) => console.log('Job saved:', jobId)}
                  onCompanyClick={(companyId) => console.log('Company clicked:', companyId)}
                />

                {/* Pagination */}
                {searchState.totalPages > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4 
                  }}>
                    <Pagination
                      count={searchState.totalPages}
                      page={searchState.currentPage}
                      onChange={(_, page) => {
                        setSearchState(prev => ({ ...prev, currentPage: page }));
                        loadJobs(page);
                      }}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: theme.palette.primary.main,
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default JobSearchPage;