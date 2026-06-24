import React from 'react';
import { ExternalLink, Link, Dumbbell, UtensilsCrossed, Instagram, PlaySquare, ShoppingBag, ShoppingCart, Pill, Zap } from 'lucide-react';
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

export const Others: React.FC<LanguageProps> = ({ lang }) => {
  const { content: siteContent } = useSiteContent();
  const content = {
    en: {
      title: "Others",
      defaultCta: "Explore"
    },
    cn: {
      title: "其他",
      defaultCta: "探索更多"
    }
  };

  const t = content[lang];
  const others = siteContent.othersList || [];

  return (
    <section className="bg-zinc-950 py-20 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display">{t.title}</h3>
        </div>

        {others.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {others.map((item: DynamicLink) => {
              const IconComponent = IconMap[item.iconName || ''] || Link;
              return (
                <a 
                  key={item.id}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-zinc-800 hover:border-yellow-500 transition-all duration-500 bg-zinc-900"
                >
                  <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center min-h-[250px] overflow-hidden">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-yellow-500 text-yellow-500 group-hover:text-black transition-colors z-10">
                        <IconComponent size={32} />
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-1/2 relative z-10 p-8 flex flex-col items-center justify-center text-center bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800">
                    <h4 className="text-2xl font-bold text-white uppercase mb-4 font-display">{item.title}</h4>
                    {item.description && (
                      <p className="text-zinc-400 text-base mb-6">{item.description}</p>
                    )}
                    <div className="inline-flex items-center gap-2 bg-zinc-800 text-white group-hover:text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest group-hover:bg-yellow-500 transition-colors duration-300 text-sm mt-auto">
                      <span>{item.linkText || t.defaultCta}</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
