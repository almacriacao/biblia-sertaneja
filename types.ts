
export interface Song {
  id: string;
  title: string;
  bibleReference: string; // Replaces artist
  lyrics?: string; // New field for lyrics
  description?: string; // Replaces genre
  album: string;
  coverUrl: string;
  audioUrl: string; // In production, this would be a .m3u8 HLS manifest url
  duration: number; // in seconds
  isEncrypted?: boolean; // Visual indicator for DRM status
}

export interface Album {
  id: string;
  title: string;
  author: string; // Replaces artist for Album context (can be 'Various' or 'Ministry')
  coverUrl: string;
  year: number;
  songs: string[]; // array of song IDs
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songs: string[];
  isUserCreated?: boolean; // Distinguish between curated and user playlists
}

export type ChristianFaith = 'catholic' | 'evangelical';

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isTrial?: boolean; // Indicates if they are in the 24h free period
  trialEndsAt?: Date; // Timestamp for when the trial ends
  avatarUrl?: string;
  birthdate?: string; // ISO Date string YYYY-MM-DD
  gender?: 'male' | 'female' | 'other' | 'prefer_not_say';
  faith?: ChristianFaith; // Personalization based on denomination
}

export enum PlaybackState {
  PAUSED,
  PLAYING,
  BUFFERING
}

export interface PlayerContextType {
  currentSong: Song | null;
  playbackState: PlaybackState;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  volume: number;
  setVolume: (val: number) => void;
  progress: number;
  setProgress: (val: number) => void;
  isOffline: boolean;
  toggleOfflineMode: () => void;
  downloadedSongs: Set<string>;
  toggleDownload: (songId: string) => void;
  favoriteSongs: Set<string>;
  toggleFavorite: (songId: string) => void;
  // Lyrics Control
  showLyrics: boolean;
  toggleLyrics: () => void;
}