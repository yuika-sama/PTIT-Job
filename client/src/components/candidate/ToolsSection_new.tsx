import React from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

// Data model for the redesigned feature cards
interface FeatureTool {
  id: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactElement;
  accent?: string;
}

const profileTools: FeatureTool[] = [
  {
    id: 'profile',
    title: 'PTIT Profile',
    description:
      'PTIT Profile là bản hồ sơ năng lực giúp bạn xây dựng thương hiệu cá nhân, thể hiện thế mạnh của bạn hơn thông qua việc đính kèm học vấn, kinh nghiệm, dự án, kỹ năng của mình',
    cta: 'Tạo Profile',
    icon: <PersonOutlineIcon fontSize="large" />
  },
  {
    id: 'cv-builder',
    title: 'CV Builder 2.0',
    description:
      'Một chiếc CV chuyên nghiệp sẽ giúp bạn gây ấn tượng với nhà tuyển dụng và tăng khả năng vượt qua vòng lọc CV tại PTIT Job.',
    cta: 'Tạo CV ngay',
    icon: <ArticleOutlinedIcon fontSize="large" />
  }
];

const selfInsightTools: FeatureTool[] = [
  {
    id: 'mbti',
    title: 'Trắc nghiệm tính cách MBTI',
    description:
      'Kết quả trắc nghiệm MBTI chỉ ra cách bạn nhận thức thế giới xung quanh và ra quyết định trong cuộc sống, từ đó, giúp bạn có thêm thông tin để lựa chọn nghề nghiệp chính xác hơn.',
    cta: 'Khám phá ngay',
    icon: <PsychologyAltOutlinedIcon fontSize="large" />
  },
  {
    id: 'mi-test',
    title: 'Trắc nghiệm đa trí thông minh MI',
    description:
      'Trả lời cho câu hỏi "Bạn có trí thông minh nổi trội trong lĩnh vực nào?", từ đó bạn có thể hiểu bản thân mình hơn và đưa ra các quyết định nghề nghiệp phù hợp.',
    cta: 'Khám phá ngay',
    icon: <InsightsOutlinedIcon fontSize="large" />
  }
];

// Shared card component with PTIT theme
const FeatureCard: React.FC<{ tool: FeatureTool }> = ({ tool }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    switch (tool.id) {
      case 'unemployment-insurance':
        navigate('/candidate/unemployment-insurance');
        break;
      case 'compound-interest':
        navigate('/candidate/compound-interest');
        break;
      case 'salary-calculator':
        navigate('/candidate/salary-calculator');
        break;
      case 'personal-income-tax':
        navigate('/candidate/personal-income-tax');
        break;
      default:
        console.log(`Navigate to: ${tool.id}`);
    }
  };
  
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
          boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
          transform: 'translateY(-4px)',
          transition: 'all .25s ease',
          borderColor: `${theme.palette.primary.main}40`
        }
      }}
    >
      <Box sx={{ flex: 1, pr: { xs: 0, md: 3 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: { xs: 17, md: 18 }, 
            fontWeight: 700, 
            mb: 1,
            color: theme.palette.primary.main
          }}
        >
          {tool.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ 
            color: 'text.secondary', 
            lineHeight: 1.55, 
            mb: 2, 
            display: '-webkit-box', 
            WebkitLineClamp: 4, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
        >
          {tool.description}
        </Typography>
        <Button
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          onClick={handleClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
            '&:hover': { 
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
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
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px ${theme.palette.primary.main}30`
          }}
        >
          {React.isValidElement(tool.icon)
            ? React.cloneElement(tool.icon as any, { sx: { fontSize: 40, color: 'white' } })
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
      {/* Section 1 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        '&::before': {
          content: '""',
          width: 4,
          height: 32,
          backgroundColor: theme.palette.primary.main,
          borderRadius: 2,
          mr: 2
        }
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Cùng PTIT Job xây dựng thương hiệu cá nhân
        </Typography>
      </Box>
      
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

      {/* Section 3: Financial Tools */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3, 
        mt: 5,
        height: 32
      }}>
      </Box>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
          gap: 3
        }}
      >
      </Box>
      
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