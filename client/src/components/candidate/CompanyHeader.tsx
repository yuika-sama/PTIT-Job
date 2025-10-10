import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Avatar,
  Stack,
  Link
} from '@mui/material';
import {
  Language,
  People,
  PersonAddAlt
} from '@mui/icons-material';

interface CompanyData {
  id: number;
  name: string;
  logo: string;
  website: string;
  employeeCount: string;
  followers: number;
}

interface CompanyHeaderProps {
  company: CompanyData;
  isFollowing: boolean;
  onFollow: () => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ 
  company, 
  isFollowing, 
  onFollow 
}) => {
  return (
    <Box>
      {/* Breadcrumb */}
      <Container maxWidth="lg" sx={{ pt: 2, pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Danh sách Công ty &gt; Thông tin công ty & tin tuyển dụng từ {company.name}
        </Typography>
      </Container>

      {/* Company Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a5a3e 0%, #2e7d32 50%, #66bb6a 100%)',
          py: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3Ccircle cx="10" cy="10" r="2"/%3E%3Ccircle cx="50" cy="50" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />

        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            {/* Company Logo */}
            <Avatar
              src={company.logo}
              variant="rounded"
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                backgroundColor: 'white'
              }}
            >
              {company.name.charAt(0)}
            </Avatar>

            {/* Company Info */}
            <Box sx={{ flex: 1, color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {company.name}
              </Typography>
              
              <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Language sx={{ mr: 1, fontSize: 20 }} />
                  <Link href={company.website} color="inherit" underline="none">
                    {company.website}
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>{company.employeeCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonAddAlt sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>{company.followers} người theo dõi</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Follow Button */}
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              startIcon={<PersonAddAlt />}
              onClick={onFollow}
              sx={{
                backgroundColor: isFollowing ? 'transparent' : 'white',
                color: isFollowing ? 'white' : '#009a3e',
                borderColor: 'white',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: isFollowing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'
                }
              }}
            >
              {isFollowing ? 'Đang theo dõi' : 'Theo dõi công ty'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default CompanyHeader;
export type { CompanyData };