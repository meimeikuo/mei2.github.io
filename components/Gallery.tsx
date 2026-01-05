import React from 'react';
import { LanguageProps } from '../types';

const GALLERY_IMAGES = [
  "https://i.ibb.co/27KpSbD5/LINE-ALBUM-2025-251210-8.jpg",
  "https://i.ibb.co/d0Lt0Nmt/LINE-ALBUM-2025-251210-1.jpg",
  "https://i.ibb.co/4nvv349R/LINE-ALBUM-2025-251210-2.jpg",
  "https://i.ibb.co/mFC2jwRj/LINE-ALBUM-2025-251210-3.jpg",
  "https://i.ibb.co/VWjDkwrX/LINE-ALBUM-2025-251210-4.jpg",
  "https://i.ibb.co/354QWp6g/LINE-ALBUM-2025-251210-5.jpg",
  "https://i.ibb.co/8gZwnFN6/LINE-ALBUM-2025-251210-6.jpg",
  "https://i.ibb.co/wtqfqq8/LINE-ALBUM-2025-251210-7.jpg",
  "https://i.ibb.co/YBbQRDdJ/LINE-ALBUM-2025-251210-9.jpg"
];

export const Gallery: React.FC<LanguageProps> = ({ lang }) => {
  const content = {
    en: { title: "Visual", subtitle: "Gallery" },
    cn: { title: "影音", subtitle: "圖庫" }
  };
  const t = content[lang];

  return (
    <section className="bg-black py-20 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-12 text-center font-display">
          {t.title} <span className="text-yellow-500">{t.subtitle}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900 group relative border border-zinc-800 hover:border-yellow-500 transition-all">
              <img 
                src={src} 
                alt={`Competition ${i}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <div className="border border-yellow-500 text-yellow-500 px-4 py-2 text-xs uppercase font-bold tracking-widest font-display translate-y-4 group-hover:translate-y-0 transition-transform">
                  Full View
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};