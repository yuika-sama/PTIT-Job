import React from 'react';
import { 
  Typography, 
  Button,
  Paper
} from '@mui/material';

interface CompanyIntroductionProps {
  description: string;
  onShowMore?: () => void;
}

const CompanyIntroduction: React.FC<CompanyIntroductionProps> = ({ 
  description, 
  onShowMore 
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#009a3e' }}>
        Giới thiệu công ty
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
        <strong>Tại sao nên gia nhập AWING Media & Technologies JSC?</strong>
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7, mt: 2 }}>
        {description}
      </Typography>
      {onShowMore && (
        <Button 
          variant="text" 
          onClick={onShowMore}
          sx={{ mt: 2, color: '#009a3e', textTransform: 'none', fontWeight: 600 }}
        >
          Xem thêm ▼
        </Button>
      )}
    </Paper>
  );
};

export default CompanyIntroduction;