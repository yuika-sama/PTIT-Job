import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Alert, Pagination, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import CategoryStatsCards from './components/CategoryStatsCards';
import CategorySearchFilters from './components/CategorySearchFilters';
import CategoryTable from './components/CategoryTable';
import CategoryDialog from './components/CategoryDialog';
import { jobCategoryService } from '../../services';
import { JobCategory, CreateJobCategoryRequest } from '../../services/types';

const JobCategories: React.FC = () => {
  const theme = useTheme();
  
  // Data states
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [formData, setFormData] = useState<CreateJobCategoryRequest>({
    name: '',
    slug: '',
    description: '',
    is_active: true
  });

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobCategoryService.getAllCategories({});
      
      if (response.success && response.data) {
        console.log('✅ Categories loaded successfully:', response.data.length, 'categories');
        setCategories(response.data);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách danh mục');
      }
    } catch (err: any) {
      console.error('❌ Error fetching categories:', err);
      setError(err.message || 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter categories based on search and filters
  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.slug && category.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.job_count !== undefined && category.job_count.toString().includes(searchTerm))
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(category => category.is_active === true);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(category => category.is_active === false);
      }
    }

    setFilteredCategories(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [categories, searchTerm, statusFilter]);

  // Calculate paginated categories
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    setDialogMode('add');
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_active: true
    });
    setDialogOpen(true);
  };

  const handleEditCategory = (category: JobCategory) => {
    setDialogMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      is_active: category.is_active
    });
    setDialogOpen(true);
  };

  const handleViewCategory = (category: JobCategory) => {
    setDialogMode('view');
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await jobCategoryService.deleteCategory(categoryId);
      if (response.success) {
        console.log('✅ Category deleted successfully');
        await fetchCategories();
      } else {
        throw new Error(response.message || 'Không thể xóa danh mục');
      }
    } catch (err: any) {
      console.error('❌ Error deleting category:', err);
      setError(err.message || 'Không thể xóa danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await jobCategoryService.toggleCategoryStatus(categoryId);
      if (response.success) {
        console.log('✅ Category status updated successfully');
        await fetchCategories();
      } else {
        throw new Error(response.message || 'Không thể thay đổi trạng thái danh mục');
      }
    } catch (err: any) {
      console.error('❌ Error toggling category status:', err);
      setError(err.message || 'Không thể thay đổi trạng thái danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Tên danh mục không được để trống');
        return;
      }

      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        is_active: formData.is_active
      };

      let response;
      if (dialogMode === 'add') {
        console.log('Creating new category:', categoryData);
        response = await jobCategoryService.createCategory(categoryData);
      } else if (dialogMode === 'edit' && selectedCategory) {
        console.log('Updating category:', selectedCategory.id, categoryData);
        response = await jobCategoryService.updateCategory(selectedCategory.id, categoryData);
      }

      if (response?.success) {
        console.log('✅ Category saved successfully');
        setDialogOpen(false);
        await fetchCategories();
      } else {
        throw new Error(response?.message || 'Không thể lưu thông tin danh mục');
      }
    } catch (err: any) {
      console.error('❌ Error saving category:', err);
      setError(err.message || 'Không thể lưu thông tin danh mục');
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
          Quản lý danh mục việc làm
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCategories}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
          >
            Thêm danh mục
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
          <CategoryStatsCards categories={categories} loading={false} />

          {/* Search and Filters */}
          <CategorySearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredCategories.length}
            totalCount={categories.length}
          />

          {/* Categories Table */}
          <CategoryTable
            categories={paginatedCategories}
            loading={false}
            page={currentPage}
            itemsPerPage={pageSize}
            onView={handleViewCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
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

          {/* Category Dialog */}
          <CategoryDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={dialogMode}
            category={selectedCategory}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveCategory}
          />
        </>
      )}
    </Box>
  );
};

export default JobCategories;