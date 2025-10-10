import React from 'react';
import { Container } from '@mui/material';
import { 
  SearchSection, 
  JobsGridSection, 
  CompaniesSection, 
  IndustriesSection,
  JobRecommendationsSection,
  FeaturedEmployersSection
} from '../../components/candidate';

const CandidateJobList: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <SearchSection />
      <JobsGridSection />
      <CompaniesSection />
      <JobRecommendationsSection />
      <IndustriesSection />
      <FeaturedEmployersSection />
    </Container>
  );
};

export default CandidateJobList;