import React from 'react';
import { Crown, Dumbbell, Instagram, ExternalLink } from 'lucide-react';

export const ProQual: React.FC = () => {
  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-yellow-500 font-bold tracking-widest uppercase mb-2">Connect & Status</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase">Pro Status & Coaching</h3>
          <p className="text-gray-400 mt-4 text-lg">Join the team or follow the journey.</p>
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
            <h4 className="text-white font-bold text-xl uppercase mb-2">COURSE INQUIRY</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-medium text-lg">
              <span>Start Now</span>
              <ExternalLink size={16} />
            </div>
            <p className="text-gray-400 mt-2 text-sm">Customized Programming</p>
          </a>

          {/* Box 2: Center - Pro Card (Static Achievement) */}
          <div className="bg-zinc-900 p-8 rounded-lg border-2 border-yellow-500/50 hover:border-yellow-500 transition-colors duration-300 flex flex-col items-center text-center group transform md:-translate-y-4 shadow-2xl shadow-yellow-900/20">
            <div className="bg-zinc-800 p-4 rounded-full mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <Crown className="w-12 h-12 text-yellow-400" />
            </div>
            <h4 className="text-white font-bold text-2xl uppercase mb-2">IFBB Pro Card</h4>
            <p className="text-yellow-400 font-bold text-xl">Overall Champion</p>
            <span className="mt-4 px-4 py-1 bg-yellow-500 text-black font-bold text-sm rounded-full">
              2022 NPC Worldwide Taiwan
            </span>
            <p className="text-gray-400 mt-4 text-sm italic">Status: Active</p>
          </div>

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
            <h4 className="text-white font-bold text-xl uppercase mb-2">INSTAGRAM</h4>
            <div className="flex items-center gap-2 text-yellow-500 font-medium text-lg">
              <span>@jasonhuang_ifbbpro</span>
              <ExternalLink size={16} />
            </div>
            <p className="text-gray-400 mt-2 text-sm">Follow the Daily Process</p>
          </a>
        </div>
      </div>
    </section>
  );
};