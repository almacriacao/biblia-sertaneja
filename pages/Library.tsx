
import React, { useState } from 'react';
import { Playlist, Song } from '../types';
import { Icon } from '../components/Icon';

interface LibraryProps {
  songs: Song[];
  playlists: Playlist[];
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayWithLyrics: (song: Song) => void;
  onCreatePlaylist: () => void;
  onDeletePlaylist: (id: string) => void;
  isOffline: boolean;
  downloadedSongs: Set<string>;
}

export const Library: React.FC<LibraryProps> = ({ songs: allSongs, playlists, onPlayPlaylist, onPlayWithLyrics, onCreatePlaylist, onDeletePlaylist, isOffline, downloadedSongs }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Helper to get full song details from IDs
  const getPlaylistSongs = (playlist: Playlist) => {
    return playlist.songs.map(id => allSongs.find(s => s.id === id)).filter((s): s is Song => !!s);
  };

  // In offline mode, check if a playlist has ANY downloaded songs
  const isPlaylistAvailableOffline = (playlist: Playlist) => {
    return playlist.songs.some(id => downloadedSongs.has(id));
  };

  const renderPlaylistView = (playlist: Playlist) => {
    const songs = getPlaylistSongs(playlist);
    
    return (
      <div className="h-full overflow-y-auto pb-32">
         <div className="p-8 bg-gradient-to-b from-zinc-800 to-black flex flex-col md:flex-row gap-8 items-end">
            <img src={playlist.coverUrl} alt={playlist.title} className="w-52 h-52 shadow-2xl shadow-black" />
            <div className="flex-1">
               <p className="text-xs font-bold uppercase text-white mb-2">Playlist {playlist.isUserCreated ? 'Pessoal' : 'Oficial'}</p>
               <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{playlist.title}</h1>
               <p className="text-zinc-400 mb-4 text-sm">{playlist.description}</p>
               <p className="text-white font-bold text-sm">Bíblia Sertaneja • {songs.length} músicas</p>
            </div>
         </div>

         <div className="p-8 bg-black/20">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onPlayPlaylist(playlist)} 
                    className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition"
                  >
                     <Icon name="play" className="w-7 h-7 ml-1" />
                  </button>
                  <button onClick={() => setSelectedPlaylist(null)} className="text-zinc-400 hover:text-white">
                    <span className="text-sm font-bold border border-zinc-600 px-4 py-2 rounded-full hover:border-white transition">Voltar</span>
                  </button>
               </div>
               {playlist.isUserCreated && (
                 <button onClick={() => { onDeletePlaylist(playlist.id); setSelectedPlaylist(null); }} className="text-zinc-500 hover:text-red-500" title="Apagar Playlist">
                    <Icon name="trash" className="w-6 h-6" />
                 </button>
               )}
            </div>

            <table className="w-full text-left text-sm text-zinc-400">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3 w-8">#</th>
                  <th className="pb-3">Título</th>
                  <th className="pb-3 hidden md:table-cell">Ref. Bíblica</th>
                  <th className="pb-3 text-right"><Icon name="play" className="w-4 h-4 inline" /></th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, idx) => {
                  const isAvailable = !isOffline || downloadedSongs.has(song.id);
                  
                  return (
                    <tr 
                      key={song.id} 
                      className={`group rounded transition ${isAvailable ? 'hover:bg-white/10' : 'opacity-40 cursor-not-allowed'}`}
                    >
                      <td className="py-3 px-2 text-center">
                        {isAvailable ? (
                            <>
                                <span className="group-hover:hidden">{idx + 1}</span>
                                <Icon name="play" className="w-3 h-3 text-white hidden group-hover:block mx-auto" />
                            </>
                        ) : (
                            <span className="text-xs">N/A</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={song.coverUrl} className="w-10 h-10 grayscale-0 object-cover" />
                          <div>
                            <p className={`font-medium text-base ${isAvailable ? 'text-white' : 'text-zinc-500'}`}>{song.title}</p>
                            <p className="text-green-600/80">{song.bibleReference}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden md:table-cell text-zinc-500">{song.bibleReference}</td>
                      <td className="py-3 text-right font-mono pr-2">
                         <div className="flex items-center justify-end gap-3">
                            {song.lyrics && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onPlayWithLyrics(song); }}
                                    className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                                    title="Ver Letra"
                                >
                                    <Icon name="mic" className="w-4 h-4" />
                                </button>
                            )}
                            {downloadedSongs.has(song.id) && <Icon name="downloaded" className="w-4 h-4 text-green-500 inline" />}
                            <span>{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</span>
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {songs.length === 0 && (
               <div className="text-center py-20 text-zinc-500">
                  <p>Essa playlist está vazia, companheiro.</p>
               </div>
            )}
         </div>
      </div>
    );
  };

  if (selectedPlaylist) {
    return renderPlaylistView(selectedPlaylist);
  }

  // Filter playlists for offline mode
  const displayedPlaylists = isOffline 
    ? playlists.filter(p => isPlaylistAvailableOffline(p))
    : playlists;

  return (
    <div className="p-8 pb-32 overflow-y-auto h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-3xl font-bold flex items-center gap-3">
           Sua Biblioteca
           {isOffline && <span className="text-xs bg-green-900 text-green-400 border border-green-700 px-2 py-0.5 rounded">OFFLINE</span>}
         </h2>
         
         {!isOffline && (
           <button 
              onClick={onCreatePlaylist}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition"
           >
              <Icon name="plus" className="w-5 h-5" />
              Criar Playlist
           </button>
         )}
      </div>

      {displayedPlaylists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayedPlaylists.map(playlist => (
            <div 
              key={playlist.id} 
              onClick={() => setSelectedPlaylist(playlist)}
              className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800 transition cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                    src={playlist.coverUrl} 
                    className={`w-full aspect-square object-cover rounded-md shadow-lg ${playlist.isUserCreated ? 'opacity-80' : ''}`} 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded-md flex items-center justify-center">
                    <Icon name="play" className="w-12 h-12 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300" />
                </div>
                {isOffline && (
                  <div className="absolute bottom-2 right-2 bg-green-500 p-1 rounded-full">
                    <Icon name="downloaded" className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-white mb-1 truncate">{playlist.title}</h3>
              <p className="text-sm text-zinc-500">{playlist.isUserCreated ? `Por Você` : 'Bíblia Sertaneja'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <Icon name="library" className="w-16 h-16 mb-4 opacity-20" />
          {isOffline ? (
             <>
               <p className="text-lg font-medium">Nada disponível offline</p>
               <p className="text-sm">Baixe músicas para ver elas aqui quando estiver sem internet.</p>
             </>
          ) : (
             <p>Sua biblioteca está vazia.</p>
          )}
        </div>
      )}
    </div>
  );
};