import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography,
  Pagination,
  Alert,
  Skeleton,
  Paper,
  Breadcrumbs,
  Link,
  Chip,
  InputAdornment,
  TextField,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { companyService } from '../../services';
import type { Company } from '../../services/types';

const CompaniesPage: React.FC = () => {
  const { companyId } = useParams<{ companyId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);

  const companiesPerPage = 12;

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (searchTerm) {
        result = await companyService.getAllCompanies({ search: searchTerm });
      } else {
        result = await companyService.getAllCompanies();
      }
      // Sort by job count (use jobs_count or job_count whichever is available)
      const sortResult = (result.data || []).sort((a, b) => {
        const countA = a.jobs_count ?? a.job_count ?? 0;
        const countB = b.jobs_count ?? b.job_count ?? 0;
        return countB - countA;
      });
      
      setCompanies(sortResult || []);
      
      // Reset to page 1 if current page is out of bounds
      const totalPages = Math.ceil(sortResult.length / companiesPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Không thể tải danh sách công ty. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, companiesPerPage]);

  const loadCompanyDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const result = await companyService.getCompanyById(id);
      setSelectedCompany(result.data || null);
    } catch (err) {
      console.error('Error loading company details:', err);
      setError('Không thể tải thông tin công ty.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize page from URL params
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (pageNumber > 0) {
        setCurrentPage(pageNumber);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (companyId) {
      loadCompanyDetails(companyId);
    }
  }, [companyId, loadCompanyDetails]);

  const validateAndSearch = (term: string) => {
    const trimmedTerm = term.trim();
    
    // Prevent search with very short terms or special characters only
    if (trimmedTerm.length > 0 && trimmedTerm.length < 2) {
      return false;
    }
    
    return true;
  };

  const handleSearch = () => {
    // Trim whitespace from search term
    const trimmedSearchTerm = searchTerm.trim();
    setSearchTerm(trimmedSearchTerm);
    
    // Validate search term
    if (trimmedSearchTerm && !validateAndSearch(trimmedSearchTerm)) {
      return;
    }
    
    // Always reset to page 1 when searching
    setCurrentPage(1);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (trimmedSearchTerm) {
      params.set('search', trimmedSearchTerm);
    }
    // Don't set page param for page 1 to keep URL clean
    setSearchParams(params);
    
    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    const params = new URLSearchParams();
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params);
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompanyClick = (company: Company) => {
    navigate(`/candidate/company/${company.id}`);
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
    navigate('/candidate/companies');
  };

  // Get companies for current page
  const getPaginatedCompanies = () => {
    const startIndex = (currentPage - 1) * companiesPerPage;
    const endIndex = startIndex + companiesPerPage;
    return companies.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(companies.length / companiesPerPage);

  // Show company details if companyId in URL
  if (companyId && selectedCompany) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          {/* Breadcrumb */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              background: 'white',
              borderRadius: 2
            }}
          >
            <Breadcrumbs>
              <Link
                component="button"
                onClick={handleBackToList}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#1976D2',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
                Danh sách công ty
              </Link>
              <Typography color="text.primary">{selectedCompany.name}</Typography>
            </Breadcrumbs>
          </Paper>

          {/* Company Detail Card */}
          <Paper
            elevation={8}
            sx={{
              p: 4,
              background: 'white',
              borderRadius: 3,
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Box
                component="img"
                src={selectedCompany.logo_url || 'https://via.placeholder.com/80'}
                alt={selectedCompany.name}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mr: 3,
                  border: '2px solid #e0e0e0'
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#DE221A' }}>
                  {selectedCompany.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip
                    icon={<BusinessIcon />}
                    label={selectedCompany.company_size || 'Không xác định'}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    icon={<LocationIcon />}
                      label={selectedCompany.address || 'Không xác định'}
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {selectedCompany.description || 'Chưa có mô tả về công ty.'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 3 }}>
                <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 600 }}>
                    Quy mô
                  </Typography>
                  <Typography variant="body2">
                    {selectedCompany.company_size || 'Không xác định'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'secondary.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 600 }}>
                    Số công việc
                  </Typography>
                  <Typography variant="body2">
                    {(() => {
                      const jobCount = selectedCompany.jobs_count ?? selectedCompany.job_count ?? 0;
                      return jobCount > 0 ? `${jobCount} vị trí` : 'Đang cập nhật';
                    })()}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                    Website
                  </Typography>
                  <Typography variant="body2">
                    {selectedCompany.website ? (
                      <Link href={selectedCompany.website} target="_blank" rel="noopener">
                        {selectedCompany.website}
                      </Link>
                    ) : (
                      'Không có thông tin'
                    )}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
    );
  }

  return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #DE221A 0%, #B01B14 100%)',
            py: 6,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              KHÁM PHÁ CÁC CÔNG TY HÀNG ĐẦU
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Tìm hiểu về những công ty uy tín và cơ hội việc làm tại các doanh nghiệp hàng đầu Việt Nam
            </Typography>

            {/* Search Bar */}
            <Paper
              elevation={8}
              sx={{
                p: 2,
                maxWidth: 600,
                mx: 'auto',
                background: 'white',
                borderRadius: 3
              }}
            >
              <TextField
                fullWidth
                placeholder="Tìm kiếm công ty theo tên, địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                  if (e.key === 'Escape') {
                    setSearchTerm('');
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchTerm && (
                        <Button
                          size="small"
                          onClick={handleClearSearch}
                          sx={{ 
                            mr: 1, 
                            minWidth: 'auto',
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main' }
                          }}
                          title="Xóa tìm kiếm"
                        >
                          ✕
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading || (searchTerm.trim().length > 0 && searchTerm.trim().length < 2)}
                        sx={{
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #DE221A 30%, #FF5A52 90%)',
                          '&:disabled': {
                            background: '#ccc'
                          }
                        }}
                        title={
                          searchTerm.trim().length > 0 && searchTerm.trim().length < 2
                            ? 'Vui lòng nhập ít nhất 2 ký tự'
                            : 'Tìm kiếm công ty'
                        }
                      >
                        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                      </Button>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'white'
                  }
                }}
              />
            </Paper>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {loading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {[...Array(6)].map((_, index) => (
                <Paper key={index} elevation={4} sx={{ p: 3, borderRadius: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                  <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="100%" height={80} />
                </Paper>
              ))}
            </Box>
          ) : error ? (
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'white',
                borderRadius: 3
              }}
            >
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={loadCompanies}
                sx={{
                  background: 'linear-gradient(45deg, #DE221A 30%, #FF5A52 90%)',
                  borderRadius: 2
                }}
              >
                Thử lại
              </Button>
            </Paper>
          ) : (
            <>
              {/* Results Header */}
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  mb: 3,
                  background: 'white',
                  borderRadius: 3
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#DE221A' }}>
                  Tìm thấy {companies.length} công ty
                </Typography>
                {searchTerm && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Kết quả tìm kiếm cho: "<strong>{searchTerm}</strong>"
                    {companies.length === 0 && (
                      <span style={{ color: '#f44336' }}> - Không tìm thấy kết quả</span>
                    )}
                  </Typography>
                )}
                {totalPages > 1 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Trang {currentPage} / {totalPages} • Hiển thị {((currentPage - 1) * companiesPerPage + 1)} - {Math.min(currentPage * companiesPerPage, companies.length)} / {companies.length} công ty
                  </Typography>
                )}
              </Paper>

              {/* Companies Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: 3,
                  mb: 4
                }}
              >
                {getPaginatedCompanies().map((company) => (
                  <Paper
                    key={company.id}
                    elevation={6}
                    onClick={() => handleCompanyClick(company)}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      borderRadius: 3,
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        background: '#f5f5f5'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        component="img"
                        src={company.logo_url || 'https://via.placeholder.com/60'}
                        alt={company.name}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 2,
                          mr: 2,
                          border: '2px solid #e0e0e0'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#DE221A',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {company.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {company.company_size || 'Không xác định quy mô'}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                      }}
                    >
                      {company.description || 'Chưa có mô tả về công ty này.'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {company.address && (
                        <Chip
                          size="small"
                          icon={<LocationIcon />}
                          label={company.address}
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                      {(() => {
                        const jobCount = company.jobs_count ?? company.job_count ?? 0;
                        return jobCount > 0 && (
                          <Chip
                            size="small"
                            icon={<BusinessIcon />}
                            label={`${jobCount} việc làm`}
                            variant="outlined"
                            color="primary"
                          />
                        );
                      })()}
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* No Results */}
              {companies.length === 0 && !loading && (
                <Paper
                  elevation={4}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2, color: '#DE221A' }}>
                    🔍 Không tìm thấy công ty phù hợp
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả công ty
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClearSearch}
                    sx={{
                      background: 'linear-gradient(45deg, #DE221A 30%, #FF5A52 90%)',
                      borderRadius: 2
                    }}
                  >
                    Xem tất cả công ty
                  </Button>
                </Paper>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 2,
                      background: 'white',
                      borderRadius: 3
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          '&.Mui-selected': {
                            backgroundColor: '#DE221A',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#B01B14'
                            }
                          }
                        }
                      }}
                    />
                  </Paper>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
  );
};

export default CompaniesPage;