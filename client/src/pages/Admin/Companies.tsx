import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon } from '@mui/icons-material';
import CompanyStatsCards from './components/CompanyStatsCards';
import CompanySearchFilters from './components/CompanySearchFilters';
import CompanyTable from './components/CompanyTable';
import CompanyDialog from './components/CompanyDialog';
import { companyService } from '../../services';
import { Company } from '../../services/types';

interface CompanyFilters {
  search: string;
  size: string;
  status: string;
}

interface CompanyFormData {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  company_size?: string;
  address?: string;
  logo_url?: string;
}

const Companies: React.FC = () => {
  const theme = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    size: '',
    status: ''
  });
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    website: '',
    email: '',
    company_size: '',
    address: '',
    logo_url: ''
  });

  const itemsPerPage = 8;

  const fetchCompanies = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyService.getAllCompanies({
        page,
        limit: itemsPerPage,
        search: filters.search || undefined,
        size: filters.size || undefined,
        status: filters.status || undefined
      });
      
      if (response.success && response.data) {
        setCompanies(response.data|| []);
        setTotalCompanies(response.data.length || 0);
      } else {
        setError(response.message || 'Lỗi khi tải danh sách công ty');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Lỗi khi tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  }, [page, filters.search, itemsPerPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);
// viet bo loc ***** 
  const handleFilterChange = (newFilters: CompanyFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddCompany = () => {
    setDialogMode('add');
    setSelectedCompany(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      company_size: '',
      address: '',
      logo_url: ''
    });
    setDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setDialogMode('edit');
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      company_size: company.company_size || '',
      address: company.address || '',
      logo_url: company.logo_url || ''
    });
    setDialogOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setDialogMode('view');
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công ty này?')) {
      return;
    }

    try {
      const response = await companyService.deleteCompany(companyId);
      if (response.success) {
        await fetchCompanies(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi xóa công ty');
      }
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Lỗi khi xóa công ty');
    }
  };

  const handleSaveCompany = async () => {
    try {
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Tên công ty không được để trống');
        return;
      }

      let response;
      const companyCreated = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        company_size: formData.company_size,
        address: formData.address,
        logo_url: formData.logo_url
      }
      if (dialogMode === 'add') {
        response = await companyService.createCompany(companyCreated);
      } else {
        response = await companyService.updateCompany(selectedCompany!.id, companyCreated);
      }

      if (response.success) {
        setDialogOpen(false);
        await fetchCompanies(); // Refresh the list
      } else {
        setError(response.message || 'Lỗi khi lưu thông tin công ty');
      }
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Lỗi khi lưu thông tin công ty');
    }
  };

  const totalPages = Math.ceil(totalCompanies / itemsPerPage);

  return (
    <Box p={3}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Quản lý công ty
        </Typography>
        <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddCompany}
        >
        Thêm công ty
        </Button>
    </Box>

    {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        </Alert>
    )}

    <CompanyStatsCards companies={companies} loading={loading} />

    <CompanySearchFilters 
        filters={filters}
        onFiltersChange={handleFilterChange}
    />

    <CompanyTable
        companies={companies}
        loading={loading}
        page={page}
        itemsPerPage={itemsPerPage}
        onEdit={(e) => handleEditCompany(e)}
        onView={(e) => handleViewCompany(e)}
        onDelete={(e) => handleDeleteCompany(e)}
    />

    {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
        />
        </Box>
    )}

    <CompanyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        company={selectedCompany}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveCompany}
    />
    </Box>
  );
};

export default Companies;