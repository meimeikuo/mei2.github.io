import React from 'react';
import { ExternalLink, TicketPercent, Link, Dumbbell, UtensilsCrossed, Instagram, PlaySquare, ShoppingBag, ShoppingCart, Pill, Zap } from 'lucide-react';
import { LanguageProps } from '../types';
import { useSiteContent, DynamicLink } from '../hooks/useSiteContent';

const IconMap: Record<string, React.ElementType> = {
  Link,
  Dumbbell,
  UtensilsCrossed,
  Instagram,
  PlaySquare,
  ShoppingBag,
  ShoppingCart,
  Pill,
  Zap
};

export const Sponsors: React.FC<LanguageProps> = ({ lang }) => {
  const { content: siteContent } = useSiteContent();
  const content = {
    en: {
      title: "Official Partners",
      cta: "Shop via Link",
      discount: {
        title: "Exclusive Discount",
        desc: "Use at checkout across all partners"
      }
    },
    cn: {
      title: "合作廠商",
      cta: "專屬連結購買",
      discount: {
        title: "專屬折扣碼",
        desc: "結帳輸入享最高優惠"
      }
    }
  };

  const t = content[lang];
  const sponsors = siteContent.sponsorsList || [];

  return (
    <section className="bg-zinc-950 py-24 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display">{t.title}</h3>
        </div>

        {sponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {sponsors.map((sponsor: DynamicLink) => {
              const IconComponent = IconMap[sponsor.iconName || ''] || Link;
              return (
                <a 
                  key={sponsor.id}
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-900/10 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 text-yellow-500 group-hover:text-black transition-colors overflow-hidden">
                    {sponsor.imageUrl ? (
                      <img src={sponsor.imageUrl} alt={sponsor.title} className="w-full h-full object-cover" />
                    ) : (
                      <IconComponent size={32} />
                    )}
                  </div>
                  <h4 className="text-xl font-black text-white uppercase mb-2 font-display">{sponsor.title}</h4>
                  {sponsor.description && (
                    <p className="text-zinc-400 text-sm mb-4">{sponsor.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-zinc-400 group-hover:text-black transition-colors text-sm mt-auto">
                    <span>{sponsor.linkText || t.cta}</span>
                    <ExternalLink size={14} />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Discount Code Section */}
        {siteContent.discountCode && (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in-up max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-y-2 border-yellow-500/30 w-full py-8 px-4 relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-zinc-400 uppercase tracking-[0.2em] text-sm font-bold font-display">
                  <TicketPercent size={18} className="text-yellow-500" />
                  <span>{t.discount.title}</span>
                  <TicketPercent size={18} className="text-yellow-500" />
                </div>
                <div className="text-4xl md:text-6xl font-black text-white tracking-widest selection:bg-yellow-500 selection:text-black font-display">
                  {siteContent.discountCode}
                </div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mt-2 font-sans">{t.discount.desc}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};