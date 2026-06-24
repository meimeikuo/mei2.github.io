import React from 'react';
import { LanguageProps } from '../types';
import { useSiteContent, Competition } from '../hooks/useSiteContent';

export const History: React.FC<LanguageProps> = ({ lang }) => {
  const { content: siteContent } = useSiteContent();
  const content = {
    en: {
      title: "Pro Career",
      subtitle: "Stats",
      competitions: siteContent.competitionsEn || []
    },
    cn: {
      title: "職業生涯",
      subtitle: "戰績",
      competitions: siteContent.competitionsCn || []
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
          {[...t.competitions]
            .sort((a, b) => b.year - a.year)
            .map((comp: Competition, index: number) => {
            // Determine if it's a link or div
            const Wrapper = comp.link ? 'a' : 'div';
            const wrapperProps = comp.link ? {
              href: comp.link,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block"
            } : {};

            return (
              <div key={index} className="relative pl-8 md:pl-0 flex flex-col md:flex-row md:items-start group">
                {/* Dot */}
                <div className={`absolute -left-[9px] md:-left-[41px] w-4 h-4 rounded-full border-2 top-2 md:top-8 z-10 group-hover:scale-125 transition-transform ${
                  comp.medal === 'gold' ? 'bg-yellow-500 border-yellow-500' :
                  comp.medal === 'bronze' ? 'bg-[#CD7F32] border-[#CD7F32]' : 
                  'bg-zinc-950 border-yellow-500'
                }`} />
                
                {/* Year */}
                <div className="md:w-32 mb-2 md:mb-0 pt-1 md:pt-6">
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
                        
                        <div className="flex items-center gap-3">
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
                      </div>

                      {/* Optional details */}
                      {comp.details && (
                        <p className="text-gray-400 text-sm mt-2 border-t border-zinc-800 pt-2">
                          {comp.details}
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