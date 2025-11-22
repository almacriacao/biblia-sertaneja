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
  toggleDownload
}) => {
  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentSong) return null;

  const isPlaying = playbackState === PlaybackState.PLAYING;
  const isDownloaded = downloadedSongs.has(currentSong.id);

  const handleShare = () => {
    if (!currentSong) return;
    const text = `🤠 Estou ouvindo *${currentSong.title}* (${currentSong.bibleReference}) no app *Bíblia Sertaneja*! 🎵\n\nBaixe agora e escute: https://bibliasertaneja.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Lyrics Overlay */}
      {showLyrics && (
        <div className="fixed inset-0 bottom-24 bg-black/95 z-40 flex flex-col items-center justify-center p-8 animate-fade-in overflow-hidden">
           <div className="absolute top-4 right-4">
             <button onClick={() => setShowLyrics(false)} className="text-zinc-400 hover:text-white">
               <Icon name="close" className="w-8 h-8" />
             </button>
           </div>
           
           <div className="text-center max-w-2xl w-full h-full overflow-y-auto scrollbar-hide flex flex-col items-center">
              <img src={currentSong.coverUrl} className="w-24 h-24 rounded-lg shadow-2xl mb-6 opacity-80" />
              <h2 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
              <p className="text-green-500 font-mono mb-8 border border-green-800 bg-green-900/20 px-3 py-1 rounded-full text-sm">
                {currentSong.bibleReference}
              </p>
              
              <div className="text-xl md:text-2xl font-medium text-zinc-300 leading-relaxed space-y-6 whitespace-pre-wrap text-center opacity-90">
                {currentSong.lyrics ? currentSong.lyrics : "Letra não disponível para esta canção."}
              </div>
           </div>
        </div>
      )}

      {/* Main Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950 border-t border-zinc-800 flex items-center px-4 z-50 text-zinc-200">
        {/* Track Info */}
        <div className="flex items-center w-1/3">
          <div className="relative group">
             <img 
              src={currentSong.coverUrl} 
              alt={currentSong.title} 
              className={`w-14 h-14 rounded shadow-lg mr-4 object-cover cursor-pointer transition ${showLyrics ? 'brightness-50' : ''}`}
              onClick={() => setShowLyrics(!showLyrics)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
               <Icon name="mic" className="w-6 h-6 text-white mr-4 drop-shadow-md" />
            </div>
          </div>
          
          <div className="overflow-hidden">
            <h4 className="text-white text-sm font-semibold truncate hover:underline cursor-pointer" onClick={() => setShowLyrics(true)}>
              {currentSong.title}
            </h4>
            <p className="text-xs text-green-500 font-medium truncate">{currentSong.bibleReference}</p>
          </div>
          <button 
            onClick={() => toggleDownload(currentSong.id)}
            className={`ml-4 ${isDownloaded ? 'text-green-500' : 'text-zinc-500 hover:text-white'}`}
            title={isDownloaded ? "Baixado para offline" : "Baixar"}
          >
             <Icon name={isDownloaded ? "downloaded" : "download"} className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-1/3">
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

        {/* Volume & Extras */}
        <div className="flex items-center justify-end w-1/3 space-x-3">
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-green-500 transition"
            title="Compartilhar no WhatsApp"
          >
            <Icon name="share" className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 rounded-full hover:bg-zinc-800 transition ${showLyrics ? 'text-green-500 bg-zinc-900' : 'text-zinc-400'}`}
            title="Ver Letra / Referência"
          >
            <Icon name="mic" className="w-5 h-5" />
          </button>

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