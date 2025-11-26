
import React from 'react';
import { Icon } from './Icon';
import { User } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, user }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around z-[60] px-2 pb-safe">
      <button 
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'home' ? 'text-white' : 'text-zinc-500'}`}
      >
        <Icon name="home" className="w-6 h-6" />
        <span className="text-[10px] font-medium">Início</span>
      </button>

      <button 
        onClick={() => setActiveTab('search')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'search' ? 'text-white' : 'text-zinc-500'}`}
      >
        <Icon name="search" className="w-6 h-6" />
        <span className="text-[10px] font-medium">Buscar</span>
      </button>

      <button 
        onClick={() => setActiveTab('library')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'library' ? 'text-white' : 'text-zinc-500'}`}
      >
        <Icon name="library" className="w-6 h-6" />
        <span className="text-[10px] font-medium">Biblioteca</span>
      </button>
    </div>
  );
};
