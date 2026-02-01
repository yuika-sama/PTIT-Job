import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';

interface ScoreCardProps {
  score: number;
  label: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, label }) => {
  const theme = useTheme();
  const filledStars = Math.floor(score / 20);

  return (
    <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
      <CardContent sx={{ textAlign: 'center', color: 'white' }}>
        <Typography variant="h2" fontWeight={700}>
          {score}%
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              sx={{
                color: index < filledStars ? '#FFD700' : 'rgba(255,255,255,0.3)',
                fontSize: 28,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
