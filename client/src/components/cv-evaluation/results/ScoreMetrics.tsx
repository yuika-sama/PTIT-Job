import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { CVScoringData } from '../../../types/cvEvaluation';

interface ScoreMetricsProps {
  scoring?: CVScoringData;
  coverage?: number;
  aiServiceHealth: boolean | null;
}

const ScoreMetrics: React.FC<ScoreMetricsProps> = ({ scoring, coverage, aiServiceHealth }) => {
  if (aiServiceHealth !== true) return null;

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          AI scoring breakdown
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <MetricBlock label="TF-IDF Similarity" value={formatValue(scoring?.tfidfSimilarity)} />
          <MetricBlock label="Semantic Similarity" value={formatValue(scoring?.semanticSimilarity)} />
          <MetricBlock label="Skills Coverage" value={formatValue(coverage)} />
        </Box>
      </CardContent>
    </Card>
  );
};

interface MetricBlockProps {
  label: string;
  value: string;
}

const MetricBlock: React.FC<MetricBlockProps> = ({ label, value }) => (
  <Box sx={{ flex: 1, textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" color="primary">
      {value}
    </Typography>
  </Box>
);

const formatValue = (value?: number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'N/A';
  }
  return `${value}%`;
};

export default ScoreMetrics;
