
import React from 'react';
import { Song, Album, Playlist, User } from '../types';
import { Icon } from '../components/Icon';
import { APP_TEXT } from '../content';

interface HomeProps {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  onPlay: (song: Song) => void;
  onPlayWithLyrics: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  onOpenAlbum: (album: Album) => void; // New prop handler
  onTipAction: (action: 'create_playlist' | 'share' | 'offline') => void; // New prop handler
  isOffline: boolean;
  downloadedSongs: Set<string>;
  favoriteSongs: Set<string>;
  toggleFavorite: (songId: string) => void;
  user: User | null;
}

export const Home: React.FC<HomeProps> = ({ 
  songs, 
  albums, 
  playlists, 
  onPlay, 
  onPlayWithLyrics, 
  onAddToPlaylist, 
  onOpenAlbum,
  onTipAction,
  isOffline, 
  downloadedSongs,
  favoriteSongs,
  toggleFavorite,
  user
}) => {
  const t = APP_TEXT.home;
  const userFaith = user?.faith || 'evangelical';
  
  // Dynamic Text Logic
  const greeting = t.getGreeting(user?.faith, new Date().getHours());
  const tips = t.getTips(user?.faith);

  // Data Slicing
  const highlights = songs.slice(0, 6); 
  // Releases now use ALBUMS instead of SONGS
  const releases = albums; 
  const recent = songs.slice().reverse().slice(0, 8); 

  // FILTER LOGIC FOR OFFLINE MODE
  if (isOffline) {
    const offlineSongs = songs.filter(s => downloadedSongs.has(s.id));

    return (
      <div className="p-4 md:p-8 pb-32 overflow-y-auto h-full bg-black">
        <div className="mb-6 flex items-center justify-between bg-green-900/20 p-4 md:p-6 rounded-xl border border-green-900/50">
           <div>
              <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2 flex items-center gap-2">
                <Icon name="download" className="w-5 h-5 md:w-6 md:h-6" />
                {APP_TEXT.sidebar.offlineMode}
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm">Apenas músicas baixadas.</p>
           </div>
        </div>

        <section>
          <h3 className="text-lg md:text-xl font-bold mb-4 text-white">{t.sections.offline} ({offlineSongs.length})</h3>
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
    <div className="p-4 md:p-8 pb-32 overflow-y-auto h-full bg-gradient-to-b from-zinc-900 to-black scrollbar-hide">
      
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-white tracking-tight">
        {greeting}
      </h2>

      {/* Dicas / CTAs Banner - Clickable */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
         {/* Tip 1: Create Playlist */}
         <div 
          onClick={() => onTipAction('create_playlist')}
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 md:p-4 rounded-lg md:rounded-xl border border-zinc-800 hover:border-green-500 transition group cursor-pointer active:scale-95"
         >
            <div className="flex items-start justify-between mb-1 md:mb-2">
               <div className="bg-green-500/20 p-1.5 md:p-2 rounded-full text-green-500">
                  <Icon name="list" className="w-4 h-4 md:w-5 md:h-5" />
               </div>
               <span className="text-[9px] md:text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-1.5 md:px-2 py-0.5 md:py-1 rounded">{tips.playlist.tag}</span>
            </div>
            <h4 className="font-bold text-white text-xs md:text-base mb-0.5 md:mb-1 group-hover:text-green-400 transition">{tips.playlist.title}</h4>
            <p className="text-[10px] md:text-xs text-zinc-400 leading-relaxed hidden md:block">{tips.playlist.desc}</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed md:hidden">{tips.playlist.mobileDesc}</p>
         </div>

         {/* Tip 2: Share */}
         <div 
          onClick={() => onTipAction('share')}
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 md:p-4 rounded-lg md:rounded-xl border border-zinc-800 hover:border-green-500 transition group cursor-pointer active:scale-95"
         >
            <div className="flex items-start justify-between mb-1 md:mb-2">
               <div className="bg-green-500/20 p-1.5 md:p-2 rounded-full text-green-500">
                  <Icon name="share" className="w-4 h-4 md:w-5 md:h-5" />
               </div>
               <span className="text-[9px] md:text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-1.5 md:px-2 py-0.5 md:py-1 rounded">{tips.share.tag}</span>
            </div>
            <h4 className="font-bold text-white text-xs md:text-base mb-0.5 md:mb-1 group-hover:text-green-400 transition">{tips.share.title}</h4>
            <p className="text-[10px] md:text-xs text-zinc-400 leading-relaxed hidden md:block">{tips.share.desc}</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed md:hidden">{tips.share.mobileDesc}</p>
         </div>

          {/* Tip 3: Offline */}
          <div 
            onClick={() => onTipAction('offline')}
            className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 md:p-4 rounded-lg md:rounded-xl border border-zinc-800 hover:border-green-500 transition group cursor-pointer hidden lg:block active:scale-95"
          >
            <div className="flex items-start justify-between mb-2">
               <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                  <Icon name="download" className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-bold uppercase bg-zinc-950 text-zinc-500 px-2 py-1 rounded">{tips.offline.tag}</span>
            </div>
            <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition">{tips.offline.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{tips.offline.desc}</p>
         </div>
      </section>

      {/* Section: Destaques (Músicas) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
           <h3 className="text-lg md:text-xl font-bold text-white">{t.sections.highlights}</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {highlights.map(song => (
            <div 
              key={song.id} 
              onClick={() => onPlay(song)}
              className="group relative bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition cursor-pointer flex items-center md:items-stretch h-14 md:h-auto"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 relative">
                 <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                     <button className="w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 hidden md:flex">
                        <Icon name="play" className="ml-1 w-5 h-5 md:w-6 md:h-6" />
                     </button>
                 </div>
              </div>
              <div className="p-2 md:p-3 flex flex-col justify-center flex-1 min-w-0">
                  <h4 className="font-bold text-xs md:text-base text-white leading-tight truncate">{song.title}</h4>
                  <p className="text-[10px] md:text-xs text-green-500 truncate">{song.bibleReference}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Lançamentos (ALBUNS) */}
      <section className="mb-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">{t.sections.releases}</h3>
        
        {/* Horizontal Scroll ALBUMS - Scrollbar Hidden */}
        <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide snap-x">
          {releases.map(album => (
            <div 
              key={album.id} 
              onClick={() => onOpenAlbum(album)}
              className="flex-none w-36 md:w-48 group bg-transparent md:bg-zinc-900/50 p-0 md:p-4 rounded-md hover:bg-zinc-800 transition cursor-pointer relative snap-start"
            >
              <div className="relative mb-2">
                <img src={album.coverUrl} alt={album.title} className="w-full aspect-square object-cover rounded shadow-md" />
                
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-bl shadow-sm">
                  NOVO
                </div>
              </div>
              
              <div className="overflow-hidden w-full">
                 <h4 className="font-bold text-xs md:text-sm truncate text-white leading-tight mb-0.5">{album.title}</h4>
                 <p className="text-[10px] md:text-xs text-zinc-400 font-medium truncate">Álbum • {album.songs.length} faixas</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Tocadas Recentemente - Scrollbar Hidden */}
      <section className="mb-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">{t.sections.recent}</h3>
        
        <div className="flex overflow-x-auto pb-4 gap-3 -mx-4 px-4 scrollbar-hide snap-x">
          {recent.map(song => (
            <div 
              key={song.id} 
              className="flex-none w-24 md:w-32 group transition cursor-pointer snap-start"
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
               <h4 className="font-medium text-[10px] md:text-xs text-zinc-300 truncate group-hover:text-white">{song.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Footer */}
      <section className="mt-8 md:mt-12 py-6 md:py-8 border-t border-zinc-900">
        <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition text-[10px] md:text-xs text-zinc-500">
          <Icon name="lock" className="w-3 h-3" />
          <span>{APP_TEXT.general.footer}</span>
        </div>
      </section>
    </div>
  );
};
