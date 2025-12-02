import React from 'react';
import { Hero } from './components/Hero';
import { ProQual } from './components/ProQual';
import { History } from './components/History';
import { Sponsors } from './components/Sponsors';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black font-sans">
      <Hero />
      <ProQual />
      <History />
      <Sponsors />
      <Footer />
    </div>
  );
};

export default App;