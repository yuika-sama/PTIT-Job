import React, { useMemo } from 'react';
import { Box, Container } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import UploadStep from '../../components/cv-evaluation/UploadStep';
import AnalysisStep from '../../components/cv-evaluation/AnalysisStep';
import EvaluationResults from '../../components/cv-evaluation/EvaluationResults';
import SidebarTips from '../../components/cv-evaluation/SidebarTips';
import { createStepIcon } from '../../components/cv-evaluation/StepIconFactory';
import { useCVEvaluation } from '../../hooks/useCVEvaluation';
import CVEvaluationHeader from '../../components/cv-evaluation/CVEvaluationHeader';
import CVEvaluationStepper, {
  CVEvaluationStep,
} from '../../components/cv-evaluation/CVEvaluationStepper';

const UploadStepIcon = createStepIcon(CloudUploadIcon);
const AnalysisStepIcon = createStepIcon(AssessmentIcon);
const ResultStepIcon = createStepIcon(CheckCircleIcon);

const CVEvaluationPage: React.FC = () => {
  const theme = useTheme();
  const {
    selectedFile,
    isUploading,
    cvData,
    activeStep,
    error,
    aiServiceHealth,
    scoreLabel,
    handleFileChange,
    resetUpload,
  } = useCVEvaluation();

  const steps = useMemo<CVEvaluationStep[]>(
    () => [
      {
        key: 'upload',
        title: 'Upload your CV',
        icon: UploadStepIcon,
        content: (
          <UploadStep selectedFile={selectedFile} onFileChange={handleFileChange} onReset={resetUpload} />
        ),
      },
      {
        key: 'analysis',
        title: 'AI processing',
        icon: AnalysisStepIcon,
        content: <AnalysisStep isUploading={isUploading} aiServiceHealth={aiServiceHealth} />,
      },
      {
        key: 'result',
        title: 'Evaluation summary',
        icon: ResultStepIcon,
        content: (
          <EvaluationResults
            cvData={cvData}
            aiServiceHealth={aiServiceHealth}
            error={error}
            scoreLabel={scoreLabel}
            onReset={resetUpload}
          />
        ),
      },
    ],
    [selectedFile, handleFileChange, resetUpload, isUploading, aiServiceHealth, cvData, error, scoreLabel],
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <CVEvaluationHeader helperText="All processing happens securely; we only store records temporarily for this session." />

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, maxWidth: '100%' }}>
          <Box sx={{ flex: { xs: '1', md: '2' }, minWidth: 0 }}>
            <CVEvaluationStepper activeStep={activeStep} steps={steps} />
          </Box>

          <SidebarTips />
        </Box>
      </Container>
    </Box>
  );
};

export default CVEvaluationPage;
