import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Link
} from '@mui/material';
import {
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Company } from '../../../services/types';

interface CompanyFormData {
  name: string;
  description?: string;
  website?: string;
  company_size?: string;
  address?: string;
  logo_url?: string;
}

interface CompanyDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  company: Company | null;
  formData: CompanyFormData;
  setFormData: (data: CompanyFormData) => void;
  onSave: () => void;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({
  open,
  onClose,
  mode,
  company,
  formData,
  setFormData,
  onSave
}) => {
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' && 'Thêm công ty mới'}
        {mode === 'edit' && 'Chỉnh sửa công ty'}
        {mode === 'view' && 'Chi tiết công ty'}
      </DialogTitle>
      <DialogContent>
        {mode === 'view' && company ? (
          <Box sx={{ pt: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar 
                src={company.logo_url} 
                sx={{ width: 80, height: 80, bgcolor: '#1976d2' }}
              >
                {company.logo_url ? undefined : getCompanyInitials(company.name)}
              </Avatar>
              <Box>
                <Typography variant="body2" color="textSecondary">{company.id}</Typography>
                <Typography variant="h6">{company.name}</Typography>
                {company.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, maxWidth: 400 }}>
                    {company.description}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WebsiteIcon fontSize="small" />
                  Website
                </Typography>
                {company.website ? (
                  <Link href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener">
                    {company.website}
                  </Link>
                ) : (
                  <Typography variant="body1">Không có</Typography>
                )}
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneIcon fontSize="small" />
                  Quy mô công ty
                </Typography>
                <Typography variant="body1">
                  {company.company_size || 'Không có'}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon fontSize="small" />
                  Địa chỉ
                </Typography>
                <Typography variant="body1">
                  {company.address || 'Không có'}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Ngày tạo
                </Typography>
                <Typography variant="body1">
                  {new Date(company.created_at).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Cập nhật cuối
                </Typography>
                <Typography variant="body1">
                  {new Date(company.updated_at).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Tên công ty"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Website"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Quy mô"
                  value={formData.company_size || ''}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                  placeholder="1-50, 51-200, 201-500..."
                />
                
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="URL Logo"
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </Box>
              
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Địa chỉ công ty"
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {mode === 'view' ? 'Đóng' : 'Hủy'}
        </Button>
        {mode !== 'view' && (
          <Button variant="contained" onClick={onSave}>
            {mode === 'add' ? 'Thêm' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDialog;