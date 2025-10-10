import React from 'react';
import { Box } from '@mui/material';
import UnemploymentInsuranceCalculator from '../../components/candidate/UnemploymentInsuranceCalculator';

const UnemploymentInsurancePage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
    <UnemploymentInsuranceCalculator />
    </Box>
  );
};

export default UnemploymentInsurancePage;