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
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { JobCategory, CreateJobCategoryRequest } from '../../../services/types';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  category: JobCategory | null;
  formData: CreateJobCategoryRequest;
  setFormData: (data: CreateJobCategoryRequest) => void;
  onSave: () => void;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  mode,
  category,
  formData,
  setFormData,
  onSave
}) => {
  const handleInputChange = (field: keyof CreateJobCategoryRequest, value: string | boolean) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    
    // Auto-generate slug when name changes in add mode
    if (field === 'name' && mode === 'add' && typeof value === 'string') {
      newFormData.slug = generateSlug(value);
    }
    
    setFormData(newFormData);
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {mode === 'add' ? 'Thêm danh mục mới' : 
             mode === 'edit' ? 'Chỉnh sửa danh mục' : 
             'Chi tiết danh mục'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Thông tin cơ bản</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={mode === 'view'}
                  required
                  placeholder="Nhập tên danh mục..."
                />

                <TextField
                  fullWidth
                  label="Slug"
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  disabled={isReadOnly || mode === 'add'} // Auto-generated in add mode
                  helperText={mode === 'add' ? 'Slug sẽ được tạo tự động từ tên danh mục' : 'URL-friendly identifier'}
                  InputProps={{
                    startAdornment: <CodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Additional Info in View Mode */}
          {mode === 'view' && category && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Thông tin bổ sung</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Số lượng việc làm:
                    </Typography>
                    <Chip
                      label={`${category.job_count || 0} việc làm`}
                      color={category.job_count && category.job_count > 0 ? 'success' : 'default'}
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
              disabled={!formData.name.trim()}
            >
              {mode === 'add' ? 'Thêm danh mục' : 'Cập nhật'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;