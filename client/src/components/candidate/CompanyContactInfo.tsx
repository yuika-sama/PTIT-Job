import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Paper,
  TextField,
  Stack,
  IconButton
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Share,
  ContentCopy
} from '@mui/icons-material';

interface CompanyContactInfoProps {
  address: string;
  websiteLink: string;
  onViewMap?: () => void;
  onCopyLink: () => void;
}

const CompanyContactInfo: React.FC<CompanyContactInfoProps> = ({
  address,
  websiteLink,
  onViewMap,
  onCopyLink
}) => {
  return (
    <Box>
      {/* Contact Info */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#009a3e' }}>
          Thông tin liên hệ
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Địa chỉ công ty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>
          {onViewMap && (
            <Button 
              variant="text" 
              onClick={onViewMap}
              sx={{ mt: 1, color: '#009a3e', textTransform: 'none', fontWeight: 600, p: 0 }}
            >
              Xem bản đồ
            </Button>
          )}
        </Box>

        {/* Map Placeholder */}
        <Box
          sx={{
            height: 200,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            mb: 3,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"%3E%3Crect fill="%23e0e0e0" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="14"%3EMap View%3C/text%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </Paper>

      {/* Company Sharing */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#009a3e' }}>
          Chia sẻ công ty tới bạn bè
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Sao chép đường dẫn
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={websiteLink}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                readOnly: true,
              }}
            />
            <IconButton onClick={onCopyLink} color="primary">
              <ContentCopy />
            </IconButton>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Chia sẻ qua mạng xã hội
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: '#1877f2' }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: '#1da1f2' }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: '#0077b5' }}>
              <LinkedIn />
            </IconButton>
            <IconButton sx={{ color: '#666' }}>
              <Share />
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CompanyContactInfo;