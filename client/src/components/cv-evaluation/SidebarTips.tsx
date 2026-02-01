import React from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';

const GUIDE_STEPS = [
  'Upload a PDF CV (max 10MB)',
  'Let the AI service analyse your document',
  'Review the suggested improvements and follow-ups',
];

const SidebarTipsComponent: React.FC = () => {
  const theme = useTheme();
  const capabilities = [
    { icon: <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />, text: 'Strength & weakness detection' },
    { icon: <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />, text: 'Skill growth recommendations' },
    { icon: <StarIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />, text: 'Professional scoring overview' },
  ];

  return (
    <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          User guide
        </Typography>
        <Box sx={{ mb: 2 }}>
          {GUIDE_STEPS.map((content, index) => (
            <Typography key={content} variant="body2" color="text.secondary" sx={{ mb: index === GUIDE_STEPS.length - 1 ? 0 : 1 }}>
              {index + 1}. {content}
            </Typography>
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Tip: keep the document structure clean and consistent to achieve the most accurate score.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          AI capabilities
        </Typography>
        {capabilities.map(item => (
          <SidebarRow key={item.text} icon={item.icon} text={item.text} />
        ))}
      </Paper>
    </Box>
  );
};

interface SidebarRowProps {
  icon: React.ReactNode;
  text: string;
}

const SidebarRow: React.FC<SidebarRowProps> = React.memo(({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Box>
));

export default React.memo(SidebarTipsComponent);
