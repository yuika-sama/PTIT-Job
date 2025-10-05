import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import {
  Business as BusinessIcon,
  Language as WebsiteIcon,
  Image as LogoIcon,
  Groups as PeopleIcon
} from '@mui/icons-material';
import { Company } from '../../../services/types';

interface CompanyStatsCardsProps {
  companies: Company[];
  loading?: boolean;
}

const CompanyStatsCards: React.FC<CompanyStatsCardsProps> = ({ companies }) => {
  // Calculate statistics
  const stats = {
    total: companies.length,
    withWebsite: companies.filter(company => company.website).length,
    withLogo: companies.filter(company => company.logo_url).length,
  };

  const statsCards = [
    {
      title: 'Tổng số công ty',
      value: stats.total,
      icon: <BusinessIcon color="primary" />,
      color: '#1976d2',
      description: 'Tất cả công ty'
    },
    {
      title: 'Có website',
      value: stats.withWebsite,
      icon: <WebsiteIcon sx={{ color: '#4caf50' }} />,
      color: '#4caf50',
      description: 'Công ty có website'
    },
    {
      title: 'Có logo',
      value: stats.withLogo,
      icon: <LogoIcon sx={{ color: '#ff9800' }} />,
      color: '#ff9800',
      description: 'Công ty có logo'
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
      {statsCards.map((card, index) => (
        <Card key={index} sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              {card.icon}
              <Typography variant="h6">{card.title}</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color }}>
              {card.value}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {card.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CompanyStatsCards;