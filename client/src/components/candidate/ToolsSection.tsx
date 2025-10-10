import React from 'react';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

// Data model for the redesigned feature cards
interface FeatureTool {
  id: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactElement;
  accent?: string; // optional gradient / accent color reference
}

const profileTools: FeatureTool[] = [
  {
    id: 'profile',
    title: 'PTIT Profile',
    description:
      'PTIT Profile là bản hồ sơ năng lực giúp sinh viên PTIT xây dựng thương hiệu cá nhân, thể hiện thế mạnh của bạn hơn thông qua việc đính kèm học vấn, kinh nghiệm, dự án, kỹ năng,... của mình',
    cta: 'Tạo Profile',
    icon: <PersonOutlineIcon fontSize="large" />,
    accent: '#DE221A'
  },
  {
    id: 'cv-builder',
    title: 'CV Builder 2.0',
    description:
      'Một chiếc CV chuyên nghiệp sẽ giúp sinh viên PTIT gây ấn tượng với nhà tuyển dụng và tăng khả năng vượt qua vòng lọc CV.',
    cta: 'Tạo CV ngay',
    icon: <ArticleOutlinedIcon fontSize="large" />,
    accent: '#DE221A'
  }
];

const selfInsightTools: FeatureTool[] = [
  {
    id: 'mbti',
    title: 'Trắc nghiệm tính cách MBTI',
    description:
      'Kết quả trắc nghiệm MBTI chỉ ra cách bạn nhận thức thế giới xung quanh và ra quyết định trong cuộc sống, từ đó, giúp bạn có thêm thông tin để lựa chọn nghề nghiệp chính xác hơn.',
    cta: 'Khám phá ngay',
    icon: <PsychologyAltOutlinedIcon fontSize="large" />,
    accent: '#009a3e'
  },
  {
    id: 'mi-test',
    title: 'Trắc nghiệm đa trí thông minh MI',
    description:
      'Trả lời cho câu hỏi “Bạn có trí thông minh nổi trội trong lĩnh vực nào?”, từ đó bạn có thể hiểu bản thân mình hơn và đưa ra các quyết định nghề nghiệp phù hợp.',
    cta: 'Khám phá ngay',
    icon: <InsightsOutlinedIcon fontSize="large" />,
    accent: '#009a3e'
  }
];

// Shared card component (inline to keep styling tailored for this section)
const FeatureCard: React.FC<{ tool: FeatureTool }> = ({ tool }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        p: { xs: 3, md: 4 },
        height: '100%',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        border: `2px solid ${theme.palette.primary.main}20`,
        '&:hover': {
          boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
          transform: 'translateY(-4px)',
          transition: 'all .25s ease',
          borderColor: `${theme.palette.primary.main}50`
        }
      }}
    >
      <Box sx={{ flex: 1, pr: { xs: 0, md: 3 } }}>
        <Typography variant="h6" sx={{ fontSize: { xs: 17, md: 18 }, fontWeight: 700, mb: 1 }}>
          {tool.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', lineHeight: 1.55, mb: 2, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {tool.description}
        </Typography>
        <Button
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            backgroundColor: theme.palette.primary.main,
            '&:hover': { 
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 4px 16px ${theme.palette.primary.main}40`
            }
          }}
        >
          {tool.cta}
        </Button>
      </Box>

      <Box
        sx={{
          width: 160,
          minWidth: 140,
          ml: 2,
          position: 'relative',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
          }}
        >
          {React.isValidElement(tool.icon)
            ? React.cloneElement(tool.icon as any, { sx: { fontSize: 50, color: 'white' } })
            : tool.icon}
        </Box>
      </Box>
    </Paper>
  );
};

const ToolsSection: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mt: 6 }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shimmer 3s infinite'
          }
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Công cụ hỗ trợ sinh viên PTIT
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
          Xây dựng hồ sơ chuyên nghiệp và khám phá bản thân cùng PTIT Job Portal
        </Typography>
      </Box>

      {/* Section 1 */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: theme.palette.primary.main,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 2
          }
        }}
      >
        Cùng PTIT xây dựng thương hiệu cá nhân
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 5
        }}
      >
        {profileTools.map(tool => (
          <Box key={tool.id}>
            <FeatureCard tool={tool} />
          </Box>
        ))}
      </Box>

      {/* Section 2 */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: theme.palette.primary.main,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 2
          }
        }}
      >
        Thấu hiểu bản thân - Nâng tầm giá trị
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3
        }}
      >
        {selfInsightTools.map(tool => (
          <Box key={tool.id}>
            <FeatureCard tool={tool} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ToolsSection;
