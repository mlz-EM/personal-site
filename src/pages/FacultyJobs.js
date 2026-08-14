import React from 'react';
import SourceJobsPage from '../components/Template/SourceJobsPage';
import getFacultyJobsFeed from '../content/facultyJobsFeed';

const FacultyJobs = () => (
  <SourceJobsPage
    description="AI-filtered tenure-track faculty opportunities from Interfolio, Chronicle, and Inside Higher Ed"
    emptySourceLabel="Faculty"
    feedLoader={getFacultyJobsFeed}
    pageTitle="Faculty Jobs"
    routeKey="faculty"
  />
);

export default FacultyJobs;
