import React from 'react';
import { Alert, Box, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@mui/material/styles';

interface UploadStepProps {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  onReset: () => void;
}

const UploadStepComponent: React.FC<UploadStepProps> = ({ selectedFile, onFileChange, onReset }) => {
  const theme = useTheme();

  return (
    <Box sx={{ my: 3 }}>
      {!selectedFile ? (
        <Box
          sx={{
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: `${theme.palette.primary.main}08`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}12`,
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
            },
          }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 1,
            }}
          />
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: theme.palette.primary.main,
              mb: 2,
              zIndex: 0,
            }}
          />
          <Typography variant="h6" color="primary" fontWeight={600} sx={{ zIndex: 0 }}>
            Drag & drop CV or click to choose
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, zIndex: 0 }}>
            Supported format: PDF only, up to 10MB
          </Typography>
        </Box>
      ) : (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={onReset}>
              <RefreshIcon />
            </IconButton>
          }
        >
          <Typography variant="body2">
            <strong>{selectedFile.name}</strong> uploaded successfully.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default React.memo(UploadStepComponent);
