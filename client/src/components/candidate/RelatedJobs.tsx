import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import RelatedJobCard from './RelatedJobCard';
import { RelatedJob } from './types';

interface RelatedJobsProps {
  jobs: RelatedJob[];
}

const RelatedJobs: FC<RelatedJobsProps> = ({ jobs }) => {
  return (
    <Box mt={5}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Việc làm liên quan</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2
        }}
      >
        {jobs.map((job, index) => (
          <Box key={index}>
            <RelatedJobCard job={job} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default RelatedJobs;