import React from 'react';
import { Box, Typography, Paper, CircularProgress, useTheme} from '@mui/material';
import {
  Computer as ITIcon
} from '@mui/icons-material';
import { JobCategory } from '../../services/types';

interface IndustriesSectionProps {
  categories?: JobCategory[];
  isLoading?: boolean;
}

interface IndustryItem {
  id: number;
  name: string;
  jobs: number;
  icon_url: string | null;
  icon?: React.ReactElement;
}

const IndustriesSection: React.FC<IndustriesSectionProps> = ({ 
  categories = [],
  isLoading = false
}) => {
  const [page] = React.useState(0);
  const theme = useTheme();

  // Convert JobCategory[] to IndustryItem[] format hoặc sử dụng mock data nếu trống
  const displayIndustries: IndustryItem[] = categories.length > 0 
    ? categories.map(category => ({
        id: parseInt(category.id),
        name: category.name,
        jobs: category.job_count || 0,
        icon_url: category.icon_url || null,
      }))
    : [];

  if (isLoading) {
    return (
      <Box sx={{ mb: 6 }}>
        <Paper sx={{
          p: 3,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200
        }}>
          <CircularProgress />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
       <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          '&::before': {
            content: '""',
            width: 4,
            height: 32,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 2,
            mr: 2
          }
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Ngành nghề hàng đầu
          </Typography>
        </Box>

      {/* Industries Grid với design mới */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 3,
        '@media (max-width: 768px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
        }
      }}>
        {displayIndustries.slice(page * 8, page * 8 + 8).map((item, index) => (
          <Paper
            key={item.id}
            sx={{
              p: 0,
              height: 200,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              border: '1px solid #e8e8e8',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: `linear-gradient(135deg, 
                  ${index % 4 === 0 ? '#C62828' : 
                    index % 4 === 1 ? '#1976D2' : 
                    index % 4 === 2 ? '#388E3C' : '#F57C00'}15 0%, 
                  ${index % 4 === 0 ? '#C62828' : 
                    index % 4 === 1 ? '#1976D2' : 
                    index % 4 === 2 ? '#388E3C' : '#F57C00'}05 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 20px 40px ${
                  index % 4 === 0 ? 'rgba(198, 40, 40, 0.15)' : 
                  index % 4 === 1 ? 'rgba(25, 118, 210, 0.15)' : 
                  index % 4 === 2 ? 'rgba(56, 142, 60, 0.15)' : 'rgba(245, 124, 0, 0.15)'
                }`,
                border: `1px solid ${
                  index % 4 === 0 ? '#C62828' : 
                  index % 4 === 1 ? '#1976D2' : 
                  index % 4 === 2 ? '#388E3C' : '#F57C00'
                }30`,
                '&::before': {
                  opacity: 1
                }
              }
            }}
          >
            {/* Content Layout */}
            <Box sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Icon Section */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, 
                    ${index % 4 === 0 ? '#C62828' : 
                      index % 4 === 1 ? '#1976D2' : 
                      index % 4 === 2 ? '#388E3C' : '#F57C00'} 0%, 
                    ${index % 4 === 0 ? '#D32F2F' : 
                      index % 4 === 1 ? '#1E88E5' : 
                      index % 4 === 2 ? '#4CAF50' : '#FF9800'} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 16px ${
                    index % 4 === 0 ? 'rgba(198, 40, 40, 0.3)' : 
                    index % 4 === 1 ? 'rgba(25, 118, 210, 0.3)' : 
                    index % 4 === 2 ? 'rgba(56, 142, 60, 0.3)' : 'rgba(245, 124, 0, 0.3)'
                  }`
                }}>
                  {item.icon_url ? (
                    <img
                      src={item.icon_url}
                      alt={item.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                        filter: 'invert(1) brightness(1.1)',
                      }}
                    />
                  ) : (
                    <ITIcon sx={{ fontSize: 32, color: 'white' }} />
                  )}
                </Box>
                
                {/* Job Count Badge */}
                <Box sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 20,
                  background: `${
                    index % 4 === 0 ? '#C62828' : 
                    index % 4 === 1 ? '#1976D2' : 
                    index % 4 === 2 ? '#388E3C' : '#F57C00'
                  }15`,
                  border: `1px solid ${
                    index % 4 === 0 ? '#C62828' : 
                    index % 4 === 1 ? '#1976D2' : 
                    index % 4 === 2 ? '#388E3C' : '#F57C00'
                  }30`
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 700,
                    color: index % 4 === 0 ? '#C62828' : 
                           index % 4 === 1 ? '#1976D2' : 
                           index % 4 === 2 ? '#388E3C' : '#F57C00',
                    fontSize: '0.75rem'
                  }}>
                    {item.jobs.toLocaleString('vi-VN')} vị trí
                  </Typography>
                </Box>
              </Box>

              {/* Title and Description */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: '#1a1a1a',
                    mb: 1,
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.name}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: '#666',
                    lineHeight: 1.5,
                    mb: 2
                  }}
                >
                  Khám phá cơ hội nghề nghiệp trong lĩnh vực {item.name.toLowerCase()}
                </Typography>

                {/* CTA Button */}
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: index % 4 === 0 ? '#C62828' : 
                         index % 4 === 1 ? '#1976D2' : 
                         index % 4 === 2 ? '#388E3C' : '#F57C00',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  '&:hover': {
                    gap: 1.5
                  },
                  transition: 'gap 0.2s ease'
                }}>
                  Xem chi tiết
                  <Box component="span" sx={{ fontSize: '0.8rem' }}>→</Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default IndustriesSection;
