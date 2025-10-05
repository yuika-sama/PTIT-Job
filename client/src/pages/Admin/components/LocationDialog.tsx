import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationCity as LocationIcon,
  Code as CodeIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { Location, CreateLocationRequest } from '../../../services/types';

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  location: Location | null;
  formData: CreateLocationRequest;
  setFormData: (data: CreateLocationRequest) => void;
  onSave: () => void;
}

const generateSlug = (city: string): string => {
  const combined = `${city}`;
  return combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Common countries for Vietnam job market
const commonCountries = [
  'Vietnam',
  'Singapore',
  'Japan',
  'South Korea',
  'United States',
  'Australia',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Thailand',
  'Malaysia',
  'Philippines',
  'Indonesia',
  'China',
  'Taiwan',
  'Hong Kong'
];

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onClose,
  mode,
  location,
  formData,
  setFormData,
  onSave
}) => {
  const handleInputChange = (field: keyof CreateLocationRequest, value: string | boolean) => {
    const newFormData = {
      ...formData,
      [field]: value
    };

    // Auto-generate slug when city changes in add mode
    if ((field === 'city') && mode === 'add' && newFormData.city) {
      newFormData.slug = generateSlug(newFormData.city);
    }
    
    setFormData(newFormData);
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {mode === 'add' ? 'Thêm địa điểm mới' : 
             mode === 'edit' ? 'Chỉnh sửa địa điểm' : 
             'Chi tiết địa điểm'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Thông tin địa điểm</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 300px' }}
                    label="Thành phố"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={isReadOnly}
                    required
                    placeholder="Nhập tên thành phố..."
                  />

                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 300px' }}
                    label="Slug"
                    value={formData.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    disabled={isReadOnly || mode === 'add'} // Auto-generated in add mode
                    helperText={mode === 'add' ? 'Slug sẽ được tạo tự động từ thành phố và quốc gia' : 'URL-friendly identifier'}
                    InputProps={{
                      startAdornment: <CodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {mode === 'view' && location && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Thông tin bổ sung</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Địa chỉ đầy đủ:
                    </Typography>
                    <Typography variant="body1">
                      {[location.city].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Số lượng việc làm:
                    </Typography>
                    <Chip
                      label={`${location.job_count || 0} việc làm`}
                      color={location.job_count && location.job_count > 0 ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          
          {mode !== 'view' && (
            <Button
              variant="contained"
              onClick={onSave}
              disabled={!formData.city.trim()}
            >
              {mode === 'add' ? 'Thêm địa điểm' : 'Cập nhật'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialog;