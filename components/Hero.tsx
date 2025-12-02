import React, { useState, useEffect } from 'react';

export const Hero: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isTypingFirst, setIsTypingFirst] = useState(true);

  useEffect(() => {
    const fullFirst = "Jason";
    const fullLast = "Huang";
    let timeout: ReturnType<typeof setTimeout>;

    if (isTypingFirst) {
      if (firstName.length < fullFirst.length) {
        timeout = setTimeout(() => {
          setFirstName(fullFirst.slice(0, firstName.length + 1));
        }, 150); // Typing speed
      } else {
        setIsTypingFirst(false);
      }
    } else {
      if (lastName.length < fullLast.length) {
        timeout = setTimeout(() => {
          setLastName(fullLast.slice(0, lastName.length + 1));
        }, 150);
      }
    }

    return () => clearTimeout(timeout);
  }, [firstName, lastName, isTypingFirst]);

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <img 
          src="https://contests.npcnewsonline.com/images/contests/4367/large/21830560.jpg" 
          alt="Jason Huang IFBB Pro" 
          className="h-full w-full object-cover object-top opacity-80"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-yellow-500 font-bold tracking-widest text-lg md:text-xl mb-4 uppercase animate-fade-in-up">
          IFBB Classic Physique Pro
        </h2>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-none mb-6 min-h-[1.2em] md:min-h-[2.4em]">
          {firstName}
          {isTypingFirst && <span className="animate-blink text-yellow-500">|</span>}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">
            {lastName}
          </span>
          {!isTypingFirst && <span className="animate-blink text-white ml-2">|</span>}
        </h1>
        <p className="max-w-xl text-gray-300 text-lg md:text-xl font-light border-l-4 border-yellow-500 pl-4 animate-fade-in-up delay-200">
          Discipline. Aesthetics. Legacy. <br />
          Representing Taiwan on the global stage.
        </p>
      </div>
    </div>
  );
};