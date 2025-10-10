import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Chip, 
  Avatar,
  IconButton,
  Stack
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  BookmarkBorder,
  Bookmark,
  Verified
} from '@mui/icons-material';

export interface JobListCardData {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  salary: string;
  location: string;
  experience?: string;
  postedTime: string;
  deadline?: string;
  isUrgent?: boolean;
  isVerified?: boolean;
  tags?: string[];
  salaryColor?: string;
}

interface JobListCardProps {
  job: JobListCardData;
  onApply?: (jobId: number) => void;
  onSave?: (jobId: number) => void;
}

const JobListCard: React.FC<JobListCardProps> = ({ job, onApply, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = () => {
    onApply?.(job.id);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: '#009a3e'
        }
      }}
    >
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Company Logo */}
        <Avatar
          src={job.companyLogo}
          variant="rounded"
          sx={{ 
            width: 80, 
            height: 80, 
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0'
          }}
        >
          {job.company.charAt(0)}
        </Avatar>

        {/* Job Details */}
        <Box sx={{ flex: 1 }}>
          {/* Title and Company */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                color: '#333',
                cursor: 'pointer',
                '&:hover': { color: '#009a3e' }
              }}
            >
              {job.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {job.company}
              </Typography>
              {job.isVerified && (
                <Verified sx={{ fontSize: 16, color: '#009a3e' }} />
              )}
            </Box>
          </Box>

          {/* Location and Experience */}
          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {job.location}
              </Typography>
            </Box>
            {job.experience && (
              <Typography variant="body2" color="text.secondary">
                {job.experience}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Còn {job.postedTime}
              </Typography>
            </Box>
            {job.deadline && (
              <Typography variant="body2" color="text.secondary">
                Cập nhật {job.deadline}
              </Typography>
            )}
          </Stack>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {job.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontSize: 11,
                    height: 22
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Salary and Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          {/* Salary */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: job.salaryColor || '#009a3e',
                mb: 0.5
              }}
            >
              {job.salary}
            </Typography>
            {job.isUrgent && (
              <Chip
                label="GẤP"
                size="small"
                sx={{
                  backgroundColor: '#fff3e0',
                  color: '#f57c00',
                  fontSize: 10,
                  height: 20,
                  fontWeight: 600
                }}
              />
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleApply}
              sx={{
                backgroundColor: '#009a3e',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#008035' }
              }}
            >
              Ứng tuyển
            </Button>
            <IconButton
              onClick={handleSave}
              size="small"
              sx={{ 
                alignSelf: 'center',
                color: isSaved ? '#009a3e' : 'text.secondary',
                '&:hover': { backgroundColor: 'rgba(0,154,62,0.05)' }
              }}
            >
              {isSaved ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobListCard;