import React from 'react';
import { Shirt, ShoppingBag, ExternalLink, TicketPercent } from 'lucide-react';
import { LanguageProps } from '../types';

export const Sponsors: React.FC<LanguageProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Sponsors",
      apparel: "Fitness Apparel",
      whey: "Whey Protein",
      discount: {
        title: "Exclusive Discount Code",
        desc: "Use this code at checkout for maximum discount"
      }
    },
    cn: {
      title: "贊助廠商",
      apparel: "健身服飾",
      whey: "乳清蛋白",
      discount: {
        title: "專屬折扣碼",
        desc: "結帳輸入享最高優惠"
      }
    }
  };

  const t = content[lang];

  return (
    <section className="bg-zinc-950 py-24 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display">{t.title}</h3>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Classic Apparel */}
          <a 
            href="https://www.classictw.com.tw/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-900/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 text-yellow-500 group-hover:text-black transition-colors">
              <Shirt size={32} />
            </div>
            <h4 className="text-xl font-black text-white uppercase mb-1 font-display">{t.apparel}</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-lg font-display">
              <span>@classic__tw</span>
              <ExternalLink size={16} />
            </div>
          </a>

          {/* MyProtein */}
          <a 
            href="https://tidd.ly/4id1Klt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-900/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 text-yellow-500 group-hover:text-black transition-colors">
              <ShoppingBag size={32} />
            </div>
            <h4 className="text-xl font-black text-white uppercase mb-1 font-display">{t.whey}</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-lg font-display">
              <span>@myproteintw</span>
              <ExternalLink size={16} />
            </div>
          </a>
        </div>

        {/* Discount Code Section */}
        <div className="flex flex-col items-center justify-center text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-y-2 border-yellow-500/30 w-full py-8 px-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-400 uppercase tracking-[0.2em] text-sm font-bold font-display">
                <TicketPercent size={18} className="text-yellow-500" />
                <span>{t.discount.title}</span>
                <TicketPercent size={18} className="text-yellow-500" />
              </div>
              <div className="text-4xl md:text-6xl font-black text-white tracking-widest selection:bg-yellow-500 selection:text-black font-display">
                JASON666
              </div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mt-2 font-sans">{t.discount.desc}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};