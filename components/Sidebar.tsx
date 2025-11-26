import React from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { User } from '../types';
import { APP_TEXT } from '../content';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  toggleOffline: () => void;
  user: User | null;
  onLoginRequest: () => void;
  onLogout: () => void;
  onCreatePlaylist: () => void; // New prop
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOffline, 
  toggleOffline, 
  user,
  onLoginRequest,
  onLogout,
  onCreatePlaylist
}) => {
  const t = APP_TEXT.sidebar;

  const handleUserClick = () => {
      if (user) {
          setActiveTab('profile');
      }
  };

  return (
    <div className="w-64 bg-black h-full flex-col hidden md:flex border-r border-zinc-900">
      <div className="p-6 mb-4">
        {/* Updated to use Logo */}
        <Logo size="md" />
      </div>

      <nav className="flex-1 px-3 space-y-2">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex items-center w-full px-4 py-3 font-semibold text-sm rounded transition duration-200 ${activeTab === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          <Icon name="home" className="mr-4" />
          {t.menu.home}
        </button>
        
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex items-center w-full px-4 py-3 font-semibold text-sm rounded transition duration-200 ${activeTab === 'search' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
           <Icon name="search" className="mr-4" />
           {t.menu.search}
        </button>
        
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex items-center w-full px-4 py-3 font-semibold text-sm rounded transition duration-200 ${activeTab === 'library' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          <Icon name="library" className="mr-4" />
          {t.menu.library}
        </button>

        {/* Create Playlist Button - Styled to fit in */}
        <button 
          onClick={onCreatePlaylist}
          className="flex items-center w-full px-4 py-3 font-bold text-sm rounded transition duration-200 text-zinc-400 hover:text-white group"
        >
            <div className="bg-zinc-800 group-hover:bg-white text-zinc-400 group-hover:text-black mr-4 p-1 rounded-sm transition-colors">
                 <Icon name="plus" className="w-4 h-4" />
            </div>
            {t.menu.createPlaylist}
        </button>
      </nav>

      <div className="px-6 py-4 border-t border-zinc-900 space-y-4">
        
        {/* User Status / Login CTA */}
        {user ? (
          <div 
            onClick={handleUserClick}
            className={`flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded hover:bg-zinc-900 transition ${activeTab === 'profile' ? 'bg-zinc-900' : ''}`}
            title="Ver Perfil"
          >
             <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full bg-zinc-800" />
                <div className="overflow-hidden">
                   <p className="text-sm font-bold text-white truncate w-24">{user.name}</p>
                   {user.isTrial ? (
                      <p className="text-[10px] text-green-400 font-bold animate-pulse">{t.trialBadge}</p>
                   ) : (
                      <p className="text-[10px] text-green-600 font-bold">ASSINANTE</p>
                   )}
                </div>
             </div>
             <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="text-zinc-500 hover:text-white p-1" title="Sair">
                <Icon name="logout" className="w-5 h-5" />
             </button>
          </div>
        ) : (
          <button 
            onClick={onLoginRequest}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-full text-sm transition flex items-center justify-center gap-2"
          >
             {t.loginCta}
          </button>
        )}

        {/* Offline Toggle */}
        <div className={`flex items-center justify-between bg-zinc-900 p-3 rounded-lg ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="flex items-center text-zinc-300 text-sm font-medium gap-2">
             <Icon name="download" className="w-4 h-4" />
             {t.offlineMode}
          </div>
          <button 
            disabled={!user}
            onClick={(e) => { e.stopPropagation(); if(user) toggleOffline(); }}
            className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 flex items-center ${isOffline ? 'bg-green-500' : 'bg-zinc-600'}`}
          >
             <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOffline ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>
    </div>
  );
};