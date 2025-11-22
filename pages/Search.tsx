
import React, { useState } from 'react';
import { getRecommendations } from '../services/geminiService';
import { Song } from '../types';
import { Icon } from '../components/Icon';

interface SearchProps {
  songs: Song[];
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  isOffline: boolean;
}

export const Search: React.FC<SearchProps> = ({ songs, onPlay, onAddToPlaylist, isOffline }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [results, setResults] = useState<Song[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAiMessage(null);
    
    // Filter by title, bible reference, OR DESCRIPTION
    const basicResults = songs.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.bibleReference.toLowerCase().includes(query.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(query.toLowerCase()))
    );
    setResults(basicResults);

    // Then ask AI for semantic recommendations
    try {
      const aiResponse = await getRecommendations(query);
      setAiMessage(aiResponse.message);
      
      // Map IDs back to full song objects from the DYNAMIC list
      const aiSongs = aiResponse.songIds
        .map(id => songs.find(s => s.id === id))
        .filter((s): s is Song => !!s);
      
      // Merge results, removing duplicates
      const uniqueIds = new Set(basicResults.map(s => s.id));
      const newSongs = aiSongs.filter(s => !uniqueIds.has(s.id));
      setResults(prev => [...prev, ...newSongs]);

    } catch (err) {
      console.error("Erro no DJ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isOffline) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-8 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Icon name="search" className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Você está Offline</h2>
        <p className="text-zinc-400 max-w-md mb-8">
          O DJ AI precisa de internet para funcionar. Desative o modo offline para buscar novas modas.
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
            placeholder="Busque por versículo, tema ou peça uma recomendação..."
            className="w-full bg-white text-black rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-green-500 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
             type="submit"
             disabled={isLoading}
             className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Pensando...' : 'Buscar'}
          </button>
        </form>

        {/* AI Message Bubble */}
        {aiMessage && (
          <div className="mb-8 flex gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
               <Icon name="sparkles" className="text-white w-6 h-6" />
            </div>
            <div className="bg-zinc-800 p-4 rounded-r-xl rounded-bl-xl border border-zinc-700">
              <p className="text-green-400 font-bold text-xs mb-1 uppercase tracking-wider">DJ Bíblia Sertaneja</p>
              <p className="text-zinc-200">{aiMessage}</p>
            </div>
          </div>
        )}

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
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
                  className="text-zinc-500 hover:text-white p-2 mr-4"
                  title="Adicionar à playlist"
                >
                  <Icon name="plus" className="w-5 h-5" />
                </button>
                <div className="text-sm text-zinc-500 whitespace-nowrap">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</div>
              </div>
            ))
          ) : (
            !isLoading && query && <div className="text-center text-zinc-500 mt-10">Nenhum louvor encontrado.</div>
          )}
        </div>

      </div>
    </div>
  );
};
