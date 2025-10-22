import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Alert, Pagination, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import CompanyStatsCards from './components/CompanyStatsCards';
import CompanySearchFilters from './components/CompanySearchFilters';
import CompanyTable from './components/CompanyTable';
import CompanyDialog from './components/CompanyDialog';
import { companyService } from '../../services';
import { Company } from '../../services/types';

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
  
  // Data states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
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

  // Fetch companies from API
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyService.getAllCompanies({});
      
      if (response.success && response.data) {
        console.log('✅ Companies loaded successfully:', response.data.length, 'companies');
        setCompanies(response.data);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách công ty');
      }
    } catch (err: any) {
      console.error('❌ Error fetching companies:', err);
      setError(err.message || 'Không thể tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter companies based on search and filters
  useEffect(() => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.website && company.website.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.address && company.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sizeFilter !== 'all') {
      filtered = filtered.filter(company => {
        if (!company.company_size) return false;
        
        const size = company.company_size.toLowerCase();
        
        switch (sizeFilter) {
          case '1-10':
            return size.includes('1-10') || size.includes('1 - 10');
          case '11-50':
            return size.includes('11-50') || size.includes('11 - 50');
          case '51-200':
            return size.includes('51-200') || size.includes('51 - 200');
          case '201-500':
            return size.includes('201-500') || size.includes('201 - 500');
          case '501-1000':
            return size.includes('501-1000') || size.includes('501 - 1000');
          case '1000+':
            return size.includes('1000+') || size.includes('1000 +') || size.includes('trên 1000');
          default:
            return company.company_size === sizeFilter;
        }
      });
    }

    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'with-website':
          filtered = filtered.filter(company => company.website && company.website.trim() !== '');
          break;
        case 'with-logo':
          filtered = filtered.filter(company => company.logo_url && company.logo_url.trim() !== '');
          break;
        case 'with-email':
          filtered = filtered.filter(company => company.email && company.email.trim() !== '');
          break;
        case 'complete':
          filtered = filtered.filter(company => 
            company.name && company.name.trim() !== '' &&
            company.description && company.description.trim() !== '' &&
            company.website && company.website.trim() !== '' &&
            company.email && company.email.trim() !== '' &&
            company.company_size && company.company_size.trim() !== '' &&
            company.address && company.address.trim() !== '' &&
            company.logo_url && company.logo_url.trim() !== ''
          );
          break;
      }
    }

    setFilteredCompanies(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [companies, searchTerm, sizeFilter, statusFilter]);

  // Calculate paginated companies
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
      email: company.email || '',
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
      setLoading(true);
      const response = await companyService.deleteCompany(companyId);
      if (response.success) {
        console.log('✅ Company deleted successfully');
        await fetchCompanies(); // Refresh companies list
      } else {
        throw new Error(response.message || 'Không thể xóa công ty');
      }
    } catch (err: any) {
      console.error('❌ Error deleting company:', err);
      setError(err.message || 'Không thể xóa công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Tên công ty không được để trống');
        return;
      }

      const companyData = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        email: formData.email,
        company_size: formData.company_size,
        address: formData.address,
        logo_url: formData.logo_url
      };

      let response;
      if (dialogMode === 'add') {
        console.log('Creating new company:', companyData);
        response = await companyService.createCompany(companyData);
      } else if (dialogMode === 'edit' && selectedCompany) {
        console.log('Updating company:', selectedCompany.id, companyData);
        response = await companyService.updateCompany(selectedCompany.id, companyData);
      }

      if (response?.success) {
        console.log('✅ Company saved successfully');
        setDialogOpen(false);
        await fetchCompanies(); // Refresh companies list
      } else {
        throw new Error(response?.message || 'Không thể lưu thông tin công ty');
      }
    } catch (err: any) {
      console.error('❌ Error saving company:', err);
      setError(err.message || 'Không thể lưu thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          Quản lý công ty
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCompanies}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCompany}
          >
            Thêm công ty
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
          <CompanyStatsCards companies={companies} loading={false} />

          {/* Search and Filters */}
          <CompanySearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sizeFilter={sizeFilter}
            setSizeFilter={setSizeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredCompanies.length}
            totalCount={companies.length}
          />

          {/* Companies Table */}
          <CompanyTable
            companies={paginatedCompanies}
            loading={false}
            page={currentPage}
            itemsPerPage={pageSize}
            onEdit={handleEditCompany}
            onView={handleViewCompany}
            onDelete={handleDeleteCompany}
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

          {/* Company Dialog */}
          <CompanyDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={dialogMode}
            company={selectedCompany}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveCompany}
          />
        </>
      )}
    </Box>
  );
};

export default Companies;