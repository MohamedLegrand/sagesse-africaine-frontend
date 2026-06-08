import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CatalogueSection from '../components/CatalogueSection';
import Footer from '../components/Footer';

const AccueilPage = () => {
  return (
    <div className="min-h-screen bg-white"> 
      <Header />
      <HeroSection />
      <CatalogueSection />
      <Footer />
    </div>
  );
};

export default AccueilPage;