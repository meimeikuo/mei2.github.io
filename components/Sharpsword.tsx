import React from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { LanguageProps } from '../types';

export const Sharpsword: React.FC<LanguageProps> = ({ lang }) => {
  const content = {
    en: {
      sectionTitle: "SHARP SWORD Official Store",
      desc: "Kangshen Original Brand Apparel",
      cta: "Shop Now"
    },
    cn: {
      sectionTitle: "SHARP SWORD 利劍官方店",
      desc: "康神自創品牌服飾",
      cta: "前往選購"
    }
  };

  const t = content[lang];

  return (
    <section className="bg-zinc-950 py-20 px-6 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display">{t.sectionTitle}</h3>
        </div>

        <a 
          href="https://m.tb.cn/h.i3elcqLzzvjzVU0" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-zinc-800 hover:border-yellow-500 transition-all duration-500 bg-zinc-900"
        >
          {/* Left Side - Logo (60%) */}
          <div className="w-full md:w-[60%] relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[400px] overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/pw/AP1GczN9JKlLatxnevqDOYx7uwyAEvYrhqidElAQRXjhRolxxlTzYrM5MCV1-VEbde7uWwKS0nrezr9azweDZ1rE7qcMM-VfuSBpbN3IP93ZObCH9K10I4Q=w1200"
              alt="SHARP SWORD Logo"
              className="absolute inset-0 w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Right Side - Content (40%) */}
          <div className="w-full md:w-[40%] relative z-10 p-8 md:p-10 flex flex-col items-center justify-center text-center bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800">
            <div className="w-16 h-16 bg-zinc-800 backdrop-blur-sm border border-zinc-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:border-yellow-500 text-white group-hover:text-black transition-all duration-300 shadow-xl">
              <ShoppingCart size={28} />
            </div>
            
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              {t.desc}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors duration-300 text-sm">
              <span>{t.cta}</span>
              <ExternalLink size={16} />
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
