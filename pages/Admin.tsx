
import React, { useState } from 'react';
import { Song, Album } from '../types';
import { Icon } from '../components/Icon';

interface AdminProps {
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
}

export const Admin: React.FC<AdminProps> = ({ songs, setSongs, albums, setAlbums }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'albums'>('dashboard');
  
  // Form States
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongBibleRef, setNewSongBibleRef] = useState(''); // Replaced Artist
  const [newSongLyrics, setNewSongLyrics] = useState(''); // New Lyrics State
  const [newSongDescription, setNewSongDescription] = useState(''); // Replaced Genre
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Album Form
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumYear, setNewAlbumYear] = useState(new Date().getFullYear());
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const handleSongUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle || !newSongBibleRef || !audioFile) {
      alert("Por favor, preencha o Título, Referência Bíblica e selecione um arquivo de áudio.");
      return;
    }

    setIsUploading(true);

    // SIMULATE CLOUD UPLOAD LATENCY
    await new Promise(resolve => setTimeout(resolve, 1500));

    // CREATE OBJECT URLS (This allows local files to be played in the browser session)
    const audioUrl = URL.createObjectURL(audioFile);
    const coverUrl = imageFile 
      ? URL.createObjectURL(imageFile) 
      : "https://picsum.photos/300/300?random=" + Math.random();

    const newSong: Song = {
      id: `custom-${Date.now()}`,
      title: newSongTitle,
      bibleReference: newSongBibleRef,
      lyrics: newSongLyrics, // Add lyrics
      description: newSongDescription || "Sem descrição", // Add description
      album: "Single", // Default
      coverUrl: coverUrl,
      audioUrl: audioUrl,
      duration: 200, // Mock duration
      isEncrypted: true // Simulating that our backend encrypts it automatically
    };

    setSongs(prev => [newSong, ...prev]);
    
    // Reset Form
    setNewSongTitle('');
    setNewSongBibleRef('');
    setNewSongLyrics('');
    setNewSongDescription('');
    setAudioFile(null);
    setImageFile(null);
    setIsUploading(false);
    alert("Música e Letra enviadas com sucesso! O sistema de DRM já protegeu o arquivo.");
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle || selectedSongIds.length === 0) return;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: newAlbumTitle,
      author: "Bíblia Sertaneja", // Simplification
      coverUrl: "https://picsum.photos/300/300?grayscale",
      year: newAlbumYear,
      songs: selectedSongIds
    };

    setAlbums(prev => [newAlbum, ...prev]);
    
    // Update song album names
    setSongs(prev => prev.map(s => {
      if (selectedSongIds.includes(s.id)) {
        return { ...s, album: newAlbumTitle };
      }
      return s;
    }));

    setNewAlbumTitle('');
    setSelectedSongIds([]);
    alert("Álbum criado e publicado!");
  };

  const toggleSongSelection = (id: string) => {
    if (selectedSongIds.includes(id)) {
      setSelectedSongIds(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedSongIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="p-8 pb-32 overflow-y-auto h-full bg-zinc-950 text-zinc-200">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name="settings" className="w-8 h-8 text-green-500" />
            Painel Administrativo
          </h1>
          <p className="text-zinc-400">Gerencie o catálogo, uploads e distribuição.</p>
        </div>
        <div className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-2 rounded text-sm font-mono">
          ADMIN MODE: ACTIVE
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-zinc-800">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 px-2 text-sm font-bold transition ${activeTab === 'dashboard' ? 'text-green-500 border-b-2 border-green-500' : 'text-zinc-400 hover:text-white'}`}
        >
          Visão Geral
        </button>
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-3 px-2 text-sm font-bold transition ${activeTab === 'upload' ? 'text-green-500 border-b-2 border-green-500' : 'text-zinc-400 hover:text-white'}`}
        >
          Upload de Músicas
        </button>
        <button 
          onClick={() => setActiveTab('albums')}
          className={`pb-3 px-2 text-sm font-bold transition ${activeTab === 'albums' ? 'text-green-500 border-b-2 border-green-500' : 'text-zinc-400 hover:text-white'}`}
        >
          Gerenciar Álbuns
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-zinc-400 text-sm">Músicas no Catálogo</p>
                    <h3 className="text-3xl font-bold text-white">{songs.length}</h3>
                  </div>
                  <Icon name="music" className="w-8 h-8 text-green-600" />
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Server Storage: 45% used</p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-zinc-400 text-sm">Álbuns Ativos</p>
                    <h3 className="text-3xl font-bold text-white">{albums.length}</h3>
                  </div>
                  <Icon name="library" className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-green-400">+2 essa semana</p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-zinc-400 text-sm">Assinantes Ativos</p>
                    <h3 className="text-3xl font-bold text-white">12.4k</h3>
                  </div>
                  <Icon name="chart" className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-green-400">+12% crescimento</p>
              </div>
           </div>

           <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
             <h3 className="text-lg font-bold text-white mb-4">Catálogo Recente</h3>
             <table className="w-full text-left text-sm">
               <thead className="text-zinc-500 border-b border-zinc-800">
                 <tr>
                   <th className="pb-3">Título</th>
                   <th className="pb-3">Ref. Bíblica</th>
                   <th className="pb-3">Status DRM</th>
                   <th className="pb-3 text-right">Ações</th>
                 </tr>
               </thead>
               <tbody className="text-zinc-300">
                 {songs.slice(0, 5).map(s => (
                   <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50">
                     <td className="py-3">{s.title}</td>
                     <td className="py-3">{s.bibleReference}</td>
                     <td className="py-3">
                        <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-900/50 flex w-fit items-center gap-1">
                          <Icon name="lock" className="w-3 h-3" /> PROTECTED
                        </span>
                     </td>
                     <td className="py-3 text-right">
                       <button className="text-zinc-400 hover:text-white"><Icon name="edit" className="w-4 h-4" /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* UPLOAD TAB */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Icon name="upload" /> Upload de Nova Faixa
          </h2>
          
          <form onSubmit={handleSongUpload} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Título da Música</label>
                <input 
                  type="text" 
                  value={newSongTitle}
                  onChange={e => setNewSongTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded p-2 focus:border-green-500 focus:outline-none text-white"
                  placeholder="Ex: O Bom Samaritano"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Ref. Bíblica</label>
                <input 
                  type="text" 
                  value={newSongBibleRef}
                  onChange={e => setNewSongBibleRef(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded p-2 focus:border-green-500 focus:outline-none text-white"
                  placeholder="Ex: Lucas 10:25-37"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição da Música</label>
              <input 
                type="text"
                value={newSongDescription}
                onChange={e => setNewSongDescription(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded p-2 focus:border-green-500 focus:outline-none text-white"
                placeholder="Ex: Modão de viola sobre o amor ao próximo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Letra da Música</label>
              <textarea
                value={newSongLyrics}
                onChange={e => setNewSongLyrics(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded p-2 focus:border-green-500 focus:outline-none text-white h-32"
                placeholder="Cole a letra da música aqui..."
              />
            </div>

            {/* File Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept="audio/*"
                  onChange={e => setAudioFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Icon name="music" className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
                <p className="text-xs text-zinc-400">{audioFile ? audioFile.name : "Arraste o Áudio (MP3/WAV)"}</p>
              </div>

              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Icon name="image" className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
                <p className="text-xs text-zinc-400">{imageFile ? imageFile.name : "Capa do Single (JPG/PNG)"}</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>Enviando para AWS S3...</>
              ) : (
                <>
                  <Icon name="upload" className="w-5 h-5" /> Publicar Música
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ALBUMS TAB */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Form */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit">
             <h3 className="font-bold text-white mb-4">Criar Novo Álbum</h3>
             <form onSubmit={handleCreateAlbum} className="space-y-4">
               <input 
                  type="text" 
                  placeholder="Nome do Álbum"
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-white"
                  value={newAlbumTitle}
                  onChange={e => setNewAlbumTitle(e.target.value)}
               />
               <input 
                  type="number" 
                  placeholder="Ano"
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-white"
                  value={newAlbumYear}
                  onChange={e => setNewAlbumYear(Number(e.target.value))}
               />
               
               <div className="border border-zinc-700 rounded p-2 max-h-60 overflow-y-auto">
                 <p className="text-xs text-zinc-500 mb-2 uppercase">Selecione as faixas:</p>
                 {songs.map(song => (
                   <div 
                    key={song.id} 
                    onClick={() => toggleSongSelection(song.id)}
                    className={`flex items-center p-2 rounded cursor-pointer ${selectedSongIds.includes(song.id) ? 'bg-green-900/40 text-green-400' : 'hover:bg-zinc-800'}`}
                   >
                      <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${selectedSongIds.includes(song.id) ? 'border-green-500 bg-green-500' : 'border-zinc-600'}`}>
                        {selectedSongIds.includes(song.id) && <Icon name="check" className="w-3 h-3 text-black" />}
                      </div>
                      <div className="truncate text-sm">{song.title}</div>
                   </div>
                 ))}
               </div>

               <button className="w-full bg-zinc-700 hover:bg-white hover:text-black text-white font-bold py-2 rounded transition">
                 Criar Álbum
               </button>
             </form>
          </div>

          {/* List */}
          <div>
            <h3 className="font-bold text-white mb-4">Álbuns Existentes</h3>
            <div className="space-y-3">
              {albums.map(album => (
                <div key={album.id} className="flex items-center bg-zinc-900 p-3 rounded border border-zinc-800">
                   <img src={album.coverUrl} className="w-12 h-12 rounded mr-4" />
                   <div>
                     <p className="font-bold text-white">{album.title}</p>
                     <p className="text-xs text-zinc-400">{album.author} • {album.songs.length} faixas</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
