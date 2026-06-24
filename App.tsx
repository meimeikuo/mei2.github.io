import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Hero } from './components/Hero';
import { ProQual } from './components/ProQual';
import { Others } from './components/Others';
import { History } from './components/History';
import { Sponsors } from './components/Sponsors';
import { Footer } from './components/Footer';
import { Admin } from './components/Admin';
import { Globe, Settings } from 'lucide-react';
import { Language } from './types';

const MainSite: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'cn' : 'en');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black font-sans relative">
      {/* Top Right Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-zinc-700 hover:border-yellow-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-zinc-900 cursor-pointer"
        >
          <Globe size={16} className="text-yellow-500" />
          <span className="text-sm font-bold tracking-wider uppercase font-display">
            {lang === 'en' ? '中文' : 'ENGLISH'}
          </span>
        </button>

        <RouterLink 
          to="/admin"
          className="flex items-center justify-center bg-black/50 backdrop-blur-md border border-zinc-700 hover:border-yellow-500 text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-zinc-900 cursor-pointer"
          title="Admin Dashboard"
        >
          <Settings size={16} className="text-zinc-400" />
        </RouterLink>
      </div>

      <Hero lang={lang} />
      <History lang={lang} />
      <ProQual lang={lang} />
      <Others lang={lang} />
      <Sponsors lang={lang} />
      <Footer lang={lang} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;