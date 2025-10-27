import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Alert, Pagination, CircularProgress, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import ApplicationStatsCards from './components/ApplicationStatsCards';
import ApplicationSearchFilters from './components/ApplicationSearchFilters';
import ApplicationTable from './components/ApplicationTable';
import ApplicationDialog from './components/ApplicationDialog';
import { jobApplicationService } from '../../services';
import { JobApplication, ApplicationStatus } from '../../services/types';

const Applications: React.FC = () => {
  const theme = useTheme();
  
  // Data states
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  // Fetch applications from API
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobApplicationService.getAllApplications({});
      
      if (response.success && response.data) {
        console.log('✅ Applications loaded successfully:', response.data.length, 'applications');
        console.log('📊 Application structure:', response.data[0]);
        
        setApplications(response.data);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách đơn ứng tuyển');
      }
    } catch (err: any) {
      console.error('❌ Error fetching applications:', err);
      setError(err.message || 'Không thể tải danh sách đơn ứng tuyển');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter applications based on search and filters
  useEffect(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => {
        const searchableText = JSON.stringify(app).toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [applications, searchTerm, statusFilter, jobTitleFilter, companyFilter]);

  // Calculate paginated applications
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleApproveApplication = async (applicationId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt đơn ứng tuyển này?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await jobApplicationService.updateApplicationStatus(applicationId, 'hired');
      if (response.success) {
        console.log('✅ Application approved successfully');
        await fetchApplications();
      } else {
        throw new Error(response.message || 'Không thể duyệt đơn ứng tuyển');
      }
    } catch (err: any) {
      console.error('❌ Error approving application:', err);
      setError(err.message || 'Không thể duyệt đơn ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối đơn ứng tuyển này?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await jobApplicationService.updateApplicationStatus(applicationId, 'rejected');
      if (response.success) {
        console.log('✅ Application rejected successfully');
        await fetchApplications();
      } else {
        throw new Error(response.message || 'Không thể từ chối đơn ứng tuyển');
      }
    } catch (err: any) {
      console.error('❌ Error rejecting application:', err);
      setError(err.message || 'Không thể từ chối đơn ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus, note?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobApplicationService.updateApplicationStatus(applicationId, status, note);
      if (response.success) {
        console.log('✅ Application status updated successfully');
        setDialogOpen(false);
        await fetchApplications();
      } else {
        throw new Error(response.message || 'Không thể cập nhật trạng thái đơn ứng tuyển');
      }
    } catch (err: any) {
      console.error('❌ Error updating application status:', err);
      setError(err.message || 'Không thể cập nhật trạng thái đơn ứng tuyển');
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
          Quản lý đơn ứng tuyển
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchApplications}
          disabled={loading}
        >
          Làm mới
        </Button>
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
          <ApplicationStatsCards applications={applications} loading={false} />

          {/* Search and Filters */}
          <ApplicationSearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            jobTitleFilter={jobTitleFilter}
            setJobTitleFilter={setJobTitleFilter}
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
            filteredCount={filteredApplications.length}
            totalCount={applications.length}
          />

          {/* Applications Table */}
          <ApplicationTable
            applications={paginatedApplications}
            loading={false}
            page={currentPage}
            itemsPerPage={pageSize}
            onView={handleViewApplication}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
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

          {/* Application Dialog */}
          <ApplicationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            application={selectedApplication}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </Box>
  );
};

export default Applications;