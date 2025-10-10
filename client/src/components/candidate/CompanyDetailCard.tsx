import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  Business,
  LocationOn,
  People
} from '@mui/icons-material';

export interface CompanyDetailData {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  establishedYear?: number;
  openJobs?: number;
  isTopCompany?: boolean;
  isFeatured?: boolean;
}

interface CompanyDetailCardProps {
  company: CompanyDetailData;
  onViewCompany?: (companyId: number) => void;
}

const CompanyDetailCard: React.FC<CompanyDetailCardProps> = ({ company, onViewCompany }) => {
  const handleViewCompany = () => {
    onViewCompany?.(company.id);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
          borderColor: '#009a3e'
        }
      }}
    >
      {/* Cover Image */}
      <Box
        sx={{
          height: 200,
          backgroundImage: `url(${company.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
          {company.isTopCompany && (
            <Chip 
              label="TOP COMPANY" 
              size="small" 
              sx={{ 
                backgroundColor: '#ff6b35', 
                color: 'white',
                fontSize: 10,
                height: 22,
                fontWeight: 600
              }} 
            />
          )}
          {company.isFeatured && (
            <Chip 
              label="NỔI BẬT" 
              size="small" 
              sx={{ 
                backgroundColor: '#009a3e', 
                color: 'white',
                fontSize: 10,
                height: 22,
                fontWeight: 600
              }} 
            />
          )}
        </Box>

        {/* Company Logo */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: 24,
            zIndex: 2
          }}
        >
          <Avatar
            src={company.logo}
            variant="rounded"
            sx={{
              width: 80,
              height: 80,
              border: '4px solid white',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {company.name.charAt(0)}
          </Avatar>
        </Box>
      </Box>

      {/* Company Information */}
      <Box sx={{ p: 3, pt: 5 }}>
        {/* Company Name and Industry */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              mb: 0.5,
              color: '#333'
            }}
          >
            {company.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {company.industry}
          </Typography>
        </Box>

        {/* Company Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {company.size}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {company.location}
            </Typography>
          </Box>
          {company.openJobs && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ fontSize: 16, color: '#009a3e', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#009a3e', fontWeight: 600 }}>
                {company.openJobs} vị trí tuyển dụng
              </Typography>
            </Box>
          )}
        </Box>

        {/* Company Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {company.description}
        </Typography>

        {/* Action Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleViewCompany}
          sx={{
            borderColor: '#009a3e',
            color: '#009a3e',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.2,
            '&:hover': { 
              borderColor: '#008035',
              backgroundColor: 'rgba(0,154,62,0.05)'
            }
          }}
        >
          Xem thông tin công ty
        </Button>
      </Box>
    </Paper>
  );
};

export default CompanyDetailCard;