import type { LabRecipe } from '@/lab/recipe';

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
  /** Description du mix. Paragraphes séparés par une ligne vide. */
  desc: string;
  manifesto: string;
  asciiSeed: string;
  /** Recette du laboratoire (COPY CONFIG). Si présente, la page du mix affiche l'œuvre générative. */
  lab?: LabRecipe;
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
    src: '',
    duration: '60:00',
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
  {
    id: "bf-0004",
    slug: "theo-leo",
    title: "Théo Léo",
    artist: "Théo Léo",
    year: 2026,
    type: "mix",
    tags: ["mix"],
    src: "https://audio.poisson.blue/mixes/theo-leo.mp3",
    durationSec: 4914.88,
    duration: "1:21:55",
    desc: "Lorem Ipsum",
    manifesto: '',
    asciiSeed: "theo-leo",
    lab: {"engine":"caustics","interaction":"attract","memory":"evaporate","palette":"iridescent","colors":{"seed":3471588312,"spread":1},"parameters":{"density":1,"speed":0.67,"chaos":1,"scale":0.31,"force":0.05,"persistence":0},"seed":4062327588},
  },
  {
    id: "bf-0005",
    slug: "do-you-need-me-like-i-need-you",
    title: "Do you need me like I need you ?",
    artist: "Gardair",
    year: 2026,
    type: "mix",
    tags: ["mix"],
    src: "https://audio.poisson.blue/mixes/do-you-need-me-like-i-need-you.mp3",
    durationSec: 3662.89,
    duration: "1:01:03",
    desc: "Ethereal transmission carefully crafted by Gardair.\n\nA slow-burning journey guiding us through different layers of sounds, taking our hand from deep within into the clear blue sky.\n\nA message of hope.\n\nWe do need that.",
    manifesto: '',
    asciiSeed: "do-you-need-me-like-i-need-you",
    lab: {"engine":"tesseract","interaction":"repel","memory":"heal","palette":"infrared","colors":{"seed":1753773648,"spread":0.68},"parameters":{"density":0.46,"speed":0.36,"chaos":0.85,"scale":1,"force":1,"persistence":0.18},"seed":2908339300},
  },
  // ── Nouveaux mixes : ajoutés ici par Script/bluefish_add_mix.mjs ──
];

export const filters = [
  ['all', 'ALL'],
  ['release', 'RELEASES'],
  ['live', 'LIVE'],
  ['unreleased', 'UNRELEASED'],
  ['mix', 'MIXES'],
] as const;
