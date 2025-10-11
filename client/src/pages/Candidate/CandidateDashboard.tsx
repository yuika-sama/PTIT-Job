import React from 'react';
import { Container, Box, Alert } from '@mui/material';
import { 
  SearchSection, 
  JobsGridSection, 
  CompaniesSection, 
  IndustriesSection, 
  ToolsSection 
} from '../../components/candidate';
import { 
  useFeaturedJobs, 
  useCompanies, 
  useJobCategories, 
  useLocations 
} from '../../hooks/useApi';

const CandidateDashboard: React.FC = () => {
  // Fetch data từ API
  const { data: featuredJobs, loading: jobsLoading, error: jobsError } = useFeaturedJobs();
  const { data: companies, loading: companiesLoading, error: companiesError } = useCompanies();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useJobCategories();
  const { data: locations, loading: locationsLoading, error: locationsError } = useLocations();

  // Check if có lỗi nào không
  const hasError = jobsError || companiesError || categoriesError || locationsError;

  if (hasError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải dữ liệu: {jobsError || companiesError || categoriesError || locationsError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <SearchSection 
        locations={locations || []}
        categories={categories || []}
        isLoading={locationsLoading || categoriesLoading}
      />
      
      <JobsGridSection 
        jobs={featuredJobs || []}
        isLoading={jobsLoading}
      />
      
      <CompaniesSection 
        companies={companies || []}
        isLoading={companiesLoading}
      />
      
      <IndustriesSection 
        categories={categories || []}
        isLoading={categoriesLoading}
      />
      
      <ToolsSection />
      
      <Box sx={{ height: 100, width: '100%' }}></Box>
    </Container>
  );
};

export default CandidateDashboard;