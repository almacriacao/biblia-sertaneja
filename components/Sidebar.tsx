
import React from 'react';
import { Icon } from './Icon';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  toggleOffline: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOffline, toggleOffline }) => {
  return (
    <div className="w-64 bg-black h-full flex-col hidden md:flex border-r border-zinc-900">
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold text-green-500 tracking-tighter flex items-center gap-2">
          <Icon name="play" className="w-6 h-6" />
          Bíblia Sertaneja
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex items-center w-full px-4 py-3 font-semibold text-sm rounded transition duration-200 ${activeTab === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          <Icon name="home" className="mr-4" />
          Início
        </button>
        
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex items-center w-full px-4 py-3 font-semibold text-sm rounded transition duration-200 ${activeTab === 'search' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
           <Icon name="search" className="mr-4" />
           Buscar
        </button>
        
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex items-center w-full px-4 py-3 font-semibold text-sm rounded transition duration-200 ${activeTab === 'library' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          <Icon name="library" className="mr-4" />
          Sua Biblioteca
        </button>

        {/* Admin Link (Normally protected by role) */}
        <div className="pt-4 mt-4 border-t border-zinc-900">
          <p className="px-4 text-xs text-zinc-600 font-bold uppercase mb-2">Gerenciamento</p>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex items-center w-full px-4 py-2 font-semibold text-sm rounded transition duration-200 ${activeTab === 'admin' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500 hover:text-green-500'}`}
          >
            <Icon name="settings" className="mr-4 w-5 h-5" />
            Admin / CMS
          </button>
        </div>
      </nav>

      <div className="px-6 py-4 border-t border-zinc-900 space-y-4">
        {/* Offline Toggle */}
        <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg">
          <div className="flex items-center text-zinc-300 text-sm font-medium gap-2">
             <Icon name="download" className="w-4 h-4" />
             Modo Offline
          </div>
          <button 
            onClick={toggleOffline}
            className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 flex items-center ${isOffline ? 'bg-green-500' : 'bg-zinc-600'}`}
          >
             <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOffline ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-xs text-zinc-400 font-semibold uppercase mb-2">Status Assinatura</p>
          <div className="flex items-center text-green-400 text-sm font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Premium Ativo
          </div>
        </div>
      </div>
    </div>
  );
};
