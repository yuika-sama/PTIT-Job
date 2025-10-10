import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { Business as BusinessIcon, LocationOn as LocationIcon, Star as StarIcon, AttachMoney as SalaryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
export interface JobCardProps {
  title: string;
  company: string;
  location: string;
  isFeatured?: boolean;
  minSalary: number; // triệu
  maxSalary: number; // triệu
  index?: number; // optional for mock demo
}

const JobCard: React.FC<JobCardProps> = ({ title, company, location, isFeatured, minSalary, maxSalary }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate('/jobs');
  }

  return (
    <Card
      variant="outlined"
      sx={{
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} onClick={handleCardClick}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ flex: 1 }} >
              {title}
            </Typography>
            {isFeatured && <StarIcon sx={{ color: 'gold', fontSize: 16 }} />}
          </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <BusinessIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              {company}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <LocationIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              {location}
            </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="primary" fontWeight="bold">
            <SalaryIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            {minSalary}-{maxSalary} triệu
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
