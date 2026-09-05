import React from 'react';
import SearchBar from '../components/home/SearchBar';
import Hero from '../components/home/Hero';
import FeatureStrip from '../components/home/FeatureStrip';
import ProjectsSection from '../components/home/ProjectsSection';
import SafetySection from '../components/home/SafetySection';
import NeedsSection from '../components/home/NeedsSection';
import AddonService from '../components/home/AddonService';

const HomePage = () => {
  const handleSearch = (filters) => {
    console.log('Search filters:', filters);
    // Later: navigate to /search?trade=...&location=...
    // or update state to show filtered projects
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Hero />
      <FeatureStrip />
      <ProjectsSection />
      <SafetySection />
      <NeedsSection />
      <AddonService />
    </>
  );
};

export default HomePage;