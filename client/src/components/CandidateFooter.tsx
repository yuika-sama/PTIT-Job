import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon
} from '@mui/icons-material';

const CandidateFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    jobs: [
      { label: 'Tìm việc làm', href: '/candidate/jobs' },
      { label: 'Việc làm IT', href: '/candidate/jobs?category=it' },
      { label: 'Việc làm part-time', href: '/candidate/jobs?type=part-time' },
      { label: 'Thực tập sinh', href: '/candidate/jobs?level=intern' }
    ],
    tools: [
      { label: 'Tạo CV online', href: '/candidate/cv-builder' },
      { label: 'Đánh giá CV', href: '/candidate/cv-review' },
      { label: 'Luyện tập phỏng vấn', href: '/candidate/interview-practice' },
      { label: 'Tìm khóa học', href: '/candidate/courses' }
    ],
    support: [
      { label: 'Trung tâm hỗ trợ', href: '/support' },
      { label: 'Hướng dẫn sử dụng', href: '/guide' },
      { label: 'Liên hệ', href: '/contact' },
      { label: 'FAQ', href: '/faq' }
    ],
    company: [
      { label: 'Về PTIT Job', href: '/about' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
      { label: 'Điều khoản sử dụng', href: '/terms' },
      { label: 'Blog', href: '/blog' }
    ]
  };

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com/ptit', label: 'Facebook' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com/school/ptit', label: 'LinkedIn' },
    { icon: <TwitterIcon />, href: 'https://twitter.com/ptit', label: 'Twitter' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com/ptit', label: 'YouTube' }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderTopColor: 'divider',
        mt: 'auto'
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          }, 
          gap: 4,
          mb: 4
        }}>
          {/* Company Info */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WorkIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                PTIT Job
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Nền tảng tìm việc làm hàng đầu dành cho sinh viên và người đi làm, 
              kết nối với hàng nghìn cơ hội việc làm chất lượng.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  96 Định Công, Hoàng Mai, Hà Nội
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  (024) 3623 7033
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  support@ptitjob.edu.vn
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Jobs Links */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Việc làm
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.jobs.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Tools Links */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Công cụ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.tools.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Support & Company Links */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Hỗ trợ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>

            {/* Social Media */}
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Theo dõi chúng tôi
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <Tooltip key={index} title={social.label}>
                  <IconButton
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'primary.light',
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bottom Footer */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} PTIT Job. Bản quyền thuộc về Học viện Công nghệ Bưu chính Viễn thông.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {footerLinks.company.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                variant="caption"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>

      {/* PTIT Branding Strip */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #DE221A 0%, #B01B14 50%, #0A4D8C 100%)',
          py: 1
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="caption" 
            color="white" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 500
            }}
          >
            🎓 Được phát triển bởi sinh viên PTIT - Nơi ươm mầm tài năng công nghệ
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CandidateFooter;