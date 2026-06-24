import React, { useState, useEffect } from 'react';
import { LanguageProps } from '../types';
import { useSiteContent } from '../hooks/useSiteContent';

type AnimationPhase = 'typing1' | 'typing2' | 'waiting' | 'deleting2' | 'deleting1';

export const Hero: React.FC<LanguageProps> = ({ lang }) => {
  const { content: siteContent } = useSiteContent();
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState<AnimationPhase>('typing1');
  const [nameIndex, setNameIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  // Content configuration
  const staticContent = {
    en: {
      subtitle: siteContent.heroTitleEn,
      quote: siteContent.heroQuoteEn,
      subQuote: siteContent.heroSubquoteEn
    },
    cn: {
      subtitle: siteContent.heroTitleCn,
      quote: siteContent.heroQuoteCn,
      subQuote: siteContent.heroSubquoteCn
    }
  };

  // Names configuration
  const names = {
    en: [
      { l1: "Jason", l2: "Huang" },
      { l1: "Huang", l2: "Wen Hsin" }
    ],
    cn: [
      { l1: "新爺", l2: "裝逼" },
      { l1: "黃", l2: "文新" }
    ]
  };

  const currentStatic = staticContent[lang];
  const targetName = names[lang][nameIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      if (siteContent.heroBgImages && siteContent.heroBgImages.length > 0) {
        setBgIndex((prev) => (prev + 1) % siteContent.heroBgImages.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [siteContent.heroBgImages]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const TYPE_SPEED = 150;
    const DELETE_SPEED = 75;
    const WAIT_TIME = 2500;

    const handleTypewriter = () => {
      switch (phase) {
        case 'typing1':
          if (line1.length < targetName.l1.length) {
            timeout = setTimeout(() => {
              setLine1(targetName.l1.slice(0, line1.length + 1));
            }, TYPE_SPEED);
          } else {
            setPhase('typing2');
          }
          break;
        case 'typing2':
          if (line2.length < targetName.l2.length) {
            timeout = setTimeout(() => {
              setLine2(targetName.l2.slice(0, line2.length + 1));
            }, TYPE_SPEED);
          } else {
            setPhase('waiting');
          }
          break;
        case 'waiting':
          timeout = setTimeout(() => {
            setPhase('deleting2');
          }, WAIT_TIME);
          break;
        case 'deleting2':
          if (line2.length > 0) {
            timeout = setTimeout(() => {
              setLine2(line2.slice(0, -1));
            }, DELETE_SPEED);
          } else {
            setPhase('deleting1');
          }
          break;
        case 'deleting1':
          if (line1.length > 0) {
            timeout = setTimeout(() => {
              setLine1(line1.slice(0, -1));
            }, DELETE_SPEED);
          } else {
            setNameIndex((prev) => (prev === 0 ? 1 : 0));
            setPhase('typing1');
          }
          break;
      }
    };

    handleTypewriter();
    return () => clearTimeout(timeout);
  }, [line1, line2, phase, targetName]);

  useEffect(() => {
    setLine1('');
    setLine2('');
    setPhase('typing1');
    setNameIndex(0);
  }, [lang]);

  const showCursor1 = phase === 'typing1' || phase === 'deleting1';
  const showCursor2 = phase === 'typing2' || phase === 'waiting' || phase === 'deleting2';

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
        
        {siteContent.heroBgImages?.map((src: string, index: number) => (
          <img 
            key={`${src}-${index}`}
            src={src} 
            alt={`Jason Huang Background ${index}`} 
            className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-1000 ease-in-out ${
              index === bgIndex ? 'opacity-70' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="relative z-20 flex h-full flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-yellow-500 font-bold tracking-widest text-lg md:text-xl mb-4 uppercase animate-fade-in-up font-display">
          {currentStatic.subtitle}
        </h2>
        <h1 className={`text-5xl md:text-7xl lg:text-9xl text-white leading-none mb-6 min-h-[1.2em] md:min-h-[2.4em] ${lang === 'cn' ? 'font-calligraphy tracking-normal font-normal' : 'font-display font-black uppercase tracking-tighter'}`}>
          <span className="block">
            {line1}
            {showCursor1 && <span className="animate-blink text-yellow-500 ml-1">|</span>}
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">
            {line2}
            {showCursor2 && <span className="animate-blink text-white ml-1">|</span>}
          </span>
        </h1>
        <p className="max-w-xl text-gray-300 text-lg md:text-xl font-light border-l-4 border-yellow-500 pl-4 animate-fade-in-up delay-200">
          {currentStatic.quote} <br />
          {currentStatic.subQuote}
        </p>
      </div>
    </div>
  );
};