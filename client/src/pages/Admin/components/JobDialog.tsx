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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Work as JobIcon,
  Business as CompanyIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  DateRange as DateIcon,
  LocationOn as LocationOnIcon,
  BusinessCenter as BusinessIcon
} from '@mui/icons-material';
import { Job, JobType } from '../../../services/types';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_type: JobType;
  status: 'draft' | 'published' | 'expired' | 'closed';
  expiry_date: string;
  company_name: string;
  category_name: string;
  location_name: string;
  company_id: string;
  category_id: string;
  location_id: string;
}

interface JobDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  job: Job | null;
  formData: JobFormData;
  setFormData: (data: JobFormData) => void;
  onSave: () => void;
}

const JobDialog: React.FC<JobDialogProps> = ({
  open,
  onClose,
  mode,
  job,
  formData,
  setFormData,
  onSave
}) => {
  const getJobTypeLabel = (jobType: string) => {
    const labels = {
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'internship': 'Thực tập',
      'freelance': 'Freelance'
    };
    return labels[jobType as keyof typeof labels] || jobType;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'draft': 'Bản nháp',
      'published': 'Đã đăng',
      'expired': 'Hết hạn',
      'closed': 'Đã đóng'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'warning',
      'published': 'success',
      'expired': 'error',
      'closed': 'default'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const formatSalary = (salaryMin: number, salaryMax: number, currency: string) => {
    if (!salaryMin && !salaryMax) return 'Thỏa thuận';
    if (salaryMin && salaryMax) {
      return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} ${currency}`;
    }
    if (salaryMin) {
      return `Từ ${salaryMin.toLocaleString()} ${currency}`;
    }
    if (salaryMax) {
      return `Tối đa ${salaryMax.toLocaleString()} ${currency}`;
    }
    return 'Thỏa thuận';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getNextLineOfDescription = (text: string) => {
  if (!text) return null;

  const normalized = text
    .replace(/\r\n?/g, "\n")   
    .replace(/\\n/g, "\n");  

  const lines = normalized.split("\n");

  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle fontWeight={"bold"}>
        {mode === 'add' && 'Thêm việc làm mới'}
        {mode === 'edit' && 'Chỉnh sửa việc làm'}
        {mode === 'view' && 'Chi tiết việc làm'}
      </DialogTitle>
      <DialogContent>
        {mode === 'view' && job ? (
          <Box sx={{ pt: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <JobIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              <Box>
                <Typography variant="subtitle2">{job.id}</Typography>
                <Typography variant="h6" fontWeight={"bold"}>{job.title}</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  <Chip
                    label={getJobTypeLabel(job.job_type)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={getStatusLabel(job.status)}
                    color={getStatusColor(job.status) as any}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }} fontWeight={"bold"}>
                  <CompanyIcon fontSize="small" />
                  Công ty
                </Typography>
                <Typography variant="body1">
                  {job.company_name || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }} fontWeight={"bold"}>
                  <SalaryIcon fontSize="small" />
                  Mức lương
                </Typography>
                <Typography variant="body1">
                  {formatSalary(job.salary_min, job.salary_max, job.currency)}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={"bold"} color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DateIcon fontSize="small" />
                  Ngày tạo
                </Typography>
                <Typography variant="body1">
                  {formatDate(job.created_at)}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={"bold"} color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ScheduleIcon fontSize="small" />
                  Hạn ứng tuyển
                </Typography>
                <Typography variant="body1">
                  {formatDate(job.expiry_date)}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={"bold"} color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon fontSize="small" />
                  Danh mục
                </Typography>
                <Typography variant="body1">
                  {job.category_name || ''},  {getJobTypeLabel(job.job_type) || ''}
                </Typography>
              </Box>
              
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={"bold"} color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon fontSize="small" />
                  Địa điểm
                </Typography>
                <Typography variant="body1">
                  {job.location_name || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={"bold"} color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ScheduleIcon fontSize="small" />
                  Cập nhật cuối
                </Typography>
                <Typography variant="body1">
                  {formatDate(job.updated_at) || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom fontWeight={"bold"}>Mô tả công việc</Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ whiteSpace: 'pre-wrap' }}
              >
                {getNextLineOfDescription(job.description)}
              </Typography>
            </Box>

            {job.requirements && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom fontWeight={"bold"}>Yêu cầu công việc</Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {getNextLineOfDescription(job.requirements)}
                </Typography>
              </Box>
            )}

            {job.benefits && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom fontWeight={"bold"}>Quyền lợi</Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {getNextLineOfDescription(job.benefits)}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Tiêu đề việc làm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              
              <TextField
                fullWidth
                label="Mô tả công việc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={4}
                required
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ flex: 1, minWidth: 200 }}>
                  <InputLabel>Loại hình công việc</InputLabel>
                  <Select
                    value={formData.job_type}
                    label="Loại hình công việc"
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value as JobType })}
                  >
                    <MenuItem value="full-time">Toàn thời gian</MenuItem>
                    <MenuItem value="part-time">Bán thời gian</MenuItem>
                    <MenuItem value="contract">Hợp đồng</MenuItem>
                    <MenuItem value="internship">Thực tập</MenuItem>
                    <MenuItem value="freelance">Freelance</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl sx={{ flex: 1, minWidth: 200 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={formData.status}
                    label="Trạng thái"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'expired' | 'closed' })}
                  >
                    <MenuItem value="draft">Bản nháp</MenuItem>
                    <MenuItem value="published">Đã đăng</MenuItem>
                    <MenuItem value="expired">Hết hạn</MenuItem>
                    <MenuItem value="closed">Đã đóng</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Tên công ty"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
                
                <TextField
                  sx={{ flex: 1, minWidth: 200 }}
                  label="Danh mục"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Lương tối thiểu"
                  type="number"
                  value={formData.salary_min || ''}
                  onChange={(e) => setFormData({ ...formData, salary_min: Number(e.target.value) })}
                />
                
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="Lương tối đa"
                  type="number"
                  value={formData.salary_max || ''}
                  onChange={(e) => setFormData({ ...formData, salary_max: Number(e.target.value) })}
                />
                
                <TextField
                  sx={{ flex: 1, minWidth: 100 }}
                  label="Đơn vị tiền tệ"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  placeholder="VND"
                />
              </Box>
               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="ID công ty"
                  value={formData.company_id || ''}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                />
                
                <TextField
                  sx={{ flex: 1, minWidth: 150 }}
                  label="ID mã phân loại"
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                />
                
                <TextField
                  sx={{ flex: 1, minWidth: 100 }}
                  label="ID địa điểm"
                  value={formData.location_id || ''}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  placeholder="VND"
                />
               </Box>
              
              <TextField
                fullWidth
                label="Địa điểm"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              />
              
              <TextField
                fullWidth
                label="Yêu cầu công việc"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                multiline
                rows={3}
                required
              />
              
              <TextField
                fullWidth
                label="Quyền lợi"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                multiline
                rows={3}
                required
              />
              
              <TextField
                fullWidth
                label="Hạn ứng tuyển"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                required
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

export default JobDialog;