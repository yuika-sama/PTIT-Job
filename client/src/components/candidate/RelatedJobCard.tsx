import React, { FC } from 'react';
import { Paper, Typography, Chip, Stack } from '@mui/material';
import { MonetizationOn, LocationOn } from '@mui/icons-material';
import type { RelatedJob } from './types';

interface RelatedJobCardProps {
  job: RelatedJob;
}

const RelatedJobCard: FC<RelatedJobCardProps> = ({ job }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold" component="div" noWrap>{job.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{job.company}</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Chip icon={<MonetizationOn />} label={job.salary} size="small" />
        <Chip icon={<LocationOn />} label={job.location} size="small" />
      </Stack>
    </Paper>
  );
}

export default RelatedJobCard;