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

export const ProQual: React.FC<LanguageProps> = ({ lang }) => {
  const { content: siteContent } = useSiteContent();
  const content = {
    en: {
      title: "Services & Social",
      defaultCta: "Visit Link"
    },
    cn: {
      title: "服務與社群",
      defaultCta: "前往連結"
    }
  };

  const t = content[lang];
  const services = siteContent.servicesList || [];

  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display">{t.title}</h3>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service: DynamicLink) => {
              const IconComponent = IconMap[service.iconName || ''] || Link;
              return (
                <a 
                  key={service.id}
                  href={service.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 hover:border-yellow-500 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer hover:bg-zinc-900/80 hover:-translate-y-2 shadow-lg hover:shadow-yellow-900/20"
                >
                  <div className="bg-zinc-800 p-4 rounded-full mb-6 group-hover:bg-yellow-500/20 transition-colors w-20 h-20 flex items-center justify-center overflow-hidden">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <IconComponent className="w-8 h-8 text-yellow-500" />
                    )}
                  </div>
                  <h4 className="text-white font-bold text-xl uppercase mb-2 font-display">{service.title}</h4>
                  {service.description && (
                    <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-yellow-500 font-medium text-lg mt-auto">
                    <span>{service.linkText || t.defaultCta}</span>
                    <ExternalLink size={16} />
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-zinc-500">
            {lang === 'cn' ? '目前沒有服務或社群連結' : 'No services or social links available'}
          </div>
        )}
      </div>
    </section>
  );
};