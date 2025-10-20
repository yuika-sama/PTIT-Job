import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box,
  Typography,
  Paper,
  Skeleton,
  Alert,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { companyService } from '../../services';
import type { Company, Job } from '../../services/types';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Load company details with jobs
  const loadCompanyDetails = useCallback(async () => {
    if (!id) {
      setError('ID công ty không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await companyService.getCompanyById(id);
      console.log('Company details:', result.data);
      if (result.data) {
        // Map API response to expected format and handle different field names
        const apiData = result.data as any; // Type assertion to handle dynamic field names
        const companyData: Company = {
          ...result.data,
          // Handle different date field names
          created_at: result.data.created_at || apiData.createdAt || new Date().toISOString(),
          updated_at: result.data.updated_at || apiData.updatedAt || new Date().toISOString(),
        };
        setCompany(companyData);
      } else {
        setError('Không tìm thấy thông tin công ty');
      }
    } catch (err) {
      console.error('Error loading company details:', err);
      setError('Không thể tải thông tin công ty. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCompanyDetails();
  }, [loadCompanyDetails]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow API call
  };

  const handleBackToList = () => {
    navigate('/candidate/companies');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: company?.name || 'Chi tiết công ty',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff'
        }}
      >
        {/* Header Skeleton */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #DE221A 0%, #B01B14 100%)',
            py: 6
          }}
        >
          <Container maxWidth="lg">
            <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Skeleton variant="text" width={400} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)', mt: 2 }} />
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !company) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'Không tìm thấy thông tin công ty'}
            </Alert>
            <Button
              variant="contained"
              onClick={handleBackToList}
              startIcon={<ArrowBackIcon />}
              sx={{
                background: 'linear-gradient(45deg, #DE221A 30%, #FF5A52 90%)',
                borderRadius: 2
              }}
            >
              Quay lại danh sách công ty
            </Button>
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
      {/* Company Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #DE221A 0%, #B01B14 100%)',
          py: 6,
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          {/* Breadcrumb */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link
              component="button"
              onClick={handleBackToList}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                '&:hover': { color: 'white' }
              }}
            >
              <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
              Danh sách công ty
            </Link>
            <Typography sx={{ color: 'white' }}>
              {company.name}
            </Typography>
          </Breadcrumbs>

          {/* Company Header Content */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            {/* Company Logo */}
            <Box
              component="img"
              src={company.logo_url || 'https://placehold.co/120x120/DE221A/ffffff?text=' + encodeURIComponent(company.name.charAt(0))}
              alt={company.name}
              sx={{
                width: 120,
                height: 120,
                objectFit: 'cover',
                borderRadius: 3,
                border: '3px solid rgba(255, 255, 255, 0.2)',
                bgcolor: 'white'
              }}
            />

            {/* Company Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {company.name || 'Tên công ty chưa cập nhật'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {company.company_size && company.company_size.trim() && (
                  <Chip
                    icon={<PeopleIcon />}
                    variant="outlined"
                    label={`${company.company_size} nhân viên`}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}
                {company.address && company.address.trim() && (
                  <Chip
                    icon={<LocationIcon />}
                    label={company.address}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}
                {(() => {
                  const jobCount = company.jobs_count ?? company.job_count ?? 0;
                  return jobCount > 0 && (
                    <Chip
                      icon={<WorkIcon />}
                      label={`${jobCount} việc làm`}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  );
                })()}
                {company.website && company.website.trim() && (
                  <Chip
                    icon={<LanguageIcon />}
                    label="Website"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}
                <IconButton
                  onClick={handleShare}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>

            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
            gap: 4 
          }}
        >
          {/* Left Column - Company Description & Jobs */}
          <Box>
            {/* Company Description */}
            <Paper
              elevation={4}
              sx={{
                p: 4,
                mb: 3,
                borderRadius: 3,
                border: '1px solid #e0e0e0'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#DE221A',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <BusinessIcon />
                Giới thiệu công ty
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  whiteSpace: 'pre-line'
                }}
              >
                {company.description && company.description.trim() 
                  ? company.description 
                  : 'Công ty chưa cung cấp thông tin mô tả chi tiết. Vui lòng liên hệ trực tiếp với công ty để biết thêm thông tin về môi trường làm việc, văn hóa doanh nghiệp và các giá trị cốt lõi.'
                }
              </Typography>
            </Paper>

            {/* Company Jobs */}
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid #e0e0e0'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#DE221A',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <WorkIcon />
                Việc làm tại công ty
              </Typography>

              {loading ? (
                <Box>
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Skeleton variant="text" width="70%" height={30} />
                      <Skeleton variant="text" width="50%" height={20} />
                      <Skeleton variant="text" width="30%" height={20} />
                    </Box>
                  ))}
                </Box>
              ) : company?.jobs && company.jobs.length > 0 ? (
                <Box>
                  {company.jobs.map((job: Job) => (
                    <Card
                      key={job.id}
                      sx={{
                        mb: 2,
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => {
                        // TODO: Navigate to job details
                        navigate(`/candidate/job/${job.id}`);
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#DE221A', mb: 1 }}>
                          {job.title}
                        </Typography>
                        {job.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {job.description.substring(0, 200)}
                            {job.description.length > 200 && '...'}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {job.salary_min && job.salary_max && (
                            <Chip
                              size="small"
                              label={`${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()} ${job.currency || 'VND'}`}
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {job.job_type && (
                            <Chip
                              size="small"
                              label={job.job_type}
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                          {job.status && (
                            <Chip
                              size="small"
                              label={job.status === 'published' ? 'Đang tuyển' : job.status}
                              color={job.status === 'published' ? 'success' : 'default'}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{
                    textAlign: 'center', 
                    py: 6,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '2px dashed #e0e0e0'
                  }}
                >
                  <WorkIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Hiện tại công ty chưa có vị trí tuyển dụng
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Hãy theo dõi công ty để nhận thông báo khi có vị trí mới
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Right Column - Company Contact Info */}
          <Box>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                position: 'sticky',
                top: 20
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#DE221A',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LocationIcon />
                Thông tin liên hệ
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {company.address && company.address.trim() ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                      📍 Địa chỉ:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.address}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                      📍 Địa chỉ:
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                      Chưa cập nhật thông tin địa chỉ
                    </Typography>
                  </Box>
                )}

                {company.website && company.website.trim() ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                      🌐 Website:
                    </Typography>
                    <Link
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#1976D2',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      <LanguageIcon fontSize="small" />
                      {company.website}
                    </Link>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                      🌐 Website:
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                      Chưa cập nhật thông tin website
                    </Typography>
                  </Box>
                )}

                {company.company_size && company.company_size.trim() ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                      👥 Quy mô:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.company_size} nhân viên
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                      👥 Quy mô:
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                      Chưa cập nhật thông tin quy mô
                    </Typography>
                  </Box>
                )}

                {(() => {
                  const jobCount = company.jobs_count ?? company.job_count ?? 0;
                  return (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DE221A' }}>
                        💼 Việc làm:
                      </Typography>
                      <Typography variant="body2" color={jobCount > 0 ? 'text.secondary' : 'text.disabled'}>
                        {jobCount > 0 ? `${jobCount} vị trí đang tuyển dụng` : 'Hiện tại chưa có vị trí tuyển dụng'}
                      </Typography>
                    </Box>
                  );
                })()}

                <Divider />

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EmailIcon />}
                  sx={{
                    borderColor: '#DE221A',
                    color: '#DE221A',
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(222, 34, 26, 0.1)',
                      borderColor: '#DE221A'
                    }
                  }}
                  onClick={() => {
                    // Open default mail client
                    window.location.href = company.website||'';
                  }}
                >
                  Liên hệ công ty
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyDetailPage;