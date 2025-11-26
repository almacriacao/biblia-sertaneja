
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', showText = true }) => {
  
  const sizeClasses = {
    sm: { icon: 'h-6', text: 'text-lg' },
    md: { icon: 'h-10', text: 'text-2xl' },
    lg: { icon: 'h-16', text: 'text-4xl' },
    xl: { icon: 'h-24', text: 'text-6xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 
        Exibe o arquivo logo.png localizado na pasta public/ do projeto.
        Nenhum filtro de cor é aplicado, mantendo o Branco e Verde originais.
      */}
      <img 
        src="/logo.png" 
        alt="Bíblia Sertaneja" 
        className={`${currentSize.icon} w-auto object-contain`}
      />

      {/* 
        Mantemos o texto ao lado caso o PNG seja apenas o símbolo.
        Se o PNG já tiver o texto escrito, você pode me avisar para removermos essa parte.
      */}
      {showText && (
        <span className={`font-black text-green-500 tracking-tighter uppercase ${currentSize.text}`} style={{ fontFamily: 'sans-serif' }}>
          Sertaneja
        </span>
      )}
    </div>
  );
};
