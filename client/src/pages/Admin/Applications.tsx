import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Pagination } from '@mui/material';
import ApplicationStatsCards from './components/ApplicationStatsCards';
import ApplicationSearchFilters from './components/ApplicationSearchFilters';
import ApplicationTable from './components/ApplicationTable';
import ApplicationDialog from './components/ApplicationDialog';
import { jobApplicationService } from '../../services';
import { JobApplication, ApplicationStatus, ApplicationFilters } from '../../services/types';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ApplicationFilters>({
    search: '',
    status: '',
    jobTitle: '',
    company: ''
  });
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const itemsPerPage = 8;

  const fetchApplications = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobApplicationService.getAllApplications({
        page,
        limit: itemsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        jobTitle: filters.jobTitle || undefined,
        company: filters.company || undefined
      });
      
      console.log('Applications response:', response.data);
      
      if (response.success && response.data) {
        setApplications(response.data || []);
        setTotalApplications(response.data.length || 0);
      } else {
        setError(response.message || 'Lỗi khi tải danh sách đơn ứng tuyển');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Lỗi khi tải danh sách đơn ứng tuyển');
    } finally {
      setLoading(false);
    }
  }, [page, filters, itemsPerPage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleFilterChange = (newFilters: ApplicationFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleApproveApplication = async (applicationId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt đơn ứng tuyển này?')) {
      return;
    }

    try {
      const response = await jobApplicationService.updateApplicationStatus(applicationId, 'hired');
      if (response.success) {
        await fetchApplications(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi duyệt đơn ứng tuyển');
      }
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Lỗi khi duyệt đơn ứng tuyển');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối đơn ứng tuyển này?')) {
      return;
    }

    try {
      const response = await jobApplicationService.updateApplicationStatus(applicationId, 'rejected');
      if (response.success) {
        await fetchApplications(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi từ chối đơn ứng tuyển');
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Lỗi khi từ chối đơn ứng tuyển');
    }
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus, note?: string) => {
    try {
      setError(null);
      const response = await jobApplicationService.updateApplicationStatus(applicationId, status, note);
      if (response.success) {
        setDialogOpen(false);
        await fetchApplications(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi cập nhật trạng thái đơn ứng tuyển');
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Lỗi khi cập nhật trạng thái đơn ứng tuyển');
    }
  };

  const totalPages = Math.ceil(totalApplications / itemsPerPage);

  return (
      <Box sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Quản lý đơn ứng tuyển
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <ApplicationStatsCards applications={applications} loading={loading} />

        <ApplicationSearchFilters 
          filters={filters}
          onFiltersChange={handleFilterChange}
        />

        <ApplicationTable
          applications={applications}
          loading={loading}
          page={page}
          itemsPerPage={itemsPerPage}
          onView={handleViewApplication}
          onApprove={handleApproveApplication}
          onReject={handleRejectApplication}
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

        <ApplicationDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          application={selectedApplication}
          onStatusChange={handleStatusChange}
        />
      </Box>
  );
};

export default Applications;