import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ExternalLink, Trophy, Calendar } from 'lucide-react';
import { LanguageProps } from '../types';
import { useSiteContent, Competition } from '../hooks/useSiteContent';

interface YearGroup {
  year: number;
  items: Competition[];
}

export const History: React.FC<LanguageProps> = ({ lang }) => {
  const { content: siteContent } = useSiteContent();
  const [activeCardId, setActiveCardId] = useState<string>('');
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const content = {
    en: {
      title: "Pro Career",
      subtitle: "Stats",
      contestsLabel: "Contests",
      viewDetails: "Official Results",
      competitions: siteContent.competitionsEn || []
    },
    cn: {
      title: "職業生涯",
      subtitle: "戰績",
      contestsLabel: "場賽事",
      viewDetails: "查看官方賽事紀錄",
      competitions: siteContent.competitionsCn || []
    }
  };

  const t = content[lang];

  // Group competitions by year descending
  const yearGroups = useMemo<YearGroup[]>(() => {
    const list = [...t.competitions];
    const map = new Map<number, Competition[]>();

    list.forEach((comp, idx) => {
      const id = comp.id || `${comp.year}-${idx}`;
      const item = { ...comp, id };
      const group = map.get(comp.year) || [];
      group.push(item);
      map.set(comp.year, group);
    });

    const years = Array.from(map.keys()).sort((a, b) => b - a);
    return years.map(year => ({
      year,
      items: map.get(year) || []
    }));
  }, [t.competitions]);

  // Set default active card to the first one once loaded
  useEffect(() => {
    if (yearGroups.length > 0 && yearGroups[0].items.length > 0) {
      const firstId = yearGroups[0].items[0].id;
      if (!activeCardId || !yearGroups.some(g => g.items.some(i => i.id === activeCardId))) {
        setActiveCardId(firstId);
      }
    }
  }, [yearGroups, activeCardId]);

  // IntersectionObserver to detect card closest to center of viewport
  useEffect(() => {
    const elements = Array.from(cardRefs.current.values());
    if (elements.length === 0) return;

    const handleScrollOrIntersect = () => {
      const midY = window.innerHeight / 2;
      let closestId = '';
      let minDistance = Infinity;

      cardRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        // Check if element is in viewport
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          const cardMid = rect.top + rect.height / 2;
          const dist = Math.abs(cardMid - midY);
          if (dist < minDistance) {
            minDistance = dist;
            closestId = id;
          }
        }
      });

      if (closestId) {
        setActiveCardId(closestId);
      }
    };

    // Initial check
    handleScrollOrIntersect();

    const observer = new IntersectionObserver(
      () => {
        handleScrollOrIntersect();
      },
      {
        root: null,
        rootMargin: '-15% 0px -15% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );

    elements.forEach(el => observer.observe(el));
    window.addEventListener('scroll', handleScrollOrIntersect, { passive: true });
    window.addEventListener('resize', handleScrollOrIntersect, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollOrIntersect);
      window.removeEventListener('resize', handleScrollOrIntersect);
    };
  }, [yearGroups]);

  const getMedalBadgeClass = (medal?: string) => {
    if (medal === 'gold') {
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.45)] border border-yellow-300';
    }
    if (medal === 'silver') {
      return 'bg-gradient-to-r from-slate-200 to-zinc-300 text-black font-extrabold shadow-[0_0_15px_rgba(226,232,240,0.4)] border border-slate-100';
    }
    if (medal === 'bronze') {
      return 'bg-gradient-to-r from-[#D98748] to-[#A0522D] text-white font-extrabold shadow-[0_0_15px_rgba(217,135,72,0.4)] border border-amber-600/50';
    }
    return 'bg-zinc-800/90 text-yellow-400 border border-zinc-700/80 font-bold';
  };

  return (
    <section id="career-history" className="bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 relative selection:bg-yellow-500 selection:text-black">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-4 font-display">
            <Trophy size={14} className="text-yellow-400" />
            <span>Honors & Timeline</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight font-display">
            {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">{t.subtitle}</span>
          </h2>
        </div>

        {/* Timeline Structure */}
        <div className="relative pl-6 sm:pl-10 ml-2 sm:ml-6 border-l-2 border-zinc-800/80 space-y-16 sm:space-y-20">
          {yearGroups.map((group) => (
            <div key={group.year} className="relative group/year">
              {/* Year Main Node */}
              <div className="absolute -left-[33px] sm:-left-[49px] top-0 flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-950 border-2 border-yellow-500 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] z-20">
                  <Calendar size={16} className="text-yellow-400" />
                </div>
              </div>

              {/* Year Header Block (Rendered once per year) */}
              <div className="flex flex-wrap items-center gap-3 pt-1 mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
                  {group.year}
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs sm:text-sm font-medium font-sans">
                  {group.items.length} {t.contestsLabel}
                </span>
              </div>

              {/* Stacked Competition Cards for this Year */}
              <div className="space-y-4 sm:space-y-6">
                {group.items.map((comp) => {
                  const isActive = activeCardId === comp.id;
                  const Wrapper = comp.link ? 'a' : 'div';
                  const wrapperProps = comp.link
                    ? {
                        href: comp.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "block no-underline group/card cursor-pointer"
                      }
                    : { className: "block group/card" };

                  return (
                    <div
                      key={comp.id}
                      ref={(el) => {
                        if (el) {
                          cardRefs.current.set(comp.id, el);
                        } else {
                          cardRefs.current.delete(comp.id);
                        }
                      }}
                      data-comp-id={comp.id}
                      className="relative pl-4 sm:pl-6"
                    >
                      {/* Timeline Sub-node dot */}
                      <div
                        className={`absolute -left-[27px] sm:-left-[43px] top-6 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 z-10 ${
                          isActive
                            ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.9)] scale-125'
                            : 'bg-zinc-950 border-zinc-700 group-hover/card:border-yellow-500/70'
                        }`}
                      />

                      {/* Card Component */}
                      <Wrapper {...wrapperProps}>
                        <div
                          className={`career-card rounded-2xl p-5 sm:p-7 border relative overflow-hidden backdrop-blur-sm ${
                            isActive
                              ? 'is-active bg-zinc-900/95 border-yellow-500/80 shadow-2xl'
                              : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/85 hover:shadow-lg'
                          }`}
                        >
                          {/* Top Accent line on active */}
                          <div
                            className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 ${
                              isActive
                                ? 'bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-100'
                                : 'opacity-0'
                            }`}
                          />

                          <div className="flex flex-col gap-3">
                            {/* Card Header: Title & Rank */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <h3
                                className={`text-lg sm:text-xl font-bold uppercase tracking-tight transition-colors font-display ${
                                  isActive ? 'text-white' : 'text-zinc-200 group-hover/card:text-white'
                                } ${comp.link ? 'group-hover/card:text-yellow-400 transition-colors' : ''}`}
                              >
                                {comp.name}
                              </h3>

                              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                <span
                                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 font-sans ${getMedalBadgeClass(
                                    comp.medal
                                  )}`}
                                >
                                  {comp.rank}
                                </span>
                              </div>
                            </div>

                            {/* Optional Details */}
                            {comp.details && (
                              <p className="text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/60 pt-3">
                                {comp.details}
                              </p>
                            )}

                            {/* Link Action CTA if available */}
                            {comp.link && (
                              <div className="pt-2 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-yellow-500/90 group-hover/card:text-yellow-400 transition-colors">
                                <span>{t.viewDetails}</span>
                                <ExternalLink size={14} className="transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </Wrapper>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};