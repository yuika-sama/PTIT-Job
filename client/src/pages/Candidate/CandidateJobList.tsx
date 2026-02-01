import React from 'react';
import { Container, Box, Alert } from '@mui/material';
import {
  SearchSection,
  JobsGridSection,
  CompaniesSection,
  IndustriesSection,
  JobRecommendationsSection,
  FeaturedEmployersSection,
} from '../../components/candidate';
import { useFeaturedJobs, useCompanies, useJobCategories, useLocations } from '../../hooks/useApi';

const CandidateJobList: React.FC = () => {
  // Fetch landing page data via shared hooks
  const { data: featuredJobs, loading: jobsLoading, error: jobsError } = useFeaturedJobs();
  const { data: companies, loading: companiesLoading, error: companiesError } = useCompanies();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useJobCategories();
  const { data: locations, loading: locationsLoading, error: locationsError } = useLocations();

  // Surface first error we hit so the page can short-circuit gracefully
  const hasError = jobsError || companiesError || categoriesError || locationsError;

  if (hasError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load marketplace data:{' '}
          {jobsError || companiesError || categoriesError || locationsError}
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

      <JobsGridSection jobs={featuredJobs || []} isLoading={jobsLoading} />

      <JobRecommendationsSection jobs={featuredJobs || []} isLoading={jobsLoading} />

      <CompaniesSection companies={companies || []} isLoading={companiesLoading} />

      <FeaturedEmployersSection companies={companies || []} isLoading={companiesLoading} />

      <IndustriesSection categories={categories || []} isLoading={categoriesLoading} />

      <Box sx={{ height: 100, width: '100%' }} />
    </Container>
  );
};

export default CandidateJobList;
