import React, { useState, useRef, useEffect } from 'react';
import { PlaybackState, Song, Playlist, Album } from './types';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { Admin } from './pages/Admin';
import { SONGS, INITIAL_PLAYLISTS, ALBUMS } from './constants';
import { Icon } from './components/Icon';

export default function App() {
  // Centralized Content State (Mutable by Admin)
  const [allSongs, setAllSongs] = useState<Song[]>(SONGS);
  const [allAlbums, setAllAlbums] = useState<Album[]>(ALBUMS);
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(PlaybackState.PAUSED);
  const [activeTab, setActiveTab] = useState('home');
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  
  // Playlist State
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);

  // Offline Logic Simulation
  const [downloadedSongs, setDownloadedSongs] = useState<Set<string>>(new Set());
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle Song Selection
  const handlePlaySong = (song: Song) => {
    if (isOfflineMode && !downloadedSongs.has(song.id)) {
      alert("Esta música não está baixada. Conecte-se à internet para ouvir.");
      return;
    }

    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setPlaybackState(PlaybackState.PLAYING);
      setProgress(0);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if(playlist.songs.length > 0) {
      // Find first available song using current state
      const firstSong = allSongs.find(s => s.id === playlist.songs[0]);
      
      if (isOfflineMode) {
        // Play first DOWNLOADED song in playlist
        const firstDownloadedId = playlist.songs.find(id => downloadedSongs.has(id));
        const playObj = allSongs.find(s => s.id === firstDownloadedId);
        if (playObj) handlePlaySong(playObj);
      } else {
        if(firstSong) handlePlaySong(firstSong);
      }
    }
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (playbackState === PlaybackState.PLAYING) {
      setPlaybackState(PlaybackState.PAUSED);
      audioRef.current?.pause();
    } else {
      setPlaybackState(PlaybackState.PLAYING);
      audioRef.current?.play();
    }
  };

  const nextSong = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) return; // Song deleted or not found
    
    // Find next valid song based on offline mode
    let nextIndex = (currentIndex + 1) % allSongs.length;
    let loopCount = 0;

    if (isOfflineMode) {
      while (!downloadedSongs.has(allSongs[nextIndex].id) && loopCount < allSongs.length) {
        nextIndex = (nextIndex + 1) % allSongs.length;
        loopCount++;
      }
      if (loopCount >= allSongs.length) return; // No downloaded songs
    }

    handlePlaySong(allSongs[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    handlePlaySong(allSongs[prevIndex]);
  };

  const toggleDownload = (songId: string) => {
    setDownloadedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  // Playlist Management Logic
  const openAddToPlaylistModal = (song: Song) => {
    setSongToAddToPlaylist(song);
    setShowPlaylistModal(true);
  };

  const createPlaylist = () => {
    const newPlaylist: Playlist = {
      id: `user-p${Date.now()}`,
      title: `Minha Playlist #${playlists.filter(p => p.isUserCreated).length + 1}`,
      description: "Minha coleção de modas",
      coverUrl: "https://picsum.photos/300/300?grayscale",
      songs: [],
      isUserCreated: true
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist; // Return for immediate use if needed
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const addSongToPlaylist = (playlistId: string) => {
    if (!songToAddToPlaylist) return;
    
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        // Prevent duplicates
        if (p.songs.includes(songToAddToPlaylist.id)) return p;
        return { ...p, songs: [...p.songs, songToAddToPlaylist.id] };
      }
      return p;
    }));
    setShowPlaylistModal(false);
    setSongToAddToPlaylist(null);
  };

  // Audio Element Management
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (playbackState === PlaybackState.PLAYING) {
        audioRef.current.play().catch(e => console.warn("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, playbackState]);

  // Progress Loop
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };
    
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSeek = (val: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Audio Element (Simulating HLS secure playback) */}
      {currentSong && (
        <audio 
          ref={audioRef} 
          src={currentSong.audioUrl}
          onEnded={nextSong}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOffline={isOfflineMode}
        toggleOffline={() => setIsOfflineMode(!isOfflineMode)}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-black z-40 p-4 flex justify-between items-center border-b border-zinc-900">
         <h1 className="text-xl font-bold text-green-500">Bíblia Sertaneja</h1>
         <button onClick={() => setIsOfflineMode(!isOfflineMode)} className={`${isOfflineMode ? 'text-green-500' : 'text-zinc-500'}`}>
            <Icon name="download" />
         </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative pt-14 md:pt-0">
        {activeTab === 'home' && (
          <Home 
            songs={allSongs}
            albums={allAlbums}
            playlists={playlists}
            onPlay={handlePlaySong} 
            onAddToPlaylist={openAddToPlaylistModal}
            isOffline={isOfflineMode}
            downloadedSongs={downloadedSongs}
          />
        )}
        {activeTab === 'search' && (
          <Search 
            songs={allSongs}
            onPlay={handlePlaySong} 
            onAddToPlaylist={openAddToPlaylistModal}
            isOffline={isOfflineMode}
          />
        )}
        {activeTab === 'library' && (
          <Library 
            songs={allSongs}
            playlists={playlists} 
            onPlayPlaylist={handlePlayPlaylist}
            onCreatePlaylist={createPlaylist}
            onDeletePlaylist={deletePlaylist}
            isOffline={isOfflineMode}
            downloadedSongs={downloadedSongs}
          />
        )}
        {activeTab === 'admin' && (
          <Admin 
            songs={allSongs}
            setSongs={setAllSongs}
            albums={allAlbums}
            setAlbums={setAllAlbums}
          />
        )}
      </main>

      {/* Player */}
      <Player 
        currentSong={currentSong}
        playbackState={playbackState}
        playSong={handlePlaySong}
        togglePlay={togglePlay}
        nextSong={nextSong}
        prevSong={prevSong}
        volume={volume}
        setVolume={setVolume}
        progress={progress}
        setProgress={handleSeek}
        isOffline={isOfflineMode}
        toggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
        downloadedSongs={downloadedSongs}
        toggleDownload={toggleDownload}
      />

      {/* Playlist Modal */}
      {showPlaylistModal && songToAddToPlaylist && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
           <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md border border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">Adicionar à Playlist</h3>
                 <button onClick={() => setShowPlaylistModal(false)} className="text-zinc-400 hover:text-white"><Icon name="close" /></button>
              </div>
              
              <div className="flex items-center gap-3 mb-6 bg-zinc-800 p-2 rounded">
                 <img src={songToAddToPlaylist.coverUrl} className="w-12 h-12 rounded" />
                 <div>
                    <p className="text-sm font-bold">{songToAddToPlaylist.title}</p>
                    <p className="text-xs text-zinc-400">{songToAddToPlaylist.artist}</p>
                 </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                 {playlists.map(p => (
                   <button 
                    key={p.id}
                    onClick={() => addSongToPlaylist(p.id)}
                    className="w-full text-left px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded flex items-center justify-between group"
                   >
                      <span className="font-medium text-sm">{p.title}</span>
                      {p.songs.includes(songToAddToPlaylist.id) && <Icon name="check" className="w-4 h-4 text-green-500" />}
                   </button>
                 ))}
              </div>
              
              <button 
                onClick={() => {
                  const newP = createPlaylist();
                  addSongToPlaylist(newP.id);
                }}
                className="w-full py-3 border border-zinc-700 rounded text-sm font-bold hover:bg-zinc-800 transition"
              >
                Nova Playlist
              </button>
           </div>
        </div>
      )}
    </div>
  );
}