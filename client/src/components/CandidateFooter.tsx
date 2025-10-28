import type React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

const CandidateFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  const footerLinks = {
    jobs: [
      { label: "Tìm việc làm", href: "/candidate/jobs" },
      { label: "Việc làm IT", href: "/candidate/jobs?category=it" },
      { label: "Việc làm part-time", href: "/candidate/jobs?type=part-time" },
      { label: "Thực tập sinh", href: "/candidate/jobs?level=intern" },
    ],
    tools: [
      { label: "Đánh giá CV", href: "/candidate/cv-evaluation" },
      { label: "Giả lập phỏng vấn AI", href: "/candidate/interview-emulate" },
    ],
    support: [
      { label: "Trung tâm hỗ trợ", href: "https://www.facebook.com/HocvienPTIT" },
      { label: "Hướng dẫn sử dụng", href: "https://www.facebook.com/HocvienPTIT" },
      { label: "Liên hệ", href: "https://www.facebook.com/HocvienPTIT" },
      { label: "FAQ", href: "https://www.facebook.com/HocvienPTIT" },
    ],
    company: [
      { label: "Về PTIT Job", href: "https://www.facebook.com/HocvienPTIT" },
      { label: "Chính sách bảo mật", href: "https://www.facebook.com/HocvienPTIT" },
      { label: "Điều khoản sử dụng", href: "https://www.facebook.com/HocvienPTIT" },
      { label: "Blog", href: "https://www.facebook.com/HocvienPTIT" },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, href: "https://www.facebook.com/HocvienPTIT", label: "Facebook" },
    { icon: <LinkedInIcon />, href: "https://www.linkedin.com/school/posts-and-telecommunications-institute-of-technology/", label: "LinkedIn" },
    { icon: <TwitterIcon />, href: "https://twitter.com", label: "X / Twitter" },
    { icon: <YouTubeIcon />, href: "https://www.youtube.com/@PChannels", label: "YouTube" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderTopColor: "divider",
        mt: "auto",
        pt: 6,
        pb: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* --- Main Section --- */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* Company Info */}
          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 23%" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #DE221A 0%, #0A4D8C 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(222, 34, 26, 0.3)",
                }}
              >
                <WorkIcon sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.1rem" }}>
                PTIT Job
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
              Nền tảng tìm việc làm hàng đầu dành cho sinh viên và người đi làm, kết nối với hàng
              nghìn cơ hội việc làm chất lượng.
            </Typography>

            {/* Contact Info */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationIcon sx={{ fontSize: 18, color: "primary.main", mt: 0.3 }} />
                <Typography variant="caption" color="text.secondary">
                  96A, Đường Trần Phú, Quận Hà Đông, Hà Nội
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary">
                  (024) 12 345 67
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary">
                  support@ptitjob.edu.vn
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Jobs Links */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
              Việc làm
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.jobs.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Tools Links */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
              Công cụ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.tools.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Support & Social */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
              Hỗ trợ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>

            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.9rem", mb: 1.5 }} color="text.secondary">
              Theo dõi chúng tôi
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social, index) => (
                <Tooltip key={index} title={social.label}>
                  <IconButton
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: "text.secondary",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "primary.main",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
            © {currentYear} PTIT Job. Bản quyền thuộc về Học viện Công nghệ Bưu chính Viễn thông.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {footerLinks.company.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                variant="caption"
                color="text.secondary"
                sx={{
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>

      <Box
        sx={{
          background: "linear-gradient(135deg, #DE221A 0%, #B01B14 50%, #0A4D8C 100%)",
          py: 2,
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="caption"
            color="white"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 500,
              fontSize: "0.9rem",
              letterSpacing: "0.3px",
            }}
          >
            Được phát triển bởi sinh viên PTIT - Nơi ươm mầm tài năng công nghệ
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CandidateFooter;
