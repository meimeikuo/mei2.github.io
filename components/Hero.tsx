import React, { useState, useEffect } from 'react';
import { LanguageProps } from '../types';

type AnimationPhase = 'typing1' | 'typing2' | 'waiting' | 'deleting2' | 'deleting1';

const BG_IMAGES = [
  "https://i.ibb.co/27KpSbD5/LINE-ALBUM-2025-251210-8.jpg",
  "https://i.ibb.co/d0Lt0Nmt/LINE-ALBUM-2025-251210-1.jpg",
  "https://i.ibb.co/4nvv349R/LINE-ALBUM-2025-251210-2.jpg",
  "https://i.ibb.co/mFC2jwRj/LINE-ALBUM-2025-251210-3.jpg",
  "https://i.ibb.co/VWjDkwrX/LINE-ALBUM-2025-251210-4.jpg",
  "https://i.ibb.co/354QWp6g/LINE-ALBUM-2025-251210-5.jpg",
  "https://i.ibb.co/8gZwnFN6/LINE-ALBUM-2025-251210-6.jpg",
  "https://i.ibb.co/wtqfqq8/LINE-ALBUM-2025-251210-7.jpg",
  "https://i.ibb.co/YBbQRDdJ/LINE-ALBUM-2025-251210-9.jpg",
  "https://lh3.googleusercontent.com/pw/AP1GczPLdJHNa6h83EntmYan3Q2-3G7IBJDdPCHmPkORJfyVEtjzbQzarfMgrWz2OTBSMi3O2KhS42v1y_n-ihKkV8iMbQboW379yZeQVYB827o6T9pjSLA=w1800",
  "https://lh3.googleusercontent.com/pw/AP1GczMoxHodg09o6FUmzNuuVdnMsZzrCGq-Rf_UtyuuCj6CpXY1DQNSdvC7RlwaNl7TXYgF3Zdyyru7KCU-nIY9jAGffjUyLTWA_20tVvHUpnJFmN9L_NQ=w1800",
  "https://lh3.googleusercontent.com/pw/AP1GczPXUpuUQrDE3fqS7kRm-zSPuj1UTw5rOZaX3QYFLpLwArUlnyMCwK3NPulbi9fxGuyELhZXRDrsAZTIaZ4FQtzyWsUuJpyvtVRLiunsU4frHqwgvmo=w1800"
];

export const Hero: React.FC<LanguageProps> = ({ lang }) => {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState<AnimationPhase>('typing1');
  const [nameIndex, setNameIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  // Content configuration
  const staticContent = {
    en: {
      subtitle: "IFBB Classic Physique Pro",
      quote: "Discipline. Aesthetics. Legacy.",
      subQuote: "Representing Taiwan on the global stage."
    },
    cn: {
      subtitle: "IFBB 古典職業健美選手",
      quote: "自律。美學。傳奇。",
      subQuote: "代表台灣站上世界舞台。"
    }
  };

  // Names configuration [Original Name, Real Name]
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

  // --- Background Slideshow Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 3000); // 3 seconds per slide

    return () => clearInterval(interval);
  }, []);

  // --- 動畫核心邏輯 (已修正速度問題) ---
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    // 速度設定 (毫秒)
    const TYPE_SPEED = 150;    // 打字速度 (舒適)
    const DELETE_SPEED = 75;   // 刪除速度 (稍快)
    const WAIT_TIME = 2500;    // 完整顯示後的停留時間

    const handleTypewriter = () => {
      switch (phase) {
        case 'typing1':
          if (line1.length < targetName.l1.length) {
            timeout = setTimeout(() => {
              setLine1(targetName.l1.slice(0, line1.length + 1));
            }, TYPE_SPEED);
          } else {
            // 第一行打完，馬上開始打第二行
            setPhase('typing2');
          }
          break;

        case 'typing2':
          if (line2.length < targetName.l2.length) {
            timeout = setTimeout(() => {
              setLine2(targetName.l2.slice(0, line2.length + 1));
            }, TYPE_SPEED);
          } else {
            // 全部打完，進入等待閱讀時間
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
            // 全部刪完，切換到下一個名字並重新開始
            setNameIndex((prev) => (prev === 0 ? 1 : 0));
            setPhase('typing1');
          }
          break;
      }
    };

    handleTypewriter();

    return () => clearTimeout(timeout);
  }, [line1, line2, phase, targetName]); // 依賴變數改變時自動觸發下一步

  // Reset animation when language changes
  useEffect(() => {
    setLine1('');
    setLine2('');
    setPhase('typing1');
    setNameIndex(0);
  }, [lang]);

  // Cursor logic
  const showCursor1 = phase === 'typing1' || phase === 'deleting1';
  const showCursor2 = phase === 'typing2' || phase === 'waiting' || phase === 'deleting2';

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        
        {BG_IMAGES.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`Jason Huang Background ${index}`} 
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
              index === bgIndex ? 'opacity-80' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-yellow-500 font-bold tracking-widest text-lg md:text-xl mb-4 uppercase animate-fade-in-up font-display">
          {currentStatic.subtitle}
        </h2>
        {/* Typography: Use Dela Gothic One (font-calligraphy) for Chinese, standard Display font for English */}
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