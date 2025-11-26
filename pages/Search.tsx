
import React, { useState } from 'react';
import { Song } from '../types';
import { Icon } from '../components/Icon';

interface SearchProps {
  songs: Song[];
  onPlay: (song: Song) => void;
  onPlayWithLyrics: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  isOffline: boolean;
  favoriteSongs: Set<string>;
  toggleFavorite: (songId: string) => void;
}

export const Search: React.FC<SearchProps> = ({ songs, onPlay, onPlayWithLyrics, onAddToPlaylist, isOffline, favoriteSongs, toggleFavorite }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Song[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    // Simulating a small delay for UX (optional)
    setTimeout(() => {
        // Filter by title, bible reference, OR DESCRIPTION
        const basicResults = songs.filter(s => 
          s.title.toLowerCase().includes(query.toLowerCase()) || 
          s.bibleReference.toLowerCase().includes(query.toLowerCase()) ||
          (s.description && s.description.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(basicResults);
        setIsLoading(false);
    }, 300);
  };

  if (isOffline) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-8 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Icon name="search" className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Você está Offline</h2>
        <p className="text-zinc-400 max-w-md mb-8">
          A busca funciona apenas na sua biblioteca local no modo offline. Vá para "Sua Biblioteca" para ver o que você baixou.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32 h-full overflow-y-auto bg-gradient-to-b from-zinc-900 to-black">
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">O que você quer ouvir?</h2>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
          <input
            type="text"
            placeholder="Busque por título, versículo ou tema..."
            className="w-full bg-white text-black rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-green-500 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
             type="submit"
             disabled={isLoading}
             className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Results List */}
        <div className="space-y-2">
          {results.length > 0 ? (
            results.map((song, index) => (
              <div 
                key={song.id} 
                onClick={() => onPlay(song)}
                className="flex items-center p-3 rounded-md hover:bg-white/10 group cursor-pointer transition"
              >
                <span className="w-8 text-center text-zinc-500 mr-4 group-hover:hidden">{index + 1}</span>
                <button className="w-8 mr-4 hidden group-hover:block text-white">
                  <Icon name="play" className="w-5 h-5 mx-auto" />
                </button>
                
                <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded mr-4 object-cover" />
                
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    {song.isEncrypted && <Icon name="lock" className="w-3 h-3 text-green-500" />}
                  </div>
                  <p className="text-sm text-green-600 font-medium truncate">{song.bibleReference}</p>
                  <p className="text-xs text-zinc-400 truncate">{song.description}</p>
                </div>
                
                <div className="hidden md:block text-sm text-zinc-500 mr-8">{song.album}</div>
                
                <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                      className={`p-2 ${favoriteSongs.has(song.id) ? 'text-green-500' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <Icon name={favoriteSongs.has(song.id) ? "heart-filled" : "heart"} className="w-5 h-5" />
                    </button>

                    {song.lyrics && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onPlayWithLyrics(song); }}
                            className="text-zinc-500 hover:text-white p-2"
                            title="Ver Letra"
                        >
                            <Icon name="mic" className="w-5 h-5" />
                        </button>
                    )}
                    <button 
                    onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
                    className="text-zinc-500 hover:text-white p-2 mr-4"
                    title="Adicionar à playlist"
                    >
                    <Icon name="plus" className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-sm text-zinc-500 whitespace-nowrap">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</div>
              </div>
            ))
          ) : (
            !isLoading && hasSearched && (
              <div className="text-center text-zinc-500 mt-10 py-10 bg-zinc-900/30 rounded-lg border border-zinc-800 border-dashed">
                 <Icon name="search" className="w-12 h-12 mx-auto mb-2 text-zinc-600" />
                 <p className="font-medium">Nenhum louvor encontrado para "{query}".</p>
                 <p className="text-xs mt-1">Tente buscar pelo livro da Bíblia ou parte do título.</p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};