import React from 'react';
import { Paper, Stepper, Step, StepLabel, StepContent, Typography } from '@mui/material';

export interface CVEvaluationStep {
  key: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

interface CVEvaluationStepperProps {
  activeStep: number;
  steps: CVEvaluationStep[];
}

const CVEvaluationStepperComponent: React.FC<CVEvaluationStepperProps> = ({
  activeStep,
  steps,
}) => (
  <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, overflow: 'hidden' }}>
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map(step => (
        <Step key={step.key}>
          <StepLabel StepIconComponent={step.icon}>
            <Typography variant="h6" fontWeight={600}>
              {step.title}
            </Typography>
          </StepLabel>
          <StepContent>{step.content}</StepContent>
        </Step>
      ))}
    </Stepper>
  </Paper>
);

export default React.memo(CVEvaluationStepperComponent);
