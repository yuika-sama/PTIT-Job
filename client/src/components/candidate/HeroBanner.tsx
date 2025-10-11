import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  WorkOutline as WorkOutlineIcon
} from '@mui/icons-material';

interface HeroBannerProps {
  onPlayVideo?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onPlayVideo }) => {
  const handlePlayClick = () => {
    onPlayVideo?.();
    // You can add video modal logic here
    console.log('Play video clicked');
  };

  const features = [
    { icon: <StarIcon />, text: 'Công cụ AI thông minh', color: '#ffd54f' },
    { icon: <WorkOutlineIcon />, text: 'Việc làm chất lượng', color: '#4caf50' },
    { icon: <TrendingUpIcon />, text: 'Phát triển sự nghiệp', color: '#2196f3' }
  ];

  return (
    <Card sx={{ 
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 4,
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3f72af 100%)',
      color: 'white',
      minHeight: 280,
      '&:hover': {
        '& .play-button': {
          transform: 'scale(1.1)',
          backgroundColor: 'rgba(255,255,255,0.3)'
        },
        '& .hero-content': {
          transform: 'translateY(-4px)'
        },
        '& .feature-cards': {
          '& .feature-card': {
            transform: 'translateY(-2px)'
          }
        }
      },
      transition: 'all 0.3s ease'
    }}>
      {/* Background Patterns */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
          linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)
        `,
        zIndex: 1
      }} />
      
      {/* Floating Decorations */}
      <Box sx={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        zIndex: 1
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 120,
        height: 120,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        zIndex: 1
      }} />

      <CardContent sx={{ 
        p: 4, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Header Content */}
        <Box 
          className="hero-content"
          sx={{ 
            transition: 'transform 0.3s ease'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(255,213,79,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,213,79,0.3)'
            }}>
              <LightbulbIcon sx={{ fontSize: 32, color: '#ffd54f' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                Tiếp lợi thế, nối thành công
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Cùng PTIT Job phát triển sự nghiệp
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ 
            opacity: 0.9, 
            lineHeight: 1.7, 
            maxWidth: 500,
            mb: 3
          }}>
            Nền tảng tuyển dụng hàng đầu với công nghệ AI thông minh, 
            hỗ trợ ứng viên tìm kiếm cơ hội nghề nghiệp phù hợp và phát triển bền vững.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Box 
          className="feature-cards"
          sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            mt: 2
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              className="feature-card"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ color: feature.color, display: 'flex' }}>
                {feature.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, height: 40 }}>
        </Box>
      </CardContent>

      {/* Bottom Gradient Accent */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(90deg, #ffd54f 0%, #ff8a65 50%, #81c784 100%)',
        zIndex: 3
      }} />
    </Card>
  );
};

export default HeroBanner;