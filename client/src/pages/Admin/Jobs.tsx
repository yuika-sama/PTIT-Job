import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon } from '@mui/icons-material';
import JobStatsCards from './components/JobStatsCards';
import JobSearchFilters from './components/JobSearchFilters';
import JobTable from './components/JobTable';
import JobDialog from './components/JobDialog';
import { jobService } from '../../services';
import { Job, JobType } from '../../services/types';

interface JobFilters {
  search: string;
  jobType: string;
  location: string;
  status: string;
  experienceLevel: string;
}

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

const Jobs: React.FC = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    jobType: '',
    location: '',
    status: '',
    experienceLevel: ''
  });
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    salary_min: 0,
    salary_max: 0,
    currency: 'VND',
    job_type: 'full_time',
    status: 'draft',
    expiry_date: '',
    company_name: '',
    category_name: '',
    location_name: '',
    company_id: '',
    category_id: '',
    location_id: ''
  });

  const itemsPerPage = 8;

const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getAllJobs({
        page,
        limit: itemsPerPage,
        search: filters.search || undefined,
        jobType: filters.jobType || undefined,
        location: filters.location || undefined,
        status: filters.status || undefined,
        experienceLevel: filters.experienceLevel || undefined
      });
      
      console.log('Jobs response:', response);
      
      if (response.success && response.data) {
        setJobs(response.data || []);
        setTotalJobs(response.count || 0); 
      } else {
        setError(response.message || 'Lỗi khi tải danh sách việc làm');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Lỗi khi tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  }, [page, filters, itemsPerPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddJob = () => {
    setDialogMode('add');
    setSelectedJob(null);
    setFormData({
      title: '',
      description: '',
      requirements: '',
      benefits: '',
      salary_min: 0,
      salary_max: 0,
      currency: 'VND',
      job_type: 'full_time',
      status: 'draft',
      expiry_date: '',
      company_name: '',
      category_name: '',
      location_name: '',
      company_id: '',
      category_id: '',
      location_id: ''
    });
    setDialogOpen(true);
  };
  const handleEditJob = (job: Job) => {
    setDialogMode('edit');
    setSelectedJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      currency: job.currency,
      job_type: job.job_type,
      status: job.status,
      expiry_date: job.expiry_date,
      company_name: job.company_name,
      category_name: job.category_name,
      location_name: job.location_name,
      company_id: job.company_id,
      category_id: job.category_id,
      location_id: job.location_id
    });
    setDialogOpen(true);
  };

  const handleViewJob = (job: Job) => {
    setDialogMode('view');
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa việc làm này?')) {
      return;
    }

    try {
      const response = await jobService.deleteJob(jobId);
      if (response.success) {
        await fetchJobs(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi xóa việc làm');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Lỗi khi xóa việc làm');
    }
  };

  const handleSaveJob = async () => {
    try {
      setError(null);
      
      if (!formData.title.trim()) {
        setError('Tiêu đề việc làm không được để trống');
        return;
      }
      if (!formData.company_name.trim()) {
        setError('Tên công ty không được để trống');
        return;
      }

      if (!formData.description.trim()) {
        setError('Mô tả công việc không được để trống');
        return;
      }

      let response;
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        salary_min: formData.salary_min,
        salary_max: formData.salary_max,
        currency: formData.currency,
        job_type: formData.job_type,
        status: formData.status,
        expiry_date: formData.expiry_date,
        company_name: formData.company_name,
        category_name: formData.category_name,
        location_name: formData.location_name
      };

      if (dialogMode === 'add') {
        response = await jobService.createJob(jobData);
      } else {
        response = await jobService.updateJob(selectedJob!.id, jobData);
      }

      if (response.success) {
        setDialogOpen(false);
        await fetchJobs(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi lưu thông tin việc làm');
      }
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Lỗi khi lưu thông tin việc làm');
    }
  };

  const totalPages = Math.ceil(totalJobs / itemsPerPage);

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          Quản lý việc làm
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddJob}
        >
          Thêm việc làm
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <JobStatsCards jobs={jobs} loading={loading} />

      <JobSearchFilters 
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      <JobTable
        jobs={jobs}
        loading={loading}
        page={page}
        itemsPerPage={itemsPerPage}
        onEdit={handleEditJob}
        onView={handleViewJob}
        onDelete={handleDeleteJob}
      />

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      <JobDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        job={selectedJob}
        formData={formData}
        setFormData={(data: JobFormData) => setFormData(data)}
        onSave={handleSaveJob}
      />
    </Box>
  );
};

export default Jobs;