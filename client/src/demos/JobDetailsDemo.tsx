import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobDetailsPage from '../pages/Candidate/JobDetailsPage';

// Demo component để test JobDetailsPage
const JobDetailsDemo: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/job/:jobId" element={<JobDetailsPage />} />
        <Route path="/" element={
          <div style={{ padding: '20px' }}>
            <h1>Job Details Demo</h1>
            <p>Navigate to <code>/job/123</code> to test the JobDetailsPage</p>
            <a href="/job/123">Test Job Details Page</a>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default JobDetailsDemo;