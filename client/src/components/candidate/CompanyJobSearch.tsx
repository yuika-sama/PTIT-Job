import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Search,
  LocationOn
} from '@mui/icons-material';
import JobListCard, { JobListCardData } from './JobListCard';

interface CompanyJobSearchProps {
  jobs: JobListCardData[];
  searchTerm: string;
  location: string;
  onSearchTermChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  onApplyJob: (jobId: number) => void;
  onSaveJob: (jobId: number) => void;
}

const CompanyJobSearch: React.FC<CompanyJobSearchProps> = ({
  jobs,
  searchTerm,
  location,
  onSearchTermChange,
  onLocationChange,
  onSearch,
  onApplyJob,
  onSaveJob
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#009a3e' }}>
        Tuyển dụng
      </Typography>
      
      {/* Search Form */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Tên công việc, vị trí ứng tuyển..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          placeholder="Tất cả tỉnh/thành phố"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          onClick={onSearch}
          sx={{
            backgroundColor: '#009a3e',
            px: 3,
            '&:hover': { backgroundColor: '#008035' }
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* Job Listings */}
      <Box>
        {jobs.map((job) => (
          <JobListCard
            key={job.id}
            job={job}
            onApply={onApplyJob}
            onSave={onSaveJob}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default CompanyJobSearch;