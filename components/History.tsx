import React from 'react';
import { Competition } from '../types';

const competitions: Competition[] = [
  { 
    year: 2025, 
    name: "Japan Pro Men's Classic Physique",
    rank: "No. 7" 
  },
  { 
    year: 2024, 
    name: "IFBB Taiwan Pro", 
    rank: "No. 3", 
    medal: 'bronze' 
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
];

export const History: React.FC = () => {
  return (
    <section className="bg-black py-20 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-12 text-center">
          Pro Career <span className="text-yellow-500">Stats</span>
        </h2>

        <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-0 md:pl-8 space-y-12">
          {competitions.map((comp, index) => (
            <div key={index} className="relative pl-8 md:pl-0 flex flex-col md:flex-row md:items-center group">
              {/* Dot */}
              <div className={`absolute -left-[9px] md:-left-[41px] w-4 h-4 rounded-full border-2 ${comp.medal === 'bronze' ? 'bg-[#CD7F32] border-[#CD7F32]' : 'bg-zinc-950 border-yellow-500'} z-10 group-hover:scale-125 transition-transform`} />
              
              {/* Year */}
              <div className="md:w-32 mb-2 md:mb-0">
                <span className="text-2xl font-bold text-zinc-500 group-hover:text-white transition-colors">{comp.year}</span>
              </div>

              {/* Card */}
              <div className="flex-1 bg-zinc-900 p-6 rounded-lg border-l-4 border-transparent hover:border-yellow-500 transition-all shadow-lg hover:shadow-yellow-900/10">
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                  <div>
                    <h3 className="text-xl text-white font-bold uppercase">{comp.name}</h3>
                  </div>
                  <div className={`px-4 py-1 rounded font-bold text-sm uppercase whitespace-nowrap ${
                    comp.medal === 'bronze' 
                      ? 'bg-[#CD7F32] text-white' 
                      : 'bg-zinc-800 text-yellow-500'
                  }`}>
                    {comp.rank}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};