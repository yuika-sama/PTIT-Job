import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import {
  Category as CategoryIcon,
  CheckCircle as ActiveIcon,
  TrendingUp as PopularIcon,
  Work as JobIcon
} from '@mui/icons-material';
import { JobCategory } from '../../../services/types';

interface CategoryStatsCardsProps {
  categories: JobCategory[];
  loading: boolean;
}

const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({ categories, loading }) => {
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.is_active !== false).length;
  const categoriesWithJobs = categories.filter(cat => (cat.job_count || 0) > 0).length;
  let totalJobs = 0;
  for (const cat of categories) {
    totalJobs += (Number(cat.job_count) || 0);
  }

  const statsData = [
    {
      title: 'Tổng danh mục',
      value: totalCategories,
      icon: <CategoryIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
      textColor: '#1976d2'
    },
    {
      title: 'Danh mục hoạt động',
      value: activeCategories,
      icon: <ActiveIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#e8f5e8',
      textColor: '#2e7d32'
    },
    {
      title: 'Có việc làm',
      value: categoriesWithJobs,
      icon: <PopularIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
      textColor: '#f57c00'
    },
    {
      title: 'Tổng việc làm',
      value: totalJobs,
      icon: <JobIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee',
      textColor: '#d32f2f'
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexWrap: 'wrap',
        '& > *': { 
          flex: '1 1 250px',
          minWidth: 250
        }
      }}>
        {statsData.map((stat, index) => (
          <Card key={index} sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: stat.color,
                  mr: 2
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="h4" component="div" fontWeight="bold" color={stat.textColor}>
                    {stat.value.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryStatsCards;