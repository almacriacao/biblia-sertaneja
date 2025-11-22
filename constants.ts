
import { Song, Album, Playlist } from './types';

// ARCHITECTURE NOTE:
// In the production environment (AWS/Google Cloud), 'audioUrl' will point to an .m3u8 manifest file.
// Example: https://cdn.bibliasertaneja.com.br/music/evidencias/index.m3u8
// This manifest controls the playback of AES-128 encrypted segments (.ts files).

const MOCK_AUDIO_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const MOCK_AUDIO_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
const MOCK_AUDIO_3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

const SAMPLE_LYRICS = `No caminho de Emaús
Onde o sol se punha já
Dois discípulos andavam
Tristes a conversar

Falavam do que houve
Em Jerusalém a acontecer
De Jesus Nazareno
Que viram padecer

(Refrão)
Mas Ele vive, Ele reina
O túmulo vazio está
A morte não o segurou
Ressuscitou, Jeová!`;

export const SONGS: Song[] = [
  {
    id: '1',
    title: "Caminho de Emaús",
    bibleReference: "Lucas 24:13-35",
    lyrics: SAMPLE_LYRICS,
    album: "Sertão de Fé",
    coverUrl: "https://picsum.photos/300/300?random=1",
    audioUrl: MOCK_AUDIO_1,
    duration: 185,
    description: "Uma moda de viola clássica narrando o encontro dos discípulos com Jesus ressuscitado.",
    isEncrypted: true
  },
  {
    id: '2',
    title: "O Filho Pródigo",
    bibleReference: "Lucas 15:11-32",
    lyrics: "Pai, eu pequei contra o céu e contra ti...\nNão sou digno de ser chamado teu filho...",
    album: "Parábolas Cantadas",
    coverUrl: "https://picsum.photos/300/300?random=2",
    audioUrl: MOCK_AUDIO_2,
    duration: 240,
    description: "Canção emocionante sobre o retorno à casa do Pai e o arrependimento.",
    isEncrypted: true
  },
  {
    id: '3',
    title: "Davi e Golias",
    bibleReference: "1 Samuel 17",
    lyrics: "Era um menino pastor\nContra um gigante guerreiro\nMas com cinco pedrinhas\nE Deus no coração...",
    album: "Heróis da Fé",
    coverUrl: "https://picsum.photos/300/300?random=3",
    audioUrl: MOCK_AUDIO_3,
    duration: 190,
    description: "Ritmo animado contando a vitória da fé sobre o gigante.",
    isEncrypted: true
  },
  {
    id: '4',
    title: "A Pesca Maravilhosa",
    bibleReference: "Lucas 5:1-11",
    lyrics: "Jogaram as redes\nNada pegaram\nMas sob a Tua palavra\nAo mar voltaram...",
    album: "Milagres no Sertão",
    coverUrl: "https://picsum.photos/300/300?random=4",
    audioUrl: MOCK_AUDIO_1,
    duration: 210,
    description: "Universitário acústico sobre obediência e provisão divina.",
    isEncrypted: true
  },
  {
    id: '5',
    title: "Somente Pela Graça",
    bibleReference: "Efésios 2:8",
    lyrics: "Não vem de vós\nÉ dom de Deus\nPara que ninguém se glorie...",
    album: "Louvor Caipira",
    coverUrl: "https://picsum.photos/300/300?random=5",
    audioUrl: MOCK_AUDIO_2,
    duration: 160,
    description: "Adoração profunda em ritmo de guarânia.",
    isEncrypted: true
  },
  {
    id: '6',
    title: "O Bom Samaritano",
    bibleReference: "Lucas 10:25-37",
    lyrics: "Quem é o meu próximo?\nPerguntou o doutor da lei...",
    album: "Parábolas Cantadas",
    coverUrl: "https://picsum.photos/300/300?random=6",
    audioUrl: MOCK_AUDIO_3,
    duration: 195,
    description: "História cantada sobre o amor ao próximo e compaixão.",
    isEncrypted: true
  }
];

export const ALBUMS: Album[] = [
  {
    id: 'a1',
    title: "Sertão de Fé",
    author: "Bíblia Sertaneja",
    coverUrl: "https://picsum.photos/300/300?random=10",
    year: 2024,
    songs: ['1', '3']
  },
  {
    id: 'a2',
    title: "Parábolas Cantadas",
    author: "Bíblia Sertaneja",
    coverUrl: "https://picsum.photos/300/300?random=11",
    year: 2024,
    songs: ['2', '6']
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    title: "Modão Profético",
    description: "As melhores para meditar na palavra.",
    coverUrl: "https://picsum.photos/300/300?random=20",
    songs: ['1', '3', '4'],
    isUserCreated: false
  },
  {
    id: 'p2',
    title: "Louvor na Roça",
    description: "Adoração com viola.",
    coverUrl: "https://picsum.photos/300/300?random=21",
    songs: ['2', '5'],
    isUserCreated: false
  }
];
