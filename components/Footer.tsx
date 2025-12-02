import React from 'react';
import { LanguageProps } from '../types';

export const Footer: React.FC<LanguageProps> = ({ lang }) => {
  return (
    <footer className="bg-black py-12 border-t border-zinc-900 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className={`text-3xl font-black text-white uppercase tracking-widest mb-6 ${lang === 'cn' ? 'font-calligraphy' : 'font-display'}`}>
          {lang === 'en' ? 'Jason Huang' : '新爺裝逼'}
        </h2>
        <p className="text-zinc-600 text-sm">
          © {new Date().getFullYear()} {lang === 'en' ? 'Jason Huang IFBB Pro. All Rights Reserved.' : '新爺裝逼 IFBB Pro. 版權所有。'}
        </p>
      </div>
    </footer>
  );
};