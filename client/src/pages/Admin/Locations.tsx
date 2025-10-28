import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Alert, Pagination, CircularProgress } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import LocationStatsCards from './components/LocationStatsCards';
import LocationSearchFilters from './components/LocationSearchFilters';
import LocationTable from './components/LocationTable';
import LocationDialog from './components/LocationDialog';
import { locationService } from '../../services';
import { Location, CreateLocationRequest } from '../../services/types';

const Locations: React.FC = () => {
  const theme = useTheme();
  
  // Data states
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<CreateLocationRequest>({
    city: '',
    slug: '',
    job_count: 0
  });

  // Fetch locations from API
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.getAllLocations({});
      
      if (response.success && response.data) {
        console.log('✅ Locations loaded successfully:', response.data.length, 'locations');
        setLocations(response.data);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách địa điểm');
      }
    } catch (err: any) {
      console.error('❌ Error fetching locations:', err);
      setError(err.message || 'Không thể tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter locations based on search and filters
  useEffect(() => {
    let filtered = locations;

   if (searchTerm) {
  filtered = filtered.filter(location =>

    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
  
    (location.job_count !== undefined && location.job_count.toString().includes(searchTerm))
  );
}

    if (cityFilter !== 'all') {
      filtered = filtered.filter(location => 
        location.city && location.city === cityFilter
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(location => location.is_active === true);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(location => location.is_active === false);
      }
    }

    setFilteredLocations(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [locations, searchTerm, cityFilter, statusFilter]);

  // Calculate paginated locations
  const totalPages = Math.ceil(filteredLocations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = () => {
    setDialogMode('add');
    setSelectedLocation(null);
    setFormData({
      city: '',
      slug: '',
      job_count: 0
    });
    setDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setDialogMode('edit');
    setSelectedLocation(location);
    setFormData({
      city: location.city,
      slug: location.slug || '',
      job_count: location.job_count || 0
    });
    setDialogOpen(true);
  };

  const handleViewLocation = (location: Location) => {
    setDialogMode('view');
    setSelectedLocation(location);
    setDialogOpen(true);
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await locationService.deleteLocation(locationId);
      if (response.success) {
        console.log('✅ Location deleted successfully');
        await fetchLocations();
      } else {
        throw new Error(response.message || 'Không thể xóa địa điểm');
      }
    } catch (err: any) {
      console.error('❌ Error deleting location:', err);
      setError(err.message || 'Không thể xóa địa điểm');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (locationId: string) => {
    try {
      setLoading(true);
      const response = await locationService.toggleLocationStatus(locationId);
      if (response.success) {
        console.log('✅ Location status updated successfully');
        await fetchLocations();
      } else {
        throw new Error(response.message || 'Không thể thay đổi trạng thái địa điểm');
      }
    } catch (err: any) {
      console.error('❌ Error toggling location status:', err);
      setError(err.message || 'Không thể thay đổi trạng thái địa điểm');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.city.trim()) {
        setError('Tên thành phố không được để trống');
        return;
      }

      const locationData = {
        city: formData.city,
        slug: formData.slug,
        job_count: formData.job_count
      };

      let response;
      if (dialogMode === 'add') {
        console.log('Creating new location:', locationData);
        response = await locationService.createLocation(locationData);
      } else if (dialogMode === 'edit' && selectedLocation) {
        console.log('Updating location:', selectedLocation.id, locationData);
        response = await locationService.updateLocation(selectedLocation.id, locationData);
      }

      if (response?.success) {
        console.log('✅ Location saved successfully');
        setDialogOpen(false);
        await fetchLocations();
      } else {
        throw new Error(response?.message || 'Không thể lưu thông tin địa điểm');
      }
    } catch (err: any) {
      console.error('❌ Error saving location:', err);
      setError(err.message || 'Không thể lưu thông tin địa điểm');
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
          Quản lý địa điểm
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchLocations}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddLocation}
          >
            Thêm địa điểm
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
          <LocationStatsCards locations={locations} loading={false} />

          {/* Search and Filters */}
          <LocationSearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredLocations.length}
            totalCount={locations.length}
          />

          {/* Locations Table */}
          <LocationTable
            locations={paginatedLocations}
            loading={false}
            page={currentPage}
            itemsPerPage={pageSize}
            onView={handleViewLocation}
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
            onToggleStatus={handleToggleStatus}
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

          {/* Location Dialog */}
          <LocationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={dialogMode}
            location={selectedLocation}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveLocation}
          />
        </>
      )}
    </Box>
  );
};

export default Locations;