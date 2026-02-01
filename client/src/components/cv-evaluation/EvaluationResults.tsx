import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScoreCard from './results/ScoreCard';
import HighlightsSection from './results/HighlightsSection';
import ExtractedDataSection from './results/ExtractedDataSection';
import ScoreMetrics from './results/ScoreMetrics';
import { CVEvaluationData } from '../../types/cvEvaluation';

interface EvaluationResultsProps {
  cvData: CVEvaluationData;
  aiServiceHealth: boolean | null;
  error: string | null;
  scoreLabel: string;
  onReset: () => void;
}

const EvaluationResultsComponent: React.FC<EvaluationResultsProps> = ({
  cvData,
  aiServiceHealth,
  error,
  scoreLabel,
  onReset,
}) => {
  if (cvData.matchScore === null) return null;

  return (
    <Box
      sx={{
        my: 3,
        maxHeight: '80vh',
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: '#f5f5f5', borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#1976d2', borderRadius: '4px' },
      }}
    >
      <ScoreCard score={cvData.matchScore} label={scoreLabel} />
      <HighlightsSection
        strengths={cvData.strengths}
        improvements={cvData.improvements}
        recommendations={cvData.recommendations}
      />
      <ExtractedDataSection data={cvData.extractedData} />
      <ScoreMetrics scoring={cvData.scoring} coverage={cvData.extractedData?.coverage} aiServiceHealth={aiServiceHealth} />

      {aiServiceHealth === false && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Results are generated from mock data because the AI service was unreachable.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ mr: 2 }}
          onClick={() => alert('PDF export will be added soon.')}
        >
          Download PDF
        </Button>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onReset}>
          Analyse another CV
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(EvaluationResultsComponent);
