
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean; // Prop kept for compatibility but ignored
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md' }) => {
  const [hasError, setHasError] = useState(false);

  // Adjusted heights to accommodate a full logo (symbol + text)
  const sizeClasses = {
    sm: 'h-8', 
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32'
  };

  const heightClass = sizeClasses[size];

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center border border-red-500 bg-red-900/20 text-red-500 p-2 text-[10px] font-mono rounded ${className}`}>
        <span>LOGO.PNG NÃO ENCONTRADO</span>
        <span className="opacity-50">Verifique a pasta public</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Bíblia Sertaneja" 
        className={`${heightClass} w-auto object-contain`}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
