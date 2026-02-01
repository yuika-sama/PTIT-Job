import React from 'react';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material/styles';

interface HighlightsSectionProps {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  strengths,
  improvements,
  recommendations,
}) => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Strengths',
      data: strengths,
      color: theme.palette.success.main,
      icon: <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />,
    },
    {
      title: 'Improvements',
      data: improvements,
      color: theme.palette.warning.main,
      icon: <WarningAmberIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />,
    },
    {
      title: 'Recommendations',
      data: recommendations,
      color: theme.palette.info.main,
      icon: <SchoolIcon sx={{ color: theme.palette.info.main, mr: 1 }} />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column' }, gap: 3, mb: 3 }}>
      {sections.map(section => (
        <Box key={section.title} sx={{ flex: 1 }}>
          <Card sx={{ height: '100%', borderTop: `4px solid ${section.color}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {section.icon}
                <Typography variant="h6" fontWeight={600}>
                  {section.title}
                </Typography>
              </Box>
              {section.data.map((value, index) => (
                <Chip
                  key={`${section.title}-${index}`}
                  label={value}
                  size="small"
                  sx={{
                    m: 0.5,
                    backgroundColor: `${section.color}20`,
                    color: section.color,
                  }}
                />
              ))}
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default HighlightsSection;
