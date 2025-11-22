import React from 'react';
import { Song, Album, Playlist } from '../types';
import { Icon } from '../components/Icon';

interface HomeProps {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  isOffline: boolean;
  downloadedSongs: Set<string>;
}

export const Home: React.FC<HomeProps> = ({ songs, albums, playlists, onPlay, onAddToPlaylist, isOffline, downloadedSongs }) => {
  
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
      <div className="p-8 pb-32 overflow-y-auto h-full bg-black">
        <div className="mb-8 flex items-center justify-between bg-green-900/20 p-6 rounded-xl border border-green-900/50">
           <div>
              <h2 className="text-2xl font-bold text-green-500 mb-2 flex items-center gap-2">
                <Icon name="download" className="w-6 h-6" />
                Modo Offline Ativado
              </h2>
              <p className="text-zinc-400 text-sm">Você está vendo apenas suas músicas baixadas.</p>
           </div>
        </div>

        <section>
          <h3 className="text-xl font-bold mb-4 text-white">Seus Downloads ({offlineSongs.length})</h3>
          {offlineSongs.length > 0 ? (
            <div className="space-y-2">
              {offlineSongs.map((song, index) => (
                <div 
                  key={song.id} 
                  onClick={() => onPlay(song)}
                  className="flex items-center p-3 rounded-md hover:bg-zinc-900 group cursor-pointer transition border border-transparent hover:border-zinc-800"
                >
                  <span className="w-8 text-center text-zinc-500 mr-4 group-hover:hidden">{index + 1}</span>
                  <button className="w-8 mr-4 hidden group-hover:block text-white">
                    <Icon name="play" className="w-5 h-5 mx-auto" />
                  </button>
                  
                  <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded mr-4 object-cover" />
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{song.title}</h4>
                    <p className="text-sm text-green-600 font-medium">{song.bibleReference}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <Icon name="downloaded" className="w-5 h-5 text-green-500" />
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
                <Icon name="download" className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 font-medium">Nenhuma música baixada.</p>
                <p className="text-zinc-600 text-sm mt-1">Fique online para baixar suas modas preferidas.</p>
             </div>
          )}
        </section>
      </div>
    );
  }

  // STANDARD ONLINE VIEW
  return (
    <div className="p-8 pb-32 overflow-y-auto h-full bg-gradient-to-b from-zinc-900 to-black">
      
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
        {getGreeting()}
      </h2>

      {/* Dicas / CTAs Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
         {/* Tip 1: Create Playlist */}
         <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-green-500/50 transition group cursor-pointer">
            <div className="flex items-start justify-between mb-2">
               <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                  <Icon name="list" className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-2 py-1 rounded">Dica</span>
            </div>
            <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition">Vai dirigir o culto?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Crie uma playlist personalizada agora e organize os louvores da noite.</p>
         </div>

         {/* Tip 2: Share */}
         <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-green-500/50 transition group cursor-pointer">
            <div className="flex items-start justify-between mb-2">
               <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                  <Icon name="share" className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-2 py-1 rounded">Dica</span>
            </div>
            <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition">Evangelize no Zap</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Compartilhe a música que está tocando no grupo da família ou da igreja.</p>
         </div>

          {/* Tip 3: Offline */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-green-500/50 transition group cursor-pointer hidden lg:block">
            <div className="flex items-start justify-between mb-2">
               <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                  <Icon name="download" className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-2 py-1 rounded">Dica</span>
            </div>
            <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition">Vai pro monte?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Baixe suas músicas favoritas para ouvir onde não tem sinal de internet.</p>
         </div>
      </section>

      {/* Section: Destaques (Highlights) - Larger Cards */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-bold text-white">Destaques da Semana</h3>
           <button className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider">Ver Tudo</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map(song => (
            <div 
              key={song.id} 
              onClick={() => onPlay(song)}
              className="group relative bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition cursor-pointer flex"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative">
                 <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                     <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
                        <Icon name="play" className="ml-1 w-6 h-6" />
                     </button>
                 </div>
              </div>
              <div className="p-4 flex flex-col justify-center flex-1">
                  <div className="mb-2">
                     <span className="text-[10px] font-bold uppercase bg-green-900 text-green-400 px-2 py-1 rounded border border-green-800">Em Alta</span>
                  </div>
                  <h4 className="font-bold text-lg text-white mb-1 line-clamp-1">{song.title}</h4>
                  <p className="text-sm text-green-500 mb-2">{song.bibleReference}</p>
                  <p className="text-xs text-zinc-400 line-clamp-2">{song.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Lançamentos (New Releases) */}
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-white">Lançamentos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newReleases.map(song => (
            <div 
              key={song.id} 
              className="group bg-zinc-900/50 p-4 rounded-md hover:bg-zinc-800 transition cursor-pointer relative"
            >
              <div className="relative mb-3" onClick={() => onPlay(song)}>
                <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded shadow-md" />
                
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl shadow-sm">
                  NOVO
                </div>

                <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 z-10">
                  <Icon name="play" className="ml-1 w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-start">
                 <div className="overflow-hidden w-full" onClick={() => onPlay(song)}>
                    <h4 className="font-bold text-sm truncate text-white">{song.title}</h4>
                    <p className="text-xs text-zinc-400 font-medium truncate">{song.bibleReference}</p>
                 </div>
                 <button 
                  onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
                  className="text-zinc-500 hover:text-white p-1"
                  title="Adicionar à playlist"
                 >
                   <Icon name="plus" className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Tocadas Recentemente */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-white">Tocadas Recentemente</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recent.map(song => (
            <div 
              key={song.id} 
              className="group bg-zinc-900/30 p-3 rounded-md hover:bg-zinc-800 transition cursor-pointer"
              onClick={() => onPlay(song)}
            >
               <div className="relative mb-2">
                  <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded opacity-80 group-hover:opacity-100 transition" />
                  {downloadedSongs.has(song.id) && (
                    <div className="absolute top-1 right-1 bg-green-500 text-black p-0.5 rounded-full shadow-md" title="Baixado">
                       <Icon name="downloaded" className="w-3 h-3" />
                    </div>
                 )}
               </div>
               <h4 className="font-medium text-xs text-zinc-300 truncate group-hover:text-white">{song.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Footer (Kept for demo purposes) */}
      <section className="mt-12 py-8 border-t border-zinc-900">
        <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition text-xs text-zinc-500">
          <Icon name="lock" className="w-3 h-3" />
          <span>Protected by DRM • HLS Streaming • High Fidelity Audio</span>
        </div>
      </section>
    </div>
  );
};