import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Alert
} from '@mui/material';
import { jobService } from '../../services';
import type { Job } from '../../services/types';
import { useAuth } from '../../contexts/AuthContext';
import {
  JobBreadcrumbs,
  JobHeader,
  JobContent,
  JobSidebar,
  JobLoadingState,
  JobApplicationModal
} from '../../components/candidate/job-details';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError('Job ID không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Fetching job details for ID:', jobId);
        const response = await jobService.getJobById(jobId);
        
        if (response.success && response.data) {
          setJob(response.data);
          console.log('✅ Job details loaded:', response.data);
        } else {
          throw new Error(response.message || 'Không thể tải thông tin công việc');
        }
      } catch (error: any) {
        console.error('❌ Error fetching job details:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải thông tin công việc');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
  };

  const handleApplyJob = () => {
    if (!job) return;
    
    // Check if user is logged in
    if (!user) {
      // Redirect to login page
      navigate('/auth/login', { 
        state: { from: `/jobs/${job.id}` } 
      });
      return;
    }
    
    // Open application modal
    setIsApplicationModalOpen(true);
    console.log('Opening application modal for job:', job.id);
  };

  // Handle share job
  const handleShareJob = () => {
    if (navigator.share && job) {
      navigator.share({
        title: job.title,
        text: `Công việc: ${job.title} tại ${job.company_name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <JobLoadingState 
      isLoading={isLoading}
      error={error}
      onGoBack={() => navigate(-1)}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {job ? (
          <>
            <JobBreadcrumbs 
              jobTitle={job.title}
              onNavigate={handleNavigate}
            />

            <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
              <JobHeader
                job={job}
                isSaved={isSaved}
                onSaveJob={handleSaveJob}
                onApplyJob={handleApplyJob}
                onShareJob={handleShareJob}
                onBack={() => navigate(-1)}
              />
            </Paper>

            <Box sx={{ 
              display: 'flex', 
              gap: 3,
              flexDirection: { xs: 'column', md: 'row' }
            }}>
              <Box sx={{ flex: 2 }}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                  <JobContent job={job} />
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                  <JobSidebar job={job} />
                </Paper>
              </Box>
            </Box>
          </>
        ) : (
          <Alert severity="warning">
            Không tìm thấy công việc
          </Alert>
        )}

        {/* Job Application Modal */}
        <JobApplicationModal
          open={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          job={job}
          userId={user?.id}
        />
      </Container>
    </JobLoadingState>
  );
};

export default JobDetailsPage;