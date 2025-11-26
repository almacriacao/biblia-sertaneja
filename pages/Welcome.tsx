import React from 'react';
import { Logo } from '../components/Logo';
import { APP_TEXT } from '../content';

interface WelcomeProps {
  onLogin: () => void;
  onRegister: () => void; // New action for the clickable header
  onGuest: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onLogin, onRegister, onGuest }) => {
  const t = APP_TEXT.welcome;

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* Clickable Header Button - Replaces Badge */}
        <button 
          onClick={onRegister}
          className="mb-8 w-full group bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-lg shadow-lg shadow-green-500/20 border border-green-400 hover:scale-105 transition-transform duration-200"
        >
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1">
               <span className="text-sm md:text-base font-bold uppercase tracking-wide">
                  🎉 {t.offerBadgePart1} <br/> {t.offerBadgePart2}
               </span>
             </div>
             <div className="h-px w-2/3 bg-green-300/50 my-1"></div>
             <span className="text-xs text-green-100 font-medium">
                {t.offerBadgeSub}
             </span>
          </div>
        </button>

        <div className="mb-6 scale-110">
           <Logo size="xl" />
        </div>
        
        <p className="text-zinc-300 text-lg mb-10 leading-relaxed">
          {t.heroSubtitle}
        </p>

        <div className="space-y-4 w-full">
          {/* Main Action Button - Now specifically for Login */}
          <button 
            onClick={onLogin}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold text-lg py-4 rounded-full transition transform hover:scale-105 shadow-xl shadow-green-900/20"
          >
            {t.ctaLogin}
          </button>
          
          <button 
            onClick={onGuest}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-lg py-4 rounded-full transition border border-zinc-700"
          >
            {t.ctaGuest}
          </button>
        </div>

        <p className="mt-8 text-xs text-zinc-500 uppercase tracking-widest">
          {t.footerTagline}
        </p>
      </div>
    </div>
  );
};