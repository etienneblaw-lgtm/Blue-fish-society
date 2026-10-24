export type TrackType = 'release' | 'live' | 'unreleased' | 'mix';

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year: number;
  type: TrackType;
  tags: string[];
  /** URL du MP3 sur R2. Vide = pas d'audio (le mix reste hors radio). */
  src: string;
  /** Durée exacte en secondes (mesurée par le script prepare_mix). Obligatoire pour entrer dans la radio. */
  durationSec?: number;
  duration: string;
  desc: string;
  manifesto: string;
  asciiSeed: string;
}

export const tracks: Track[] = [
  {
    id: 'bf-0001',
    slug: 'tirage-suspens',
    title: 'Tirage suspens',
    artist: 'Etienne',
    year: 2026,
    type: 'release',
    tags: ['techno', 'archive'],
    src: 'https://pub-9a8f003b7d5e4d5f870f2a0899a42cd1.r2.dev/Tirage%20suspens.mp3',
    durationSec: 43.61,
    duration: '0:44',
    desc: 'Premiere transmission test. Architecture sonore autonome.',
    manifesto: 'Une frequence suspendue. Un protocole d entree. Un fichier qui refuse de devenir contenu.',
    asciiSeed: 'suspens',
  },
  {
    id: 'bf-0002',
    slug: 'interstices',
    title: 'Interstices',
    artist: 'Bluefish Society',
    year: 2025,
    type: 'unreleased',
    tags: ['ambient', 'drone'],
    src: '',
    duration: '48:12',
    desc: 'Ce qui existe deja dans les interstices du silence.',
    manifesto: 'Une archive sans urgence. Une piece lente. Un signal entre deux machines.',
    asciiSeed: 'interstices',
  },
  {
    id: 'bf-0003',
    slug: 'protocole-nocturne',
    title: 'Protocole nocturne',
    artist: 'Citoyen inconnu',
    year: 2025,
    type: 'live',
    tags: ['live', 'nocturne'],
    src: '',
    duration: '54:30',
    desc: 'Captation directe, sans filet, dans le bruit numerique.',
    manifesto: 'La nuit comme interface. Le mix comme passage.',
    asciiSeed: 'nocturne',
  },
];

export const filters = [
  ['all', 'ALL'],
  ['release', 'RELEASES'],
  ['live', 'LIVE'],
  ['unreleased', 'UNRELEASED'],
  ['mix', 'MIXES'],
] as const;
