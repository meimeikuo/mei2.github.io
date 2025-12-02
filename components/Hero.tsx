import React, { useState, useEffect, useRef } from 'react';
import { LanguageProps } from '../types';

export const Hero: React.FC<LanguageProps> = ({ lang }) => {
  const [displayLine1, setDisplayLine1] = useState('');
  const [displayLine2, setDisplayLine2] = useState('');
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);

  // Content configuration
  const content = {
    en: {
      subtitle: "IFBB Classic Physique Pro",
      line1: "Jason",
      line2: "Huang",
      quote: "Discipline. Aesthetics. Legacy.",
      subQuote: "Representing Taiwan on the global stage."
    },
    cn: {
      subtitle: "IFBB 古典健美職業選手",
      line1: "新爺",
      line2: "裝逼",
      quote: "自律。美學。傳奇。",
      subQuote: "代表台灣站上世界舞台。"
    }
  };

  const currentContent = content[lang];

  useEffect(() => {
    // Reset state on language change
    setDisplayLine1('');
    setDisplayLine2('');
    setShowCursor1(true);
    setShowCursor2(false);

    let timeoutId: ReturnType<typeof setTimeout>;
    let currentIndex1 = 0;
    let currentIndex2 = 0;

    const typeLine1 = () => {
      if (currentIndex1 < currentContent.line1.length) {
        setDisplayLine1(currentContent.line1.slice(0, currentIndex1 + 1));
        currentIndex1++;
        timeoutId = setTimeout(typeLine1, 150);
      } else {
        setShowCursor1(false);
        setShowCursor2(true);
        timeoutId = setTimeout(typeLine2, 100);
      }
    };

    const typeLine2 = () => {
      if (currentIndex2 < currentContent.line2.length) {
        setDisplayLine2(currentContent.line2.slice(0, currentIndex2 + 1));
        currentIndex2++;
        timeoutId = setTimeout(typeLine2, 150);
      } else {
        // Animation finished
      }
    };

    // Start typing
    timeoutId = setTimeout(typeLine1, 500);

    return () => clearTimeout(timeoutId);
  }, [lang, currentContent.line1, currentContent.line2]);

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <img 
          src="https://contests.npcnewsonline.com/images/contests/4367/large/21830560.jpg" 
          alt="Jason Huang IFBB Pro" 
          className="h-full w-full object-cover object-top opacity-80"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-yellow-500 font-bold tracking-widest text-lg md:text-xl mb-4 uppercase animate-fade-in-up font-display">
          {currentContent.subtitle}
        </h2>
        <h1 className={`text-5xl md:text-7xl lg:text-9xl text-white leading-none mb-6 min-h-[1.2em] md:min-h-[2.4em] ${lang === 'cn' ? 'font-calligraphy tracking-normal font-normal' : 'font-display font-black uppercase tracking-tighter'}`}>
          <span className="block">
            {displayLine1}
            {showCursor1 && <span className="animate-blink text-yellow-500 ml-1">|</span>}
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">
            {displayLine2}
            {showCursor2 && <span className="animate-blink text-white ml-1">|</span>}
          </span>
        </h1>
        <p className="max-w-xl text-gray-300 text-lg md:text-xl font-light border-l-4 border-yellow-500 pl-4 animate-fade-in-up delay-200">
          {currentContent.quote} <br />
          {currentContent.subQuote}
        </p>
      </div>
    </div>
  );
};