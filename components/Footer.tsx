import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 border-t border-zinc-900 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-6">Jason Huang</h2>
        <p className="text-zinc-600 text-sm">
          © {new Date().getFullYear()} Jason Huang IFBB Pro. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};