import React from 'react';
import { LanguageProps } from '../types';

export const History: React.FC<LanguageProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Pro Career",
      subtitle: "Stats",
      competitions: [
        { 
          year: 2025, 
          name: "Japan Pro Men's Classic Physique",
          rank: "No. 7",
          link: "https://www.ifbbpro.com/competition/2025-japan-pro/"
        },
        { 
          year: 2024, 
          name: "IFBB Taiwan Pro", 
          rank: "No. 3", 
          medal: 'bronze' as const
        },
        { 
          year: 2024, 
          name: "IFBB Huanji China Pro", 
          rank: "No. 6" 
        },
        { 
          year: 2023, 
          name: "IFBB Pro League District of Taiwan Pro CP", 
          rank: "No. 8" 
        },
        { 
          year: 2023, 
          name: "IFBB Monsterzym Pro Classic Physique", 
          rank: "No. 13" 
        },
        {
          year: 2022,
          name: "NPC Worldwide Taiwan Proqualifier",
          rank: "Overall Champion / Pro Card Earned",
          medal: 'gold' as const,
          details: "Traditional BB Light Heavyweight Champion, Classic Physique Class B Champion"
        }
      ]
    },
    cn: {
      title: "職業生涯",
      subtitle: "戰績",
      competitions: [
        { 
          year: 2025, 
          name: "日本職業賽 男子古典健美",
          rank: "No. 7",
          link: "https://www.ifbbpro.com/competition/2025-japan-pro/"
        },
        { 
          year: 2024, 
          name: "IFBB 台灣職業賽", 
          rank: "No. 3 銅牌", 
          medal: 'bronze' as const
        },
        { 
          year: 2024, 
          name: "IFBB 北京寰際古典職業賽", 
          rank: "No. 6" 
        },
        { 
          year: 2023, 
          name: "IFBB 台灣職業賽", 
          rank: "No. 8" 
        },
        { 
          year: 2023, 
          name: "IFBB Monsterzym 職業賽", 
          rank: "No. 13" 
        },
        {
          year: 2022,
          name: "NPC Worldwide 台灣職業卡資格賽",
          rank: "全場總冠軍 / 取得職業卡",
          medal: 'gold' as const,
          details: "傳統健美輕重量級冠軍、古典健美B組冠軍、古典健美全場總冠軍"
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <section className="bg-black py-20 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-12 text-center font-display">
          {t.title} <span className="text-yellow-500">{t.subtitle}</span>
        </h2>

        <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-0 md:pl-8 space-y-12">
          {t.competitions.map((comp, index) => {
            // Determine if it's a link or div
            const Wrapper = comp.link ? 'a' : 'div';
            const wrapperProps = comp.link ? {
              href: comp.link,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block"
            } : {};

            return (
              <div key={index} className="relative pl-8 md:pl-0 flex flex-col md:flex-row md:items-center group">
                {/* Dot */}
                <div className={`absolute -left-[9px] md:-left-[41px] w-4 h-4 rounded-full border-2 z-10 group-hover:scale-125 transition-transform ${
                  comp.medal === 'gold' ? 'bg-yellow-500 border-yellow-500' :
                  comp.medal === 'bronze' ? 'bg-[#CD7F32] border-[#CD7F32]' : 
                  'bg-zinc-950 border-yellow-500'
                }`} />
                
                {/* Year */}
                <div className="md:w-32 mb-2 md:mb-0">
                  <span className="text-2xl font-bold text-zinc-500 group-hover:text-white transition-colors font-display">{comp.year}</span>
                </div>

                {/* Card */}
                <Wrapper {...wrapperProps} className="flex-1 w-full">
                  <div className={`w-full bg-zinc-900 p-6 rounded-lg border-l-4 border-transparent hover:border-yellow-500 transition-all shadow-lg hover:shadow-yellow-900/10 ${comp.link ? 'cursor-pointer hover:bg-zinc-800/80' : ''}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                        <h3 className={`text-xl text-white font-bold uppercase font-display ${comp.link ? 'underline decoration-yellow-500/50 underline-offset-4' : ''}`}>
                          {comp.name}
                        </h3>
                        <div className={`px-4 py-1 rounded font-bold text-sm uppercase whitespace-nowrap font-sans ${
                          comp.medal === 'gold'
                            ? 'bg-yellow-500 text-black'
                            : comp.medal === 'bronze' 
                            ? 'bg-[#CD7F32] text-white' 
                            : 'bg-zinc-800 text-yellow-500'
                        }`}>
                          {comp.rank}
                        </div>
                      </div>
                      {/* Optional details for the Pro Card entry */}
                      {(comp as any).details && (
                        <p className="text-gray-400 text-sm mt-2 border-t border-zinc-800 pt-2">
                          {(comp as any).details}
                        </p>
                      )}
                    </div>
                  </div>
                </Wrapper>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};