
import React from 'react';
import { Song, Album, Playlist } from '../types';
import { Icon } from '../components/Icon';

interface HomeProps {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  onPlay: (song: Song) => void;
  onPlayWithLyrics: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  isOffline: boolean;
  downloadedSongs: Set<string>;
}

export const Home: React.FC<HomeProps> = ({ songs, albums, playlists, onPlay, onPlayWithLyrics, onAddToPlaylist, isOffline, downloadedSongs }) => {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia, abençoado";
    if (hour < 18) return "Boa tarde, irmão";
    return "A paz do Senhor";
  };

  // Helper to simulate categories based on array index (In a real app, these would be API filters)
  const highlights = songs.slice(0, 2); // First 2 as major highlights
  const newReleases = songs.slice(2, 6); // Next 4 as releases
  const recent = songs.slice().reverse().slice(0, 6); // Reverse list to simulate "recent"

  // FILTER LOGIC FOR OFFLINE MODE
  if (isOffline) {
    const offlineSongs = songs.filter(s => downloadedSongs.has(s.id));

    return (
      <div className="p-4 md:p-8 pb-32 overflow-y-auto h-full bg-black">
        <div className="mb-6 flex items-center justify-between bg-green-900/20 p-4 md:p-6 rounded-xl border border-green-900/50">
           <div>
              <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2 flex items-center gap-2">
                <Icon name="download" className="w-5 h-5 md:w-6 md:h-6" />
                Modo Offline
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm">Apenas músicas baixadas.</p>
           </div>
        </div>

        <section>
          <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Seus Downloads ({offlineSongs.length})</h3>
          {offlineSongs.length > 0 ? (
            <div className="space-y-2">
              {offlineSongs.map((song, index) => (
                <div 
                  key={song.id} 
                  onClick={() => onPlay(song)}
                  className="flex items-center p-2 md:p-3 rounded-md hover:bg-zinc-900 group cursor-pointer transition border border-transparent hover:border-zinc-800"
                >
                  <span className="w-6 md:w-8 text-center text-zinc-500 mr-2 md:mr-4 group-hover:hidden text-sm">{index + 1}</span>
                  <button className="w-8 mr-4 hidden group-hover:block text-white">
                    <Icon name="play" className="w-5 h-5 mx-auto" />
                  </button>
                  
                  <img src={song.coverUrl} alt={song.title} className="w-10 h-10 md:w-12 md:h-12 rounded mr-3 md:mr-4 object-cover" />
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm md:text-base truncate">{song.title}</h4>
                    <p className="text-xs md:text-sm text-green-600 font-medium truncate">{song.bibleReference}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     {song.lyrics && (
                        <button onClick={(e) => { e.stopPropagation(); onPlayWithLyrics(song); }} className="text-zinc-500 hover:text-white">
                          <Icon name="mic" className="w-4 h-4" />
                        </button>
                     )}
                     <Icon name="downloaded" className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                     <button 
                      onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
                      className="text-zinc-500 hover:text-white"
                     >
                       <Icon name="plus" className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                <Icon name="download" className="w-10 h-10 md:w-12 md:h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 font-medium text-sm">Nenhuma música baixada.</p>
             </div>
          )}
        </section>
      </div>
    );
  }

  // STANDARD ONLINE VIEW
  return (
    <div className="p-4 md:p-8 pb-32 overflow-y-auto h-full bg-gradient-to-b from-zinc-900 to-black">
      
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-white tracking-tight">
        {getGreeting()}
      </h2>

      {/* Dicas / CTAs Banner - Compact Grid on Mobile */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
         {/* Tip 1: Create Playlist */}
         <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 md:p-4 rounded-lg md:rounded-xl border border-zinc-800 hover:border-green-500/50 transition group cursor-pointer">
            <div className="flex items-start justify-between mb-1 md:mb-2">
               <div className="bg-green-500/20 p-1.5 md:p-2 rounded-full text-green-500">
                  <Icon name="list" className="w-4 h-4 md:w-5 md:h-5" />
               </div>
               <span className="text-[9px] md:text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-1.5 md:px-2 py-0.5 md:py-1 rounded">Dica</span>
            </div>
            <h4 className="font-bold text-white text-xs md:text-base mb-0.5 md:mb-1 group-hover:text-green-400 transition">Playlist pro Culto</h4>
            <p className="text-[10px] md:text-xs text-zinc-400 leading-relaxed hidden md:block">Crie sua playlist personalizada agora e organize os louvores.</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed md:hidden">Crie sua lista agora.</p>
         </div>

         {/* Tip 2: Share */}
         <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 md:p-4 rounded-lg md:rounded-xl border border-zinc-800 hover:border-green-500/50 transition group cursor-pointer">
            <div className="flex items-start justify-between mb-1 md:mb-2">
               <div className="bg-green-500/20 p-1.5 md:p-2 rounded-full text-green-500">
                  <Icon name="share" className="w-4 h-4 md:w-5 md:h-5" />
               </div>
               <span className="text-[9px] md:text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-1.5 md:px-2 py-0.5 md:py-1 rounded">Dica</span>
            </div>
            <h4 className="font-bold text-white text-xs md:text-base mb-0.5 md:mb-1 group-hover:text-green-400 transition">Envie no Zap</h4>
            <p className="text-[10px] md:text-xs text-zinc-400 leading-relaxed hidden md:block">Compartilhe a música que está tocando no grupo da igreja.</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed md:hidden">Compartilhe no grupo.</p>
         </div>

          {/* Tip 3: Offline (Hidden on small mobile grids if 2 cols) */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 md:p-4 rounded-lg md:rounded-xl border border-zinc-800 hover:border-green-500/50 transition group cursor-pointer hidden lg:block">
            <div className="flex items-start justify-between mb-2">
               <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                  <Icon name="download" className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-2 py-1 rounded">Dica</span>
            </div>
            <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition">Vai pro monte?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Baixe suas músicas favoritas para ouvir onde não tem sinal.</p>
         </div>
      </section>

      {/* Section: Destaques - Thinner Mobile Cards */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
           <h3 className="text-lg md:text-xl font-bold text-white">Destaques</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {highlights.map(song => (
            <div 
              key={song.id} 
              onClick={() => onPlay(song)}
              className="group relative bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition cursor-pointer flex items-center md:items-stretch h-20 md:h-auto"
            >
              {/* Compact Image on Mobile */}
              <div className="w-20 h-20 md:w-40 md:h-40 flex-shrink-0 relative">
                 <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                     <button className="w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 hidden md:flex">
                        <Icon name="play" className="ml-1 w-5 h-5 md:w-6 md:h-6" />
                     </button>
                 </div>
              </div>
              <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
                  <div className="mb-1 hidden md:block">
                     <span className="text-[10px] font-bold uppercase bg-green-900 text-green-400 px-2 py-1 rounded border border-green-800">Em Alta</span>
                  </div>
                  <h4 className="font-bold text-sm md:text-lg text-white md:mb-1 leading-tight truncate">{song.title}</h4>
                  <p className="text-xs text-green-500 mb-0.5 md:mb-2 truncate">{song.bibleReference}</p>
                  <p className="text-[10px] md:text-xs text-zinc-400 line-clamp-1 md:line-clamp-2">{song.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Lançamentos - 3 Cols on Mobile for "Thinner" look */}
      <section className="mb-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Lançamentos</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {newReleases.map(song => (
            <div 
              key={song.id} 
              className="group bg-transparent md:bg-zinc-900/50 p-0 md:p-4 rounded-md hover:bg-zinc-800 transition cursor-pointer relative"
            >
              <div className="relative mb-2" onClick={() => onPlay(song)}>
                <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded md:rounded shadow-md" />
                
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-bl shadow-sm">
                  NOVO
                </div>

                <button className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 z-10 hidden md:flex">
                  <Icon name="play" className="ml-1 w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <div className="flex justify-between items-start">
                 <div className="overflow-hidden w-full" onClick={() => onPlay(song)}>
                    <h4 className="font-bold text-xs md:text-sm truncate text-white leading-tight mb-0.5">{song.title}</h4>
                    <p className="text-[10px] md:text-xs text-zinc-400 font-medium truncate">{song.bibleReference}</p>
                 </div>
                 <div className="flex flex-col gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
                      className="text-zinc-500 hover:text-white p-1 hidden md:block"
                      title="Adicionar à playlist"
                    >
                      <Icon name="plus" className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Tocadas Recentemente */}
      <section className="mb-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Tocadas Recentemente</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {recent.map(song => (
            <div 
              key={song.id} 
              className="group bg-transparent md:bg-zinc-900/30 p-0 md:p-3 rounded-md hover:bg-zinc-800 transition cursor-pointer"
              onClick={() => onPlay(song)}
            >
               <div className="relative mb-2">
                  <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded opacity-90 md:opacity-80 group-hover:opacity-100 transition" />
                  {downloadedSongs.has(song.id) && (
                    <div className="absolute top-1 right-1 bg-green-500 text-black p-0.5 rounded-full shadow-md" title="Baixado">
                       <Icon name="downloaded" className="w-2 h-2 md:w-3 md:h-3" />
                    </div>
                 )}
               </div>
               <h4 className="font-medium text-xs text-zinc-300 truncate group-hover:text-white">{song.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Footer */}
      <section className="mt-8 md:mt-12 py-6 md:py-8 border-t border-zinc-900">
        <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition text-[10px] md:text-xs text-zinc-500">
          <Icon name="lock" className="w-3 h-3" />
          <span>Protected by DRM • HLS Streaming</span>
        </div>
      </section>
    </div>
  );
};