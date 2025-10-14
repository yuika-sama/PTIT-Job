import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  useTheme,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  CalendarToday as CalendarTodayIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { statsService } from '../../services';
import type { StatsData as ApiStatsData } from '../../services/types';

interface StatsBarProps {
  onRefresh?: () => void;
  statsData?: ApiStatsData;
  isLoading?: boolean;
  error?: string;
}

const StatsBar: React.FC<StatsBarProps> = ({
  onRefresh,
  statsData,
  isLoading: propIsLoading = false,
  error: propError
}) => {
  const theme = useTheme();
  const [internalStatsData, setInternalStatsData] = useState<ApiStatsData | null>(null);
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Default stats data if not provided
  const defaultStats: ApiStatsData = {
    totalJobs: 53540,
    newJobsToday: 3502,
    totalCompanies: 2840,
    activeApplicants: 12450
  };

  // Fetch stats from API
  const fetchStats = async () => {
    if (statsData) return; // Don't fetch if data is already provided

    try {
      setInternalIsLoading(true);
      setInternalError(null);
      
      console.log('🔄 Fetching stats from API...');
      const response = await statsService.getGeneralStats();
      
      if (response.success && response.data) {
        setInternalStatsData(response.data);
        console.log('✅ Stats fetched successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error);
      setInternalError(error.message || 'Không thể tải dữ liệu thống kê');
      // Use default stats as fallback
      setInternalStatsData(defaultStats);
    } finally {
      setInternalIsLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await fetchStats();
    }
  };

  // Load stats on component mount
  useEffect(() => {
    if (!statsData) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsData]);

  // Determine which data, loading state, and error to use
  const finalStatsData = statsData || internalStatsData || defaultStats;
  const finalIsLoading = propIsLoading || internalIsLoading;
  const finalError = propError || internalError;

  const stats = finalStatsData;

  const statItems = [
    {
      icon: <WorkIcon sx={{ color: '#d32f2f', fontSize: 28 }} />,
      label: 'Việc làm đang tuyển',
      value: stats.totalJobs.toLocaleString('vi-VN'),
      trend: '+5.2%',
      trendUp: true,
      color: '#d32f2f', // PTIT Red
      bgColor: '#ffebee'
    },
    {
      icon: <TrendingUpIcon sx={{ color: '#1976d2', fontSize: 28 }} />,
      label: 'Việc làm mới hôm nay',
      value: stats.newJobsToday.toLocaleString('vi-VN'),
      trend: '+12.8%',
      trendUp: true,
      color: '#1976d2', // PTIT Blue
      bgColor: '#e3f2fd'
    },
    {
      icon: <BusinessIcon sx={{ color: '#f57c00', fontSize: 28 }} />,
      label: 'Doanh nghiệp hợp tác',
      value: stats.totalCompanies.toLocaleString('vi-VN'),
      trend: '+3.1%',
      trendUp: true,
      color: '#f57c00', // Orange
      bgColor: '#fff3e0'
    },
    {
      icon: <PeopleIcon sx={{ color: '#388e3c', fontSize: 28 }} />,
      label: 'Sinh viên PTIT hoạt động',
      value: stats.activeApplicants.toLocaleString('vi-VN'),
      trend: '+8.7%',
      trendUp: true,
      color: '#388e3c', // Green
      bgColor: '#e8f5e8'
    }
  ];

  if (finalError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        Không thể tải dữ liệu thống kê: {finalError}
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={3}
      sx={{ 
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-3px)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      {/* PTIT-themed Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #d32f2f 0%, #1976d2 100%)', // PTIT colors
        color: 'white',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* PTIT Logo Pattern */}
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <SchoolIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              PTIT Job Market
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cập nhật: {today}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Tooltip title="Làm mới dữ liệu">
          <IconButton 
            onClick={handleRefresh}
            disabled={finalIsLoading}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                transform: 'rotate(180deg)'
              },
              '&:disabled': {
                color: 'rgba(255,255,255,0.5)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {finalIsLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Content */}
      <Box sx={{ p: 3 }}>
        {/* Stats Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 3,
          mb: 3
        }}>
          {statItems.map((stat, index) => (
            <Card
              key={index}
              sx={{
                background: `linear-gradient(135deg, ${stat.bgColor} 0%, #ffffff 100%)`,
                border: `2px solid ${stat.color}15`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: `${stat.color}30`,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${stat.color}20`
                },
                transition: 'all 0.3s ease'
              }}
            >
              {/* Background decoration */}
              <Box sx={{
                position: 'absolute',
                top: -15,
                right: -15,
                width: 80,
                height: 80,
                background: `${stat.color}08`,
                borderRadius: '50%'
              }} />
              
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: `${stat.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem'
                      }}
                    >
                      {stat.label}
                    </Typography>
                    
                    <Typography 
                      variant="h4" 
                      fontWeight={700}
                      sx={{ 
                        color: stat.color,
                        mt: 0.5,
                        mb: 1,
                        lineHeight: 1.2
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: stat.trendUp ? '#4caf50' : '#f44336',
                          transform: stat.trendUp ? 'none' : 'rotate(180deg)'
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: stat.trendUp ? '#4caf50' : '#f44336',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {stat.trend} so với tuần trước
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />
        
        {/* PTIT Footer */}
        <Box sx={{ 
          textAlign: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon sx={{ color: '#d32f2f', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#d32f2f' }}>
              Học viện Công nghệ Bưu chính Viễn thông
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Nền tảng việc làm chính thức dành cho sinh viên và cựu sinh viên PTIT
          </Typography>
          <Typography variant="caption" color="text.secondary">
            🚀 Tính năng mới: AI Career Advisor • Smart Job Matching • Industry Insights
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsBar;