import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Alert,
  Container,
  Divider
} from '@mui/material';
import { 
  Palette as PaletteIcon,
  Business as BusinessIcon,
  School as SchoolIcon 
} from '@mui/icons-material';

const PTITColorDemo: React.FC = () => {
  const ptitColors = [
    {
      name: 'PTIT Primary Red',
      hex: '#DE221A',
      rgb: '222, 34, 26',
      usage: 'Màu chủ đạo - Logo, tiêu đề nổi bật'
    },
    {
      name: 'PTIT Primary Dark',
      hex: '#B01B14', 
      rgb: '176, 27, 20',
      usage: 'Phiên bản đậm - Nền, tiêu đề lớn'
    },
    {
      name: 'Accent Blue',
      hex: '#0A4D8C',
      rgb: '10, 77, 140', 
      usage: 'Màu nhấn phụ - Nút, liên kết, highlight'
    },
    {
      name: 'Neutral Gray',
      hex: '#F5F5F5',
      rgb: '245, 245, 245',
      usage: 'Màu nền nhẹ, khoảng cách'
    },
    {
      name: 'Text Dark',
      hex: '#333333',
      rgb: '51, 51, 51',
      usage: 'Màu chữ chính trên nền sáng'
    },
    {
      name: 'Text Light',
      hex: '#FFFFFF',
      rgb: '255, 255, 255',
      usage: 'Màu chữ trên nền tối'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PaletteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" fontWeight="bold" color="primary.main">
            PTIT Job - Branding Palette
          </Typography>
        </Box>
        
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(10, 77, 140, 0.1)',
            color: '#0A4D8C',
            '& .MuiAlert-icon': { color: '#0A4D8C' }
          }}
        >
          Bộ màu thương hiệu PTIT Job đã được áp dụng thành công vào hệ thống!
        </Alert>
      </Box>

      {/* Color Palette */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        🎨 Bảng màu chính
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 2, 
        mb: 4 
      }}>
        {ptitColors.map((color, index) => (
          <Card key={index} elevation={3}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: color.hex,
                    borderRadius: 2,
                    border: '2px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {color.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {color.hex} • RGB({color.rgb})
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {color.usage}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Component Examples */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        🚀 Ví dụ ứng dụng
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Buttons */}
        <Card elevation={2}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Buttons với PTIT Colors
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" size="large">
                Primary Button
              </Button>
              <Button variant="contained" color="secondary" size="large">
                Secondary Button
              </Button>
              <Button variant="outlined" color="primary" size="large">
                Outlined Primary
              </Button>
              <Button variant="outlined" color="secondary" size="large">
                Outlined Secondary
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Chips */}
        <Card elevation={2}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Status Chips
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="PTIT Student" color="primary" icon={<SchoolIcon />} />
              <Chip label="Employer" color="secondary" icon={<BusinessIcon />} />
              <Chip label="Active" color="success" />
              <Chip label="Pending" color="warning" />
              <Chip label="Rejected" color="error" />
              <Chip label="Info" color="info" />
            </Box>
          </CardContent>
        </Card>

        {/* Gradient Example */}
        <Card elevation={2}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #DE221A 0%, #B01B14 50%, #0A4D8C 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                PTIT Job Portal
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Hệ thống tuyển dụng với thương hiệu PTIT
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PTITColorDemo;