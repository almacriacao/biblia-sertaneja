
import React, { useState } from 'react';
import { PlayerContextType, PlaybackState } from '../types';
import { Icon } from './Icon';

interface PlayerProps extends PlayerContextType {}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  playbackState,
  togglePlay,
  nextSong,
  prevSong,
  volume,
  setVolume,
  progress,
  setProgress,
  downloadedSongs,
  toggleDownload,
  showLyrics,
  toggleLyrics
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  const isPlaying = playbackState === PlaybackState.PLAYING;
  const isDownloaded = downloadedSongs.has(currentSong.id);
  const hasLyrics = !!currentSong.lyrics;

  const handleShare = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentSong) return;
    const text = `🤠 Estou ouvindo *${currentSong.title}* (${currentSong.bibleReference}) no app *Bíblia Sertaneja*! 🎵\n\nBaixe agora e escute: https://bibliasertaneja.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleToggleExpand = () => {
    // Only expand on mobile widths roughly
    if (window.innerWidth < 768) {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Full Screen Expanded Player (Mobile) */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-zinc-900 flex flex-col text-white animate-in slide-in-from-bottom duration-300">
           {/* Background gradient mesh simulation */}
           <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black pointer-events-none" />
           
           {/* Header */}
           <div className="relative z-10 flex items-center justify-between p-6 pt-12"> 
              <button onClick={() => setIsExpanded(false)} className="text-zinc-100">
                 <Icon name="chevron-down" className="w-8 h-8" />
              </button>
              <div className="text-center">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Tocando Agora</span>
                 <p className="text-xs font-bold truncate max-w-[200px]">{currentSong.album}</p>
              </div>
              <button className="text-zinc-400 hover:text-white">
                  <Icon name="settings" className="w-6 h-6" />
              </button>
           </div>

           {/* Album Art */}
           <div className="relative z-10 flex-1 flex items-center justify-center p-8">
              <img src={currentSong.coverUrl} className="w-full aspect-square object-cover rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
           </div>

           {/* Info & Main Controls */}
           <div className="relative z-10 px-8 pb-12">
              <div className="flex justify-between items-end mb-8">
                 <div>
                    <h2 className="text-2xl font-bold text-white leading-tight mb-1">{currentSong.title}</h2>
                    <p className="text-lg text-green-500 font-medium">{currentSong.bibleReference}</p>
                 </div>
                 <button onClick={toggleDownload(currentSong.id)} className={`${isDownloaded ? 'text-green-500' : 'text-zinc-400'} p-2`}>
                    <Icon name={isDownloaded ? "downloaded" : "download"} className="w-8 h-8" />
                 </button>
              </div>

              {/* Progress */}
              <div className="mb-8 group">
                <input 
                    type="range" 
                    min={0} 
                    max={currentSong.duration} 
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition"
                  />
                 <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(currentSong.duration)}</span>
                 </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center mb-10">
                 <button className="text-zinc-400 hover:text-white"><Icon name="shuffle" className="w-6 h-6" /></button>
                 
                 <button onClick={prevSong} className="text-white hover:scale-110 transition">
                   <Icon name="prev" className="w-10 h-10" />
                 </button>
                 
                 <button 
                    onClick={togglePlay}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition shadow-lg"
                  >
                    <Icon name={isPlaying ? "pause" : "play"} className="w-10 h-10 fill-current ml-1" />
                  </button>
                 
                 <button onClick={nextSong} className="text-white hover:scale-110 transition">
                    <Icon name="next" className="w-10 h-10" />
                 </button>
                 
                 <button className="text-zinc-400 hover:text-white"><Icon name="repeat" className="w-6 h-6" /></button>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center px-4">
                 <button onClick={handleShare} className="text-zinc-400 hover:text-white flex flex-col items-center gap-1">
                    <Icon name="share" className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider">Compartilhar</span>
                 </button>
                 
                 <button 
                    onClick={() => { setIsExpanded(false); toggleLyrics(); }} 
                    className={`${hasLyrics ? 'text-zinc-400 hover:text-white' : 'text-zinc-700 cursor-not-allowed'} flex flex-col items-center gap-1`}
                    disabled={!hasLyrics}
                 >
                    <Icon name="mic" className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider">Letra</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Lyrics Overlay */}
      {showLyrics && (
        <div className="fixed inset-0 bottom-0 md:bottom-24 bg-black/95 z-[110] flex flex-col items-center justify-center p-8 animate-fade-in overflow-hidden">
           <div className="absolute top-4 right-4">
             <button onClick={toggleLyrics} className="text-zinc-400 hover:text-white">
               <Icon name="close" className="w-8 h-8" />
             </button>
           </div>
           
           <div className="text-center max-w-2xl w-full h-full overflow-y-auto scrollbar-hide flex flex-col items-center pt-12 md:pt-0">
              <img src={currentSong.coverUrl} className="w-24 h-24 rounded-lg shadow-2xl mb-6 opacity-80" />
              <h2 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
              <p className="text-green-500 font-mono mb-8 border border-green-800 bg-green-900/20 px-3 py-1 rounded-full text-sm">
                {currentSong.bibleReference}
              </p>
              
              <div className="text-xl md:text-2xl font-medium text-zinc-300 leading-relaxed space-y-6 whitespace-pre-wrap text-center opacity-90 pb-20">
                {currentSong.lyrics ? currentSong.lyrics : "Letra não disponível para esta canção."}
              </div>
           </div>
        </div>
      )}

      {/* Main Mini-Player Bar */}
      <div 
        onClick={handleToggleExpand}
        className="fixed bottom-16 md:bottom-0 left-0 right-0 h-16 md:h-24 bg-zinc-950 border-t border-zinc-800 flex items-center px-4 z-50 text-zinc-200 transition-all duration-300 cursor-pointer md:cursor-default"
      >
        {/* Mobile Progress Bar (Absolute Top) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 md:hidden">
           <div 
             className="h-full bg-green-500" 
             style={{ width: `${(progress / currentSong.duration) * 100}%` }}
           />
        </div>

        {/* Track Info */}
        <div className="flex items-center w-2/3 md:w-1/3">
          <div className="relative group flex-shrink-0">
             <img 
              src={currentSong.coverUrl} 
              alt={currentSong.title} 
              className={`w-10 h-10 md:w-14 md:h-14 rounded shadow-lg mr-3 md:mr-4 object-cover cursor-pointer transition ${showLyrics ? 'brightness-50' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleLyrics(); }}
            />
          </div>
          
          <div className="overflow-hidden mr-2">
            <h4 className="text-white text-xs md:text-sm font-semibold truncate hover:underline">
              {currentSong.title}
            </h4>
            <p className="text-[10px] md:text-xs text-green-500 font-medium truncate">{currentSong.bibleReference}</p>
          </div>
        </div>

        {/* Controls (Mobile - Simplified) */}
        <div className="flex md:hidden items-center justify-end w-1/3 space-x-3">
           <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black"
            >
              <Icon name={isPlaying ? "pause" : "play"} className="w-5 h-5 ml-0.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextSong(); }} className="text-zinc-400">
               <Icon name="next" className="w-6 h-6" />
            </button>
        </div>

        {/* Controls (Desktop - Full) */}
        <div className="hidden md:flex flex-col items-center w-1/3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-6 mb-2">
            <button onClick={prevSong} className="text-zinc-400 hover:text-white transition">
              <Icon name="prev" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition"
            >
              <Icon name={isPlaying ? "pause" : "play"} className="w-6 h-6 ml-0.5" />
            </button>
            <button onClick={nextSong} className="text-zinc-400 hover:text-white transition">
               <Icon name="next" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-2 text-xs text-zinc-400 font-mono">
            <span>{formatTime(progress)}</span>
            <input 
              type="range" 
              min={0} 
              max={currentSong.duration} 
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Volume & Extras (Desktop Only) */}
        <div className="hidden md:flex items-center justify-end w-1/3 space-x-3" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={toggleDownload(currentSong.id)}
            className={`ml-2 ${isDownloaded ? 'text-green-500' : 'text-zinc-500 hover:text-white'}`}
          >
             <Icon name={isDownloaded ? "downloaded" : "download"} className="w-5 h-5" />
          </button>

          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-green-500 transition"
            title="Compartilhar no WhatsApp"
          >
            <Icon name="share" className="w-5 h-5" />
          </button>
          
          {/* Conditional Lyrics Button */}
          {hasLyrics && (
            <button 
              onClick={toggleLyrics}
              className={`p-2 rounded-full hover:bg-zinc-800 transition ${showLyrics ? 'text-green-500 bg-zinc-900' : 'text-zinc-400'}`}
              title="Ver Letra / Referência"
            >
              <Icon name="mic" className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
             <Icon name="volume" className="w-5 h-5 text-zinc-400" />
             <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.01} 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};