
import React, { useState } from 'react';

// ⬇️ COLE O LINK DO SEU GITHUB RAW OU VERCEL AQUI PARA O PREVIEW FUNCIONAR ⬇️
// Exemplo: "https://bibliasertaneja.vercel.app/logo.png"
const REMOTE_LOGO_URL = "https://bibliasertaneja.vercel.app/logo.png"; 

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean; // Prop kept for compatibility but ignored
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md' }) => {
  const [imgSrc, setImgSrc] = useState("/logo.png");
  const [retryCount, setRetryCount] = useState(0);

  // Adjusted heights to accommodate a full logo (symbol + text)
  const sizeClasses = {
    sm: 'h-8', 
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32'
  };

  const heightClass = sizeClasses[size];

  const handleError = () => {
    // Retry Logic Sequence:
    // 1. Try public folder (/logo.png) - Default
    // 2. Try root relative (logo.png)
    // 3. Try Remote URL (GitHub/Vercel) if provided
    
    if (retryCount === 0) {
        setImgSrc("logo.png");
        setRetryCount(1);
    } else if (retryCount === 1 && REMOTE_LOGO_URL) {
        setImgSrc(REMOTE_LOGO_URL);
        setRetryCount(2);
    } else {
        setRetryCount(3); // Failed all
    }
  };

  if (retryCount === 3) {
    return (
      <div className={`flex flex-col items-center justify-center border border-red-500 bg-red-900/20 text-red-500 p-2 text-[10px] font-mono rounded ${className}`}>
        <span>LOGO NÃO CARREGOU</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={imgSrc}
        alt="Bíblia Sertaneja" 
        className={`${heightClass} w-auto object-contain`}
        onError={handleError}
      />
    </div>
  );
};
