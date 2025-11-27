
import React from 'react';
import { Icon } from './Icon';
import { User } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onCreatePlaylist: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, user, onCreatePlaylist }) => {
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

      <button 
        onClick={onCreatePlaylist}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-zinc-500 hover:text-white`}
      >
        <div className="bg-zinc-800 p-1 rounded-md">
            <Icon name="plus" className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-medium">Criar</span>
      </button>
    </div>
  );
};
