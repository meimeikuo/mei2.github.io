import React from 'react';
import { UtensilsCrossed, Dumbbell, Instagram, ExternalLink } from 'lucide-react';
import { LanguageProps } from '../types';

export const ProQual: React.FC<LanguageProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Services & Social",
      box1: {
        title: "COURSE INQUIRY",
        cta: "Start Now",
        sub: "Customized Programming"
      },
      box2: {
        title: "EEL ORDERING",
        cta: "Order Now",
        sub: "Premium Quality Eel"
      },
      box3: {
        title: "INSTAGRAM",
        cta: "@jasonhuang_ifbbpro",
        sub: "Follow the Daily Process"
      }
    },
    cn: {
      title: "服務與社群",
      box1: {
        title: "課程諮詢",
        cta: "立即開始",
        sub: "客製化訓練安排"
      },
      box2: {
        title: "鰻魚訂購",
        cta: "立即訂購",
        sub: "頂級白燒鰻"
      },
      box3: {
        title: "INSTAGRAM",
        cta: "@jasonhuang_ifbbpro",
        sub: "追蹤日常訓練"
      }
    }
  };

  const t = content[lang];

  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display">{t.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Box 1: Course Inquiry */}
          <a 
            href="https://forms.gle/ckanBAG2wGVjQ4FD6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 hover:border-yellow-500 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer hover:bg-zinc-900/80 hover:-translate-y-2 shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="bg-zinc-800 p-4 rounded-full mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <Dumbbell className="w-10 h-10 text-yellow-500" />
            </div>
            <h4 className="text-white font-bold text-xl uppercase mb-2 font-display">{t.box1.title}</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-medium text-lg">
              <span>{t.box1.cta}</span>
              <ExternalLink size={16} />
            </div>
            <p className="text-gray-400 mt-2 text-sm">{t.box1.sub}</p>
          </a>

          {/* Box 2: Eel Ordering */}
          <a 
            href="https://forms.gle/AjnyUgcKQ6jjgDyL9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 hover:border-yellow-500 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer hover:bg-zinc-900/80 hover:-translate-y-2 shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="bg-zinc-800 p-4 rounded-full mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <UtensilsCrossed className="w-10 h-10 text-yellow-500" />
            </div>
            <h4 className="text-white font-bold text-xl uppercase mb-2 font-display">{t.box2.title}</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-medium text-lg">
              <span>{t.box2.cta}</span>
              <ExternalLink size={16} />
            </div>
            <p className="text-gray-400 mt-2 text-sm">{t.box2.sub}</p>
          </a>

          {/* Box 3: Instagram */}
          <a 
            href="https://www.instagram.com/jasonhuang_ifbbpro/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 hover:border-yellow-500 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer hover:bg-zinc-900/80 hover:-translate-y-2 shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="bg-zinc-800 p-4 rounded-full mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <Instagram className="w-10 h-10 text-yellow-500" />
            </div>
            <h4 className="text-white font-bold text-xl uppercase mb-2 font-display">{t.box3.title}</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-medium text-lg">
              <span>{t.box3.cta}</span>
              <ExternalLink size={16} />
            </div>
            <p className="text-gray-400 mt-2 text-sm">{t.box3.sub}</p>
          </a>
        </div>
      </div>
    </section>
  );
};