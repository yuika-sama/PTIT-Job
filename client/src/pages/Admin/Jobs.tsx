import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Alert, Pagination, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import JobStatsCards from './components/JobStatsCards';
import JobSearchFilters from './components/JobSearchFilters';
import JobTable from './components/JobTable';
import JobDialog from './components/JobDialog';
import { jobService } from '../../services';
import { Job, JobType } from '../../services/types';

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
  
  // Data states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
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

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getAllJobs({});
      
      if (response.success && response.data) {
        console.log('✅ Jobs loaded successfully:', response.data.length, 'jobs');
        setJobs(response.data);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách việc làm');
      }
    } catch (err: any) {
      console.error('❌ Error fetching jobs:', err);
      setError(err.message || 'Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.requirements && job.requirements.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location_name && job.location_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (jobTypeFilter !== 'all') {
      filtered = filtered.filter(job => job.job_type === jobTypeFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => 
        job.location_name && job.location_name.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [jobs, searchTerm, jobTypeFilter, locationFilter, statusFilter, experienceFilter]);

  // Calculate paginated jobs
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
      setLoading(true);
      const response = await jobService.deleteJob(jobId);
      if (response.success) {
        console.log('✅ Job deleted successfully');
        await fetchJobs();
      } else {
        throw new Error(response.message || 'Không thể xóa việc làm');
      }
    } catch (err: any) {
      console.error('❌ Error deleting job:', err);
      setError(err.message || 'Không thể xóa việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      setLoading(true);
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

      let response;
      if (dialogMode === 'add') {
        console.log('Creating new job:', jobData);
        response = await jobService.createJob(jobData);
      } else if (dialogMode === 'edit' && selectedJob) {
        console.log('Updating job:', selectedJob.id, jobData);
        response = await jobService.updateJob(selectedJob.id, jobData);
      }

      if (response?.success) {
        console.log('✅ Job saved successfully');
        setDialogOpen(false);
        await fetchJobs();
      } else {
        throw new Error(response?.message || 'Không thể lưu thông tin việc làm');
      }
    } catch (err: any) {
      console.error('❌ Error saving job:', err);
      setError(err.message || 'Không thể lưu thông tin việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          Quản lý việc làm
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchJobs}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddJob}
          >
            Thêm việc làm
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <>
          {/* Statistics Cards */}
          <JobStatsCards jobs={jobs} loading={false} />

          {/* Search and Filters */}
          <JobSearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            jobTypeFilter={jobTypeFilter}
            setJobTypeFilter={setJobTypeFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            experienceFilter={experienceFilter}
            setExperienceFilter={setExperienceFilter}
            filteredCount={filteredJobs.length}
            totalCount={jobs.length}
          />

          {/* Jobs Table */}
          <JobTable
            jobs={paginatedJobs}
            loading={false}
            page={currentPage}
            itemsPerPage={pageSize}
            onEdit={handleEditJob}
            onView={handleViewJob}
            onDelete={handleDeleteJob}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* Job Dialog */}
          <JobDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={dialogMode}
            job={selectedJob}
            formData={formData}
            setFormData={(data: JobFormData) => setFormData(data)}
            onSave={handleSaveJob}
          />
        </>
      )}
    </Box>
  );
};

export default Jobs;