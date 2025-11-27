
import React, { useState, useRef, useEffect } from 'react';
import { PlaybackState, Song, Playlist, Album, User } from './types';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
// Admin import removed
import { Welcome } from './pages/Welcome';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Pricing } from './pages/Pricing'; // New Import
import { SONGS, INITIAL_PLAYLISTS, ALBUMS } from './constants';
import { Icon } from './components/Icon';
import { Logo } from './components/Logo';
import { APP_TEXT } from './content';

// Guest Preview Limit in Seconds
const PREVIEW_DURATION = 30;

export default function App() {
  // --- AUTHENTICATION STATE ---
  const [authView, setAuthView] = useState<'welcome' | 'login' | 'app'>('welcome');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);

  // --- CONTENT STATE ---
  const [allSongs, setAllSongs] = useState<Song[]>(SONGS);
  const [allAlbums, setAllAlbums] = useState<Album[]>(ALBUMS);
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(PlaybackState.PAUSED);
  const [activeTab, setActiveTab] = useState('home');
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  
  // Lyrics State (Global)
  const [showLyrics, setShowLyrics] = useState(false);
  
  // Playlist State
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);

  // Album Navigation State
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);

  // Offline Logic Simulation
  const [downloadedSongs, setDownloadedSongs] = useState<Set<string>>(new Set());
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Favorites Logic
  const [favoriteSongs, setFavoriteSongs] = useState<Set<string>>(new Set());

  // Upsell Modal (For Guests)
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellType, setUpsellType] = useState<'generic' | 'preview'>('generic');

  const audioRef = useRef<HTMLAudioElement>(null);

  // --- AUTH HANDLERS ---
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthView('app');
  };

  const handleGuestAccess = () => {
    setUser(null);
    setAuthView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('welcome');
    setCurrentSong(null);
    setPlaybackState(PlaybackState.PAUSED);
    setIsOfflineMode(false);
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // --- RESTRICTION HANDLERS ---
  const requireUser = (action: () => void) => {
    if (!user) {
      setUpsellType('generic');
      setShowUpsell(true);
    } else {
      action();
    }
  };

  // --- NAVIGATION HANDLERS ---
  const handleOpenAlbum = (album: Album) => {
    setViewingAlbum(album);
    setActiveTab('library');
  };

  const handleTipAction = (action: 'create_playlist' | 'share' | 'offline') => {
    switch(action) {
      case 'create_playlist':
        if(user) {
          setActiveTab('library');
          createPlaylist();
        } else {
          setUpsellType('generic');
          setShowUpsell(true);
        }
        break;
      case 'share':
        const text = `Baixe o app *Bíblia Sertaneja* e ouça os melhores louvores! 🤠🙏\nhttps://bibliasertaneja.app`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        break;
      case 'offline':
        if(user) {
          setIsOfflineMode(!isOfflineMode);
        } else {
          setUpsellType('generic');
          setShowUpsell(true);
        }
        break;
    }
  };


  // --- PLAYER LOGIC ---
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

  const handlePlayWithLyrics = (song: Song) => {
    handlePlaySong(song);
    if (song.lyrics) {
      setShowLyrics(true);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if(playlist.songs.length > 0) {
      const firstSong = allSongs.find(s => s.id === playlist.songs[0]);
      
      if (isOfflineMode) {
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
    
    // Check if guest is trying to resume past limit
    if (!user && progress >= PREVIEW_DURATION) {
      setUpsellType('preview');
      setShowUpsell(true);
      return;
    }

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
    if (currentIndex === -1) return;
    
    let nextIndex = (currentIndex + 1) % allSongs.length;
    let loopCount = 0;

    if (isOfflineMode) {
      while (!downloadedSongs.has(allSongs[nextIndex].id) && loopCount < allSongs.length) {
        nextIndex = (nextIndex + 1) % allSongs.length;
        loopCount++;
      }
      if (loopCount >= allSongs.length) return;
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
    requireUser(() => {
      setDownloadedSongs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(songId)) {
          newSet.delete(songId);
        } else {
          newSet.add(songId);
        }
        return newSet;
      });
    });
  };

  const toggleFavorite = (songId: string) => {
    // We allow guests to "favorite" for the session, but it won't persist (in a real app)
    // For upsell effect, let's block it or allow it. Let's allow it as a "taste".
    setFavoriteSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  // --- PLAYLIST LOGIC ---
  const openAddToPlaylistModal = (song: Song) => {
    requireUser(() => {
      setSongToAddToPlaylist(song);
      setShowPlaylistModal(true);
    });
  };

  const createPlaylist = () => {
    if (!user) {
      setUpsellType('generic');
      setShowUpsell(true);
      return null;
    }
    const newPlaylist: Playlist = {
      id: `user-p${Date.now()}`,
      title: `Minha Playlist #${playlists.filter(p => p.isUserCreated).length + 1}`,
      description: "Minha coleção de modas",
      coverUrl: "https://picsum.photos/300/300?grayscale",
      songs: [],
      isUserCreated: true
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const addSongToPlaylist = (playlistId: string) => {
    if (!songToAddToPlaylist) return;
    
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.songs.includes(songToAddToPlaylist.id)) return p;
        return { ...p, songs: [...p.songs, songToAddToPlaylist.id] };
      }
      return p;
    }));
    setShowPlaylistModal(false);
    setSongToAddToPlaylist(null);
  };

  // --- EFFECTS ---
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

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        
        // GUEST PREVIEW LIMIT LOGIC
        if (!user && current >= PREVIEW_DURATION) {
          audioRef.current.pause();
          setPlaybackState(PlaybackState.PAUSED);
          setUpsellType('preview');
          setShowUpsell(true);
          setProgress(PREVIEW_DURATION);
          return;
        }

        setProgress(current);
      }
    };
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [user]); // Re-create interval if user logs in to remove limit check

  const handleSeek = (val: number) => {
    // Prevent seeking past limit for guests
    if (!user && val > PREVIEW_DURATION) {
       setUpsellType('preview');
       setShowUpsell(true);
       return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  // --- RENDER VIEWS ---

  if (authView === 'welcome') {
    return (
      <Welcome 
        onLogin={() => {
          setAuthInitialMode('login');
          setAuthView('login');
        }}
        onRegister={() => {
          setAuthInitialMode('register');
          setAuthView('login'); // Reuses auth component but sets mode
        }}
        onGuest={handleGuestAccess} 
      />
    );
  }

  if (authView === 'login') {
    return (
      <Auth 
        initialMode={authInitialMode}
        onSuccess={handleLoginSuccess} 
        onBack={() => setAuthView('welcome')} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Audio Engine */}
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
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'library') setViewingAlbum(null); // Clear album view when leaving library
        }} 
        isOffline={isOfflineMode}
        toggleOffline={() => setIsOfflineMode(!isOfflineMode)}
        user={user}
        onLoginRequest={() => { setAuthInitialMode('register'); setAuthView('login'); }}
        onLogout={handleLogout}
        onCreatePlaylist={() => { requireUser(createPlaylist); setActiveTab('library'); }}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-black/90 backdrop-blur-md z-40 p-4 flex justify-between items-center border-b border-zinc-900">
         <Logo size="sm" />
         {user ? (
            <button 
              onClick={() => setActiveTab('profile')} 
              className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700"
            >
                <img src={user.avatarUrl} className="w-full h-full object-cover" />
            </button>
         ) : (
            <button onClick={() => { setAuthInitialMode('login'); setAuthView('login'); }} className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-full">
                Entrar
            </button>
         )}
      </div>

      {/* Main Content */}
      <main className="flex-1 relative pt-16 md:pt-0 pb-20 md:pb-0 h-full overflow-hidden">
        {activeTab === 'home' && (
          <Home 
            songs={allSongs}
            albums={allAlbums}
            playlists={playlists}
            onPlay={handlePlaySong}
            onPlayWithLyrics={handlePlayWithLyrics} 
            onAddToPlaylist={openAddToPlaylistModal}
            onOpenAlbum={handleOpenAlbum}
            onTipAction={handleTipAction}
            isOffline={isOfflineMode}
            downloadedSongs={downloadedSongs}
            favoriteSongs={favoriteSongs}
            toggleFavorite={toggleFavorite}
            user={user}
          />
        )}
        {activeTab === 'search' && (
          <Search 
            songs={allSongs}
            onPlay={handlePlaySong} 
            onPlayWithLyrics={handlePlayWithLyrics}
            onAddToPlaylist={openAddToPlaylistModal}
            isOffline={isOfflineMode}
            favoriteSongs={favoriteSongs}
            toggleFavorite={toggleFavorite}
          />
        )}
        {activeTab === 'library' && (
          <Library 
            songs={allSongs}
            playlists={playlists} 
            selectedAlbum={viewingAlbum}
            onClearSelectedAlbum={() => setViewingAlbum(null)}
            onPlayPlaylist={handlePlayPlaylist}
            onPlayWithLyrics={handlePlayWithLyrics}
            onCreatePlaylist={() => createPlaylist()}
            onDeletePlaylist={deletePlaylist}
            isOffline={isOfflineMode}
            downloadedSongs={downloadedSongs}
            favoriteSongs={favoriteSongs}
            toggleFavorite={toggleFavorite}
          />
        )}
        {activeTab === 'profile' && user && (
            <Profile 
                user={user} 
                onLogout={handleLogout}
                onNavigateToPricing={() => setActiveTab('pricing')}
                onUpdateUser={handleUpdateUser}
            />
        )}
        {activeTab === 'pricing' && (
            <Pricing onBack={() => setActiveTab('profile')} />
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
        showLyrics={showLyrics}
        toggleLyrics={() => setShowLyrics(!showLyrics)}
        favoriteSongs={favoriteSongs}
        toggleFavorite={toggleFavorite}
      />

      {/* Bottom Nav */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'library') setViewingAlbum(null);
        }} 
        user={user}
        onCreatePlaylist={() => { requireUser(createPlaylist); setActiveTab('library'); }}
      />

      {/* UPSELL MODAL (For Guests) */}
      {showUpsell && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-zinc-900 border border-green-500/30 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
              
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Icon name={upsellType === 'preview' ? 'music' : 'sparkles'} className="w-8 h-8 text-green-500" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {upsellType === 'preview' ? APP_TEXT.upsell.preview.title : APP_TEXT.upsell.title}
              </h3>
              <p className="text-zinc-400 mb-8">
                {upsellType === 'preview' ? APP_TEXT.upsell.preview.description : APP_TEXT.upsell.description}
              </p>

              <button 
                onClick={() => { setShowUpsell(false); setAuthInitialMode('register'); setAuthView('login'); }}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full mb-3 transition"
              >
                {upsellType === 'preview' ? APP_TEXT.upsell.preview.cta : APP_TEXT.upsell.cta}
              </button>
              
              <button 
                onClick={() => setShowUpsell(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                {APP_TEXT.upsell.secondary}
              </button>
           </div>
        </div>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && songToAddToPlaylist && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md border border-zinc-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">Adicionar à Playlist</h3>
                 <button onClick={() => setShowPlaylistModal(false)} className="text-zinc-400 hover:text-white"><Icon name="close" /></button>
              </div>
              
              <div className="flex items-center gap-3 mb-6 bg-zinc-800 p-2 rounded">
                 <img src={songToAddToPlaylist.coverUrl} className="w-12 h-12 rounded object-cover" />
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{songToAddToPlaylist.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{songToAddToPlaylist.bibleReference}</p>
                 </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-4 scrollbar-hide">
                 {playlists.filter(p => p.isUserCreated).map(p => (
                   <button 
                    key={p.id}
                    onClick={() => addSongToPlaylist(p.id)}
                    className="w-full text-left px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded flex items-center justify-between group transition"
                   >
                      <span className="font-medium text-sm text-zinc-200">{p.title}</span>
                      {p.songs.includes(songToAddToPlaylist.id) && <Icon name="check" className="w-4 h-4 text-green-500" />}
                   </button>
                 ))}
              </div>
              
              <button 
                onClick={() => {
                  const newP = createPlaylist();
                  if (newP) addSongToPlaylist(newP.id);
                }}
                className="w-full py-3 border border-zinc-700 rounded text-sm font-bold hover:bg-zinc-800 transition text-green-500"
              >
                + Nova Playlist
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
