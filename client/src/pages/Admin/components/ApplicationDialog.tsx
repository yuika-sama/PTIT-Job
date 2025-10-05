import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Avatar,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { JobApplication, ApplicationStatus } from '../../../services/types';

interface ApplicationDialogProps {
  open: boolean;
  onClose: () => void;
  application: JobApplication | null;
  onStatusChange: (applicationId: string, status: ApplicationStatus, note?: string) => void;
}

const getStatusColor = (status: ApplicationStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'pending': return 'warning';
    case 'viewed': return 'info';
    case 'shortlisted': return 'primary';
    case 'hired': return 'success';
    case 'rejected': return 'error';
    default: return 'default';
  }
};

const getStatusText = (status: ApplicationStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ duyệt';
    case 'viewed': return 'Đã xem xét';
    case 'shortlisted': return 'Danh sách ngắn';
    case 'hired': return 'Đã tuyển';
    case 'rejected': return 'Đã từ chối';
    default: return status;
  }
};

const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
  open,
  onClose,
  application,
  onStatusChange
}) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('pending');
  const [note, setNote] = useState('');
  const [showStatusChange, setShowStatusChange] = useState(false);

  if (!application) {
    return null;
  }

  const handleStatusChange = () => {
    onStatusChange(application.id, newStatus, note);
    setShowStatusChange(false);
    setNote('');
    onClose();
  };

  const handleShowStatusChange = () => {
    setNewStatus(application.status);
    setShowStatusChange(true);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chi tiết đơn ứng tuyển</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Thông tin ứng viên và công việc */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Thông tin ứng viên */}
            <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, fontSize: 20 }}>
                      {application.user_name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {application.user_name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ứng viên
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {application.user_email || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Ứng tuyển: {new Date(application.applied_at).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Trạng thái:
                    </Typography>
                    <Chip
                      label={getStatusText(application.status)}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Thông tin công việc */}
            <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {application.job_name || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {application.file_url ? (
                        <a href={application.file_url} target="_blank" rel="noopener noreferrer">
                          Xem Resume
                        </a>
                      ) : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Thư xin việc */}
          {application.cover_letter && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6">Thư xin việc</Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    backgroundColor: 'grey.50',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  {application.cover_letter}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Thay đổi trạng thái */}
          {showStatusChange && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thay đổi trạng thái đơn ứng tuyển
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ flex: '1 1 200px', minWidth: 200 }}>
                      <InputLabel>Trạng thái mới</InputLabel>
                      <Select
                        value={newStatus}
                        label="Trạng thái mới"
                        onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                      >
                        <MenuItem value="pending">Chờ duyệt</MenuItem>
                        <MenuItem value="viewed">Đã xem xét</MenuItem>
                        <MenuItem value="shortlisted">Danh sách ngắn</MenuItem>
                        <MenuItem value="hired">Đã tuyển</MenuItem>
                        <MenuItem value="rejected">Đã từ chối</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú (tùy chọn)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleStatusChange}
                    disabled={newStatus === application.status}
                  >
                    Cập nhật trạng thái
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowStatusChange(false)}
                  >
                    Hủy
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {application.user_email && (
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              component="a"
              href={`mailto:${application.user_email}`}
            >
              Gửi email
            </Button>
          )}
          
          {!showStatusChange && (
            <Button
              variant="contained"
              onClick={handleShowStatusChange}
            >
              Thay đổi trạng thái
            </Button>
          )}
          
          <Button variant="outlined" onClick={onClose}>
            Đóng
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDialog;