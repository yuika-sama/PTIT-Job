import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Pagination } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CategoryStatsCards from './components/CategoryStatsCards';
import CategorySearchFilters from './components/CategorySearchFilters';
import CategoryTable from './components/CategoryTable';
import CategoryDialog from './components/CategoryDialog';
import { jobCategoryService } from '../../services';
import { JobCategory, CreateJobCategoryRequest, CategoryFilters } from '../../services/types';

const JobCategories: React.FC = () => {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    status: ''
  });
  
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

  const itemsPerPage = 8;

  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobCategoryService.getAllCategories({
        page,
        limit: itemsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined
      });
      
      console.log('Categories response:', response.data);
      
      if (response.success && response.data) {
        setCategories(response.data || []);
        setTotalCategories(response.data.length || 0);
      } else {
        setError(response.message || 'Lỗi khi tải danh sách danh mục');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, [page, filters, itemsPerPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFilterChange = (newFilters: CategoryFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddCategory = () => {
    setDialogMode('add');
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: ''
    });
    setDialogOpen(true);
  };

  const handleEditCategory = (category: JobCategory) => {
    setDialogMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
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
      const response = await jobCategoryService.deleteCategory(categoryId);
      if (response.success) {
        await fetchCategories(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi xóa danh mục');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Lỗi khi xóa danh mục');
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      const response = await jobCategoryService.toggleCategoryStatus(categoryId);
      if (response.success) {
        await fetchCategories(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi thay đổi trạng thái danh mục');
      }
    } catch (err) {
      console.error('Error toggling category status:', err);
      setError('Lỗi khi thay đổi trạng thái danh mục');
    }
  };

  const handleSaveCategory = async () => {
    try {
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Tên danh mục không được để trống');
        return;
      }

      let response;
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        is_active: formData.is_active
      };

      if (dialogMode === 'add') {
        response = await jobCategoryService.createCategory(categoryData);
      } else {
        response = await jobCategoryService.updateCategory(selectedCategory!.id, categoryData);
      }

      if (response.success) {
        setDialogOpen(false);
        await fetchCategories(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi lưu thông tin danh mục');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Lỗi khi lưu thông tin danh mục');
    }
  };

  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              Quản lý danh mục việc làm
            </Typography>
            <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            >
            Thêm danh mục
            </Button>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            </Alert>
        )}

        <CategoryStatsCards categories={categories} loading={loading} />

        <CategorySearchFilters 
            filters={filters}
            onFiltersChange={handleFilterChange}
        />

        <CategoryTable
            categories={categories}
            loading={loading}
            page={page}
            itemsPerPage={itemsPerPage}
            onView={handleViewCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
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

        <CategoryDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={dialogMode}
            category={selectedCategory}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveCategory}
        />
    </Box>
  );
};

export default JobCategories;