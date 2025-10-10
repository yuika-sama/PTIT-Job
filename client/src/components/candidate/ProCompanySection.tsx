import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Paper,
  Avatar,
  Chip
} from '@mui/material';

interface ProCompany {
  id: number;
  name: string;
  logo: string;
  industry: string;
}

interface ProCompanySectionProps {
  companies: ProCompany[];
  onViewMore?: () => void;
}

const ProCompanySection: React.FC<ProCompanySectionProps> = ({
  companies,
  onViewMore
}) => {
  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #1a5a3e 0%, #2e7d32 100%)',
          borderRadius: 2,
          p: 3,
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mr: 2 }}>
              Thương hiệu lớn tiêu biểu cùng lĩnh vực
            </Typography>
            <Chip 
              label="Pro Company" 
              sx={{ 
                backgroundColor: '#ff6b35', 
                color: 'white',
                fontWeight: 600,
                fontSize: 12
              }} 
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Những thương hiệu tuyển dụng đã khẳng định được vị thế trên thị trường.
          </Typography>
        </Box>
      </Box>

      {/* Companies Grid */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(1, 1fr)', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 2 
        }}
      >
        {companies.map((company) => (
          <Paper
            key={company.id}
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderColor: '#009a3e'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={company.logo}
                variant="rounded"
                sx={{ width: 40, height: 40, mr: 2 }}
              >
                {company.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: 13,
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {company.name}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {company.industry}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* View More Button */}
      {onViewMore && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onViewMore}
            sx={{
              borderColor: '#009a3e',
              color: '#009a3e',
              px: 4,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#008035',
                backgroundColor: 'rgba(0,154,62,0.05)'
              }
            }}
          >
            Xem thêm các công ty khác
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProCompanySection;
export type { ProCompany };