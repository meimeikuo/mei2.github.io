import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ProQual } from './components/ProQual';
import { History } from './components/History';
import { Sponsors } from './components/Sponsors';
import { Footer } from './components/Footer';
import { Globe } from 'lucide-react';
import { Language } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'cn' : 'en');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black font-sans relative">
      {/* Language Switcher */}
      <button 
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-zinc-700 hover:border-yellow-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-zinc-900 cursor-pointer"
      >
        <Globe size={16} className="text-yellow-500" />
        <span className="text-sm font-bold tracking-wider uppercase font-display">
          {lang === 'en' ? '中文' : 'ENGLISH'}
        </span>
      </button>

      <Hero lang={lang} />
      <ProQual lang={lang} />
      <History lang={lang} />
      <Sponsors lang={lang} />
      <Footer lang={lang} />
    </div>
  );
};

export default App;