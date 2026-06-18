import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ParcoursSection from '../components/ParcoursSection';
import CatalogueSection from '../components/CatalogueSection';
import OnboardingSection from '../components/OnboardingSection';
import ValeurSection from '../components/ValeurSection';
import Footer from '../components/Footer';

const AccueilPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <CatalogueSection />
        <ParcoursSection />
        <OnboardingSection />
        <ValeurSection />
      </main>
      <Footer />
    </div>
  );
};

export default AccueilPage;
