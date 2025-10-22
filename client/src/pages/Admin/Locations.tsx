import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon } from '@mui/icons-material';
import LocationStatsCards from './components/LocationStatsCards';
import LocationSearchFilters from './components/LocationSearchFilters';
import LocationTable from './components/LocationTable';
import LocationDialog from './components/LocationDialog';
import { locationService } from '../../services';
import { Location, CreateLocationRequest, LocationFilters } from '../../services/types';

const Locations: React.FC = () => {
  const theme = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalLocations, setTotalLocations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LocationFilters>({
    search: '',
    country: '',
    status: ''
  });
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<CreateLocationRequest>({
    city: '',
    slug: '',
    job_count: 0
  });

  const itemsPerPage = 8;

  const fetchLocations = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.getAllLocations({
        page,
        limit: itemsPerPage,
        search: filters.search || undefined,
        country: filters.country || undefined,
        status: filters.status || undefined
      });
      
      console.log('Locations response:', response.data);
      
      if (response.success && response.data) {
        setLocations(response.data || []);
        setTotalLocations(response.data.length || 0);
      } else {
        setError(response.message || 'Lỗi khi tải danh sách địa điểm');
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Lỗi khi tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  }, [page, filters, itemsPerPage]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleFilterChange = (newFilters: LocationFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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
      const response = await locationService.deleteLocation(locationId);
      if (response.success) {
        await fetchLocations(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi xóa địa điểm');
      }
    } catch (err) {
      console.error('Error deleting location:', err);
      setError('Lỗi khi xóa địa điểm');
    }
  };

  const handleToggleStatus = async (locationId: string) => {
    try {
      const response = await locationService.toggleLocationStatus(locationId);
      if (response.success) {
        await fetchLocations(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi thay đổi trạng thái địa điểm');
      }
    } catch (err) {
      console.error('Error toggling location status:', err);
      setError('Lỗi khi thay đổi trạng thái địa điểm');
    }
  };

  const handleSaveLocation = async () => {
    try {
      setError(null);
      
      if (!formData.city.trim()) {
        setError('Tên thành phố không được để trống');
        return;
      }

      let response;
      const locationData = {
        city: formData.city,
        slug: formData.slug,
        job_count: formData.job_count
      };

      if (dialogMode === 'add') {
        response = await locationService.createLocation(locationData);
      } else {
        response = await locationService.updateLocation(selectedLocation!.id, locationData);
      }

      if (response.success) {
        setDialogOpen(false);
        await fetchLocations(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi lưu thông tin địa điểm');
      }
    } catch (err) {
      console.error('Error saving location:', err);
      setError('Lỗi khi lưu thông tin địa điểm');
    }
  };

  const totalPages = Math.ceil(totalLocations / itemsPerPage);

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Quản lý địa điểm
            </Typography>
            <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddLocation}
            >
            Thêm địa điểm
            </Button>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            </Alert>
        )}

        <LocationStatsCards locations={locations} loading={loading} />

        <LocationSearchFilters 
            filters={filters}
            onFiltersChange={handleFilterChange}
        />

        <LocationTable
            locations={locations}
            loading={loading}
            page={page}
            itemsPerPage={itemsPerPage}
            onView={handleViewLocation}
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
            onToggleStatus={handleToggleStatus}
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

        <LocationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={dialogMode}
            location={selectedLocation}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveLocation}
        />
    </Box>
  );
};

export default Locations;