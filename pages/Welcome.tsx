
import React from 'react';
import { Logo } from '../components/Logo';
import { APP_TEXT } from '../content';

interface WelcomeProps {
  onLogin: () => void;
  onRegister: () => void; // Used for the offer button
  onGuest: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onLogin, onRegister, onGuest }) => {
  const t = APP_TEXT.welcome;

  return (
    <div className="h-screen w-full bg-blue-950 flex flex-col items-center relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-black/80 to-transparent"></div>

      {/* Content Container - Flex Column for Vertical Spacing */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-md px-6 py-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* TOP SECTION: Logo & Tagline */}
        <div className="flex flex-col items-center w-full mt-8">
           <div className="scale-110 mb-6">
              <Logo size="xl" />
           </div>
           {/* Tagline em 1 linha - REMOVED UPPERCASE */}
           <p className="text-zinc-300 text-sm font-medium text-center opacity-90 leading-relaxed">
              {t.heroSubtitle}
           </p>
        </div>

        {/* MIDDLE SECTION: Offer Title (NO BANNER) */}
        <div className="flex flex-col items-center text-center my-4">
           {/* Título Principal */}
           <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3 tracking-tight">
              {t.offerTitle}
           </h1>
           {/* Subtítulo pequeno - REMOVED UPPERCASE */}
           <p className="text-zinc-400 text-sm font-bold opacity-90">
              {t.offerSubtitle}
           </p>
        </div>

        {/* BOTTOM SECTION: Buttons */}
        <div className="w-full space-y-3">
          {/* Primary Action - Register/Offer - Botão Verde formato Pílula */}
          <button 
            onClick={onRegister}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold text-lg py-4 rounded-full transition transform hover:scale-105 shadow-xl shadow-green-900/30"
          >
            {t.ctaRegister}
          </button>
          
          {/* Secondary Action - Login - Botão Cinza formato Pílula (Idêntico ao de cima) */}
          <button 
            onClick={onLogin}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-lg py-4 rounded-full transition border border-zinc-700"
          >
            {t.ctaLogin}
          </button>
          
          {/* Tertiary Action - Guest */}
          <div className="pt-2 text-center">
            <button 
                onClick={onGuest}
                className="text-zinc-500 hover:text-white font-medium text-sm transition py-2"
            >
                {t.ctaGuest}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
