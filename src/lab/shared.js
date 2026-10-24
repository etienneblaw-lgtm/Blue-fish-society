// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.

// ═══════════════════════════════════════════════
// SHARED UTILITIES
// ═══════════════════════════════════════════════

const palettes = {
  bluefish: { bg: '#000000', primary: '#1ff3e0', secondary: '#1ec8c8', muted: '#14525c', accents: ['#1ff3e0', '#1ec8c8', '#00a8a8', '#86fff1', '#147c8c', '#c5fff7'] },
  ultraviolet: { bg: '#08000f', primary: '#b86cff', secondary: '#ff4fd8', muted: '#48205e', accents: ['#b86cff', '#ff4fd8', '#7b38d8', '#f4b8ff', '#6d2cc7', '#ff93e8'] },
  'signal-red': { bg: '#080000', primary: '#ff3b30', secondary: '#ff9c24', muted: '#601a18', accents: ['#ff3b30', '#ff9c24', '#ff6b35', '#ffd166', '#b51224', '#ffb703'] },
  acid: { bg: '#030500', primary: '#c7ff00', secondary: '#4cff66', muted: '#425b0a', accents: ['#c7ff00', '#4cff66', '#f5ff52', '#10d16b', '#8dcc00', '#d8ff9d'] },
  paper: { bg: '#e9e4d8', primary: '#111111', secondary: '#2244cc', muted: '#a49f93', accents: ['#111111', '#2244cc', '#e3342f', '#f5a623', '#4b8f29', '#6e44ff'] },
  thermal: { bg: '#120504', primary: '#ff4d00', secondary: '#ffd23f', muted: '#61230c', accents: ['#ff4d00', '#ff7a00', '#ffb000', '#ffd23f', '#ffe8a3', '#b71619'] },
  petrol: { bg: '#020b10', primary: '#00e5ff', secondary: '#00ffa3', muted: '#0b3742', accents: ['#00e5ff', '#00ffa3', '#00a8ff', '#0072ff', '#b9f6ff', '#00b8a9'] },
  infrared: { bg: '#100008', primary: '#ff195f', secondary: '#ff8a00', muted: '#5a1029', accents: ['#ff195f', '#ff4d6d', '#ff8a00', '#ffcc00', '#ff87b7', '#c4004d'] },
  iridescent: { bg: '#08070d', primary: '#95f8ff', secondary: '#ff6bd6', muted: '#2e2359', accents: ['#95f8ff', '#ff6bd6', '#a98bff', '#74ffd7', '#ffe06b', '#a152ff'] },
  glacier: { bg: '#03111c', primary: '#c6f7ff', secondary: '#53d8fb', muted: '#14506b', accents: ['#c6f7ff', '#53d8fb', '#1ca7ec', '#9cf6df', '#dffbff', '#4079d6'] },
  chrome: { bg: '#0d0f12', primary: '#f4f7fa', secondary: '#8b99a7', muted: '#313942', accents: ['#f4f7fa', '#c6d0d9', '#8b99a7', '#5f6b75', '#e0e6ec', '#a8b5c2'] },
  desert: { bg: '#160f08', primary: '#f5cf8e', secondary: '#df8755', muted: '#68452d', accents: ['#f5cf8e', '#df8755', '#b85c38', '#f0aa4f', '#fff1c7', '#8d3f2f'] },
  cobalt: { bg: '#02051b', primary: '#3f7cff', secondary: '#55d6ff', muted: '#182c73', accents: ['#3f7cff', '#55d6ff', '#6a4dff', '#9ab6ff', '#00a4ff', '#b9d6ff'] },
  ember: { bg: '#130604', primary: '#ff7b21', secondary: '#f23636', muted: '#672016', accents: ['#ff7b21', '#f23636', '#ffb15d', '#ffdd86', '#bd1e27', '#ff5e14'] },
  orchid: { bg: '#110713', primary: '#f58cff', secondary: '#a56eff', muted: '#4e275c', accents: ['#f58cff', '#a56eff', '#ffb8ea', '#d34fd5', '#8457d8', '#ffc8ff'] },
  solar: { bg: '#120f02', primary: '#fff275', secondary: '#ffbf3f', muted: '#65511a', accents: ['#fff275', '#ffbf3f', '#ff8c42', '#ffeeb0', '#ef6c00', '#fff9d0'] },
  kelp: { bg: '#020d08', primary: '#7df0a8', secondary: '#20c997', muted: '#15523b', accents: ['#7df0a8', '#20c997', '#0fa76d', '#b8ffcf', '#4dcf7a', '#90e0b7'] },
  candy: { bg: '#150713', primary: '#ff78b8', secondary: '#7be7ff', muted: '#5d2258', accents: ['#ff78b8', '#7be7ff', '#ffdd57', '#b28dff', '#7bffb6', '#ff9ee2'] },
};

function seededRandom(seed) {
  let v = seed >>> 0;
  return () => { v = (v * 1664525 + 1013904223) >>> 0; return v / 4294967296; };
}

function clamp(v, min = 0, max = 1) { return Math.min(max, Math.max(min, v)); }

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function mixColor(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  return `rgb(${ca.map((c, i) => Math.round(c + (cb[i] - c) * t)).join(',')})`;
}

function formatTime(s) {
  if (!Number.isFinite(s)) return '00:00';
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

let fallbackSeed = (Date.now() ^ Math.floor(performance.now() * 1000)) >>> 0;

function randomSeed() {
  if (window.crypto?.getRandomValues) { const a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0]; }
  fallbackSeed = (fallbackSeed * 1664525 + 1013904223) >>> 0;
  return fallbackSeed;
}

function randomChoice(arr) { return arr[Math.floor(randomSeed() / 4294967296 * arr.length)]; }

let trackName = 'TIRAGE SUSPENS';
const trippyShapeCount = 7;

function createShapeDescriptor(random) {
  return { kind: Math.floor(random() * trippyShapeCount), phase: random() * Math.PI * 2, rotation: (random() - 0.5) * Math.PI * 2 };
}

function traceTrippyShape(context, kind, size, phase) {
  const points = 18;
  context.beginPath();
  if (kind === 0) {
    for (let index = 0; index <= points; index += 1) {
      const angle = index / points * Math.PI * 2;
      const radius = size * (0.7 + Math.sin(angle * 3 + phase) * 0.18 + Math.cos(angle * 5 - phase) * 0.12);
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
  } else if (kind === 1) {
    for (let index = 0; index <= 40; index += 1) {
      const angle = index / 40 * Math.PI * 2;
      const radius = size * (0.5 + 0.3 * Math.sin(angle * 5 + phase));
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
  } else if (kind === 2) {
    context.moveTo(-size, -size * 0.25);
    context.bezierCurveTo(-size * 0.2, -size * 1.25, size * 0.15, size * 1.05, size, -size * 0.3);
    context.bezierCurveTo(size * 0.36, size * 1.2, -size * 0.42, size * 0.72, -size, -size * 0.25);
    context.closePath();
  } else if (kind === 3) {
    for (let index = 0; index <= 30; index += 1) {
      const angle = index / 30 * Math.PI * 4;
      const radius = size * index / 30;
      const x = Math.cos(angle + phase) * radius, y = Math.sin(angle + phase) * radius;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
  } else if (kind === 4) {
    context.arc(-size * 0.16, 0, size * 0.82, phase - Math.PI * 0.35, phase + Math.PI * 1.35);
    context.arc(size * 0.32, 0, size * 0.64, phase + Math.PI * 1.12, phase - Math.PI * 0.12, true);
    context.closePath();
  } else if (kind === 5) {
    for (let index = 0; index <= 14; index += 1) {
      const angle = index / 14 * Math.PI * 2 - Math.PI / 2;
      const radius = size * (index % 2 === 0 ? 1 : 0.36 + Math.sin(phase + index) * 0.12);
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
  } else {
    context.moveTo(-size, 0);
    context.bezierCurveTo(-size * 0.6, -size, size * 0.3, -size * 0.7, size, 0);
    context.bezierCurveTo(size * 0.35, size * 0.7, -size * 0.45, size, -size, 0);
    context.closePath();
  }
}

function drawTrippyShape(context, descriptor, x, y, size, mode = 'stroke') {
  context.save();
  context.translate(x, y);
  context.rotate(descriptor.rotation);
  traceTrippyShape(context, descriptor.kind, size, descriptor.phase);
  if (mode === 'fill') context.fill();
  else if (mode === 'both') { context.fill(); context.stroke(); }
  else context.stroke();
  context.restore();
}

function paletteTone(ctx, index = 0) {
  const accents = ctx.palette.accents || [ctx.palette.primary, ctx.palette.secondary];
  return accents[Math.abs(Math.floor(index)) % accents.length];
}

// ═══════════════════════════════════════════════
// ENGINE REGISTRY
// ═══════════════════════════════════════════════

const engineCatalog = [
  { id: 'scratch', label: 'SCRATCH LAYER', note: 'An opaque surface conceals a hidden composition. Scratch to reveal what lies beneath.' },
  { id: 'word-brush', label: 'WORD BRUSH', note: 'A blank page awaits. Your movement writes words. Speed controls their scale.' },
  { id: 'invisible', label: 'INVISIBLE PRESENCE', note: 'The cursor vanishes. Only the disturbance it creates in the field reveals its position.' },
  { id: 'pong', label: 'SPLIT PONG', note: 'Two halves of the screen face off. You control one paddle. The ball never stops.' },
  { id: 'velocity', label: 'VELOCITY SPECTRUM', note: 'Color emerges from speed. Slow gestures paint cool tones. Fast gestures burn warm.' },
  { id: 'spotlight', label: 'SPOTLIGHT', note: 'Darkness hides everything. A circle of light follows your cursor, revealing fragments.' },
  { id: 'breakout', label: 'BREAKOUT REVEAL', note: 'Break the wall. Each block destroyed uncovers a hidden word from the transmission.' },
  { id: 'poster', label: 'DRAGGABLE SCULPTURE', note: 'Move abstract geometric fragments to build a temporary digital sculpture.' },
  { id: 'portal', label: 'PORTAL CURSOR', note: 'Two worlds coexist. Your cursor is a portal between them. Move to see through.' },
  { id: 'genesis', label: 'AUDIO GENESIS', note: 'Nothing exists yet. Press PLAY and the world is born from sound, growing element by element.' },
  { id: 'kaleidoscope', label: 'KALEIDOSCOPE BRUSH', note: 'Every gesture is mirrored into a living radial composition.' },
  { id: 'tunnel', label: 'INFINITE TUNNEL', note: 'Travel through a geometric tunnel and bend its vanishing point.' },
  { id: 'marbling', label: 'LIQUID MARBLING', note: 'Drag through bands of liquid color and twist their currents.' },
  { id: 'metaballs', label: 'METABALL ORGANISM', note: 'Soft organisms merge, split and breathe around your presence.' },
  { id: 'reaction', label: 'REACTION DIFFUSION', note: 'Seed a chemical-looking organism that grows through local reactions.' },
  { id: 'feedback', label: 'RGB FEEDBACK', note: 'Your gesture falls into a recursive chromatic video loop.' },
  { id: 'black-hole', label: 'BLACK HOLE', note: 'Hold to absorb the field. Release to trigger a supernova.' },
  { id: 'sand', label: 'GRAVITY SAND', note: 'A magnetic granular field follows gravity and your cursor.' },
  { id: 'membrane', label: 'ELASTIC MEMBRANE', note: 'Pull a luminous fabric, release waves and watch it heal.' },
  { id: 'harmonograph', label: 'HARMONOGRAPH', note: 'Your position controls coupled pendulums drawing endless curves.' },
  { id: 'fractal', label: 'FRACTAL BLOOM', note: 'Plant recursive organisms and influence the direction of their growth.' },
  { id: 'loop-recorder', label: 'LOOP RECORDER', note: 'Record a gesture and watch delayed colored copies replay it forever.' },
  { id: 'julia', label: 'JULIA NAVIGATOR', note: 'Navigate a living fractal by moving its complex parameters and zooming through it.' },
  { id: 'rorschach', label: 'RORSCHACH REACTOR', note: 'Inject mirrored chromatic ink that spreads into a bilateral organism.' },
  { id: 'chladni', label: 'CHLADNI PLATE', note: 'Granular matter finds the nodal lines of a vibrating virtual plate.' },
  { id: 'voronoi', label: 'VORONOI MELT', note: 'Crystal cells liquefy, fracture and reform around your presence.' },
  { id: 'ferrofluid', label: 'FERROFLUID SPIKES', note: 'A magnetic liquid grows directional spikes toward the cursor.' },
  { id: 'smoke', label: 'SMOKE ADVECTION', note: 'Blow through a field of chromatic smoke and reshape its currents.' },
  { id: 'caustics', label: 'CAUSTIC POOL', note: 'Move a light source through a pool of intersecting luminous waves.' },
  { id: 'nbody', label: 'N-BODY CHAOS', note: 'Create celestial bodies and destabilize their mutual gravity.' },
  { id: 'wave-tank', label: 'WAVE TANK', note: 'Touch a liquid simulation and combine waves into interference patterns.' },
  { id: 'plasma', label: 'PLASMA NETWORK', note: 'Place electrical anchors and conduct unstable arcs through the cursor.' },
  { id: 'recursive-windows', label: 'RECURSIVE WINDOWS', note: 'The scene repeatedly contains itself inside moving geometric windows.' },
  { id: 'delay-grid', label: 'TEMPORAL DELAY GRID', note: 'Every cell shows your gesture at a different moment in time.' },
  { id: 'impossible-room', label: 'IMPOSSIBLE ROOM', note: 'Fold and invert an isometric room whose perspective refuses stability.' },
  { id: 'sandpile', label: 'SANDPILE AVALANCHE', note: 'Add energy to a cellular sandpile and trigger cascading geometric avalanches.' },
  { id: 'ghost-choir', label: 'CURSOR GHOST CHOIR', note: 'A choir of delayed geometric ghosts transforms and repeats your movement.' },
  { id: 'moire', label: 'MOIRE LENS', note: 'Move a virtual lens through overlapping grids and bend their interference.' },
  { id: 'magnetic-filaments', label: 'MAGNETIC FILAMENTS', note: 'Carry a dipole through a field and reverse its polarity on impact.' },
  { id: 'pixel-sort', label: 'PIXEL SORT STORM', note: 'Tear luminous columns out of order and release chromatic sorting storms.' },
  { id: 'cellular-garden', label: 'CELLULAR GARDEN', note: 'Plant living cells that reproduce, collide and disappear across the surface.' },
  { id: 'delaunay', label: 'DELAUNAY SHATTER', note: 'Distort a triangulated skin and fracture it with expanding impacts.' },
  { id: 'attractor', label: 'STRANGE ATTRACTOR', note: 'Steer the parameters of a chaotic system and reshape its endless orbit.' },
  { id: 'tesseract', label: 'TESSERACT SLICE', note: 'Rotate a four-dimensional object through an unstable two-dimensional projection.' },
  { id: 'aurora', label: 'AURORA CURTAIN', note: 'Charge luminous curtains and fold them through a drifting polar field.' },
  { id: 'gravity-lens', label: 'GRAVITATIONAL LENS', note: 'Drag spacetime through a star field and place persistent masses.' },
  { id: 'prism-rain', label: 'PRISM RAIN', note: 'Refract falling beams into divergent spectral trajectories.' },
  { id: 'topographic', label: 'TOPOGRAPHIC DRIFT', note: 'Raise a fluid terrain and leave temporary mountains in its contour lines.' },
  { id: 'mirror-maze', label: 'MIRROR MAZE', note: 'Rotate a field of mirrors and redirect a ray through an optical maze.' },
  { id: 'dendrite', label: 'DENDRITE LIGHTNING', note: 'Grow branching electrical structures that search for your position.' },
  { id: 'quantum-slits', label: 'QUANTUM SLITS', note: 'Move a pair of virtual slits and reshape a field of wave interference.' },
  { id: 'voxel-erosion', label: 'VOXEL EROSION', note: 'Excavate and rebuild an isometric terrain made from reactive columns.' },
];

const engineIds = engineCatalog.map(e => e.id);

const cursorShapes = {
  scratch: '<path d="M-12 12L12-12M-15 5L5-15M-5 15L15-5"/>',
  'word-brush': '<path d="M0-15L8-4L0 13L-8-4ZM-8-4H8M0 13V18"/>',
  invisible: '',
  pong: '<path d="M-14-12V12M14-12V12"/><circle cx="0" cy="0" r="3"/>',
  velocity: '<path d="M-16 8L10-10L6 0L16 3L-12 13ZM-14 2H-4"/>',
  spotlight: '<circle r="9"/><path d="M0-18V-13M0 13V18M-18 0H-13M13 0H18M-13-13L-9-9M13-13L9-9M-13 13L-9 9M13 13L9 9"/>',
  breakout: '<path d="M-15-11H-3V-1H-15ZM3-11H15V-1H3ZM-9 5H3V15H-9ZM9 3L14 14"/>',
  poster: '<path d="M-15-7V-15H-7M7-15H15V-7M15 7V15H7M-7 15H-15V7"/><path d="M-7 0H7M0-7V7"/>',
  portal: '<circle cx="-5" r="10"/><circle cx="5" r="10"/>',
  genesis: '<circle r="3" fill="currentColor"/><path d="M0-17V-8M0 8V17M-17 0H-8M8 0H17M-12-12L-6-6M12-12L6-6M-12 12L-6 6M12 12L6 6"/>',
  kaleidoscope: '<path d="M0-17L4-5L15-9L7 0L15 9L4 5L0 17L-4 5L-15 9L-7 0L-15-9L-4-5Z"/>',
  tunnel: '<path d="M0-17L17 0L0 17L-17 0ZM0-10L10 0L0 10L-10 0ZM0-4L4 0L0 4L-4 0"/>',
  marbling: '<path d="M0-17C8-7 13-1 13 6A13 13 0 01-13 6C-13-1-8-7 0-17Z"/><path d="M-5 7C-2 10 3 10 6 6"/>',
  metaballs: '<circle cx="-7" cy="-4" r="8"/><circle cx="7" cy="3" r="10"/><circle cx="-6" cy="10" r="5"/>',
  reaction: '<circle cx="-10" cy="8" r="5"/><circle cx="0" cy="-9" r="5"/><circle cx="11" cy="7" r="5"/><path d="M-7 4L-3-5M3-5L8 3M-5 8H6"/>',
  feedback: '<rect x="-15" y="-15" width="20" height="20"/><rect x="-8" y="-8" width="20" height="20"/><rect x="-1" y="-1" width="16" height="16"/>',
  'black-hole': '<path d="M2-17C-13-14-17 0-8 10C1 20 17 12 15-1C13-12 0-13-5-5C-10 3-2 10 5 6C11 3 8-4 3-4"/><circle r="2" fill="currentColor"/>',
  sand: '<path d="M-11-15H11M-11 15H11M-9-14C-9-5-3-4 0 0C3 4 9 5 9 14M9-14C9-5 3-4 0 0C-3 4-9 5-9 14"/><circle cy="8" r="2" fill="currentColor"/>',
  membrane: '<path d="M-15-15V15M-5-15V15M5-15V15M15-15V15M-15-15H15M-15-5H15M-15 5H15M-15 15H15"/><circle r="4" fill="currentColor"/>',
  harmonograph: '<path d="M-15-8C-5-18 5 18 15 8M-15 8C-5 18 5-18 15-8"/><circle r="3"/>',
  fractal: '<path d="M0 17V-2M0-2L-10-12M0-2L10-12M-10-12L-15-6M-10-12L-8-18M10-12L15-6M10-12L8-18M0 7L-7 1M0 7L7 1"/>',
  'loop-recorder': '<path d="M12-9A15 15 0 10 13 8"/><path d="M8 7L14 9L16 3"/><circle r="3" fill="currentColor"/>',
  julia: '<path d="M0 0C12-14 22 4 10 14C-3 24-19 12-17-3C-15-16 1-20 10-12C18-5 12 7 4 8C-4 9-8 1-4-4"/>',
  rorschach: '<path d="M-2-15C-13-13-16-4-9 1C-18 7-10 17-2 11ZM2-15C13-13 16-4 9 1C18 7 10 17 2 11Z"/>',
  chladni: '<path d="M-17-17C-4-5-4 5-17 17M17-17C4-5 4 5 17 17M-17-17C-5-4 5-4 17-17M-17 17C-5 4 5 4 17 17"/>',
  voronoi: '<path d="M-5-16L7-13L16-4L12 10L0 17L-13 10L-16-3ZM-5-16L0 0M7-13L0 0M16-4L0 0M12 10L0 0M0 17L0 0M-13 10L0 0M-16-3L0 0"/>',
  ferrofluid: '<path d="M0-18L4-9L10-15L10-6L18-8L12 0L18 5L9 7L9 16L2 10L-3 18L-6 9L-15 14L-11 5L-18 1L-10-4L-14-12L-5-9Z"/>',
  smoke: '<path d="M-12 14C-20 2-2 2-9-8C-14-16 2-19 4-9C6 0-5 3 1 12C7 20 18 11 13 3C8-4 1 1 3 6"/>',
  caustics: '<circle r="5"/><path d="M-17-6C-9-12 9-12 17-6M-17 2C-9-4 9-4 17 2M-17 10C-9 4 9 4 17 10"/>',
  nbody: '<ellipse rx="17" ry="8" transform="rotate(-25)"/><circle cx="-11" cy="5" r="3" fill="currentColor"/><circle cx="10" cy="-5" r="2" fill="currentColor"/><circle r="4"/>',
  'wave-tank': '<path d="M-18-7C-12-13-6-13 0-7C6-1 12-1 18-7M-18 2C-12-4-6-4 0 2C6 8 12 8 18 2M-18 11C-12 5-6 5 0 11C6 17 12 17 18 11"/>',
  plasma: '<path d="M4-18L-8 1H0L-5 18L12-5H3Z"/>',
  'recursive-windows': '<rect x="-17" y="-17" width="24" height="24"/><rect x="-10" y="-10" width="22" height="22"/><rect x="-3" y="-3" width="18" height="18"/>',
  'delay-grid': '<rect x="-16" y="-16" width="9" height="9"/><rect x="-8" y="-8" width="11" height="11"/><rect x="2" y="2" width="14" height="14"/><path d="M-11-2L-2 7"/>',
  'impossible-room': '<path d="M0-17L15-8V9L0 17L-15 9V-8ZM0-17V0M15-8L0 0M-15-8L0 0M0 0V17"/><path d="M-15 9L0 0L15 9"/>',
  sandpile: '<path d="M0-18L5-13L-5-13ZM0-9L9 0L0 9L-9 0ZM0 12L6 18H-6Z"/><rect x="-2" y="-2" width="4" height="4" fill="currentColor"/>',
  'ghost-choir': '<circle cx="-8" cy="-6" r="6"/><circle cx="0" cy="0" r="8"/><circle cx="9" cy="8" r="10"/>',
  moire: '<circle r="16"/><circle r="11"/><path d="M-16-6H16M-16 0H16M-16 6H16" transform="rotate(18)"/>',
  'magnetic-filaments': '<path d="M0-17V17M-16-8C-5-2-5 2-16 8M16-8C5-2 5 2 16 8"/><circle cy="-10" r="3" fill="currentColor"/><circle cy="10" r="3"/>',
  'pixel-sort': '<path d="M-15-15V9M-9-9V15M-3-17V5M3-4V17M9-13V11M15-17V1"/><path d="M-18 0H18"/>',
  'cellular-garden': '<rect x="-15" y="-15" width="8" height="8" fill="currentColor"/><rect x="-4" y="-4" width="8" height="8"/><rect x="7" y="7" width="8" height="8" fill="currentColor"/><rect x="7" y="-15" width="8" height="8"/><rect x="-15" y="7" width="8" height="8"/>',
  delaunay: '<path d="M0-17L16 10L-15 13ZM0-17L1 1M16 10L1 1M-15 13L1 1"/><circle cx="1" cy="1" r="2" fill="currentColor"/>',
  attractor: '<path d="M0 0C-18-20-24 12-7 14C5 16 7 4 0 0C-7-4-5-16 7-14C24-12 18 20 0 0Z"/>',
  tesseract: '<path d="M-15-15H7V7H-15ZM-7-7H15V15H-7ZM-15-15L-7-7M7-15L15-7M7 7L15 15M-15 7L-7 15"/>',
  aurora: '<path d="M-16-16C-7-8-11 8-16 16M-6-16C5-8-1 8-6 16M5-16C16-8 10 8 5 16M15-16C5-8 12 8 15 16"/>',
  'gravity-lens': '<circle r="14"/><path d="M-18-4C-7-10 7-10 18-4M-18 4C-7 10 7 10 18 4"/><circle r="3" fill="currentColor"/>',
  'prism-rain': '<path d="M0-16L16 12H-16Z"/><path d="M0-18V-8M7 0L18-6M9 6L19 6M6 11L14 18"/>',
  topographic: '<path d="M-17 2C-14-13 8-18 16-7C24 5 7 18-7 15C-19 12-22-3-13-9C-3-16 12-8 11 2C10 11-4 14-10 7C-16 0-7-8 1-6C8-4 8 5 2 7"/>',
  'mirror-maze': '<path d="M-15 9L3-9M2-10L16 4"/><path d="M-17-8H-7V2M7 8H17V18"/><circle cx="3" cy="-9" r="2" fill="currentColor"/>',
  dendrite: '<path d="M-16 15L-5 3M-5 3L-12-8M-5 3L5-4M5-4L2-16M5-4L16-10M-5 3L4 12M4 12L13 15"/>',
  'quantum-slits': '<path d="M-5-17V-5M-5 5V17M5-17V-5M5 5V17"/><path d="M-18-12C-11-5-11 5-18 12M18-12C11-5 11 5 18 12"/><circle r="2" fill="currentColor"/>',
  'voxel-erosion': '<path d="M0-17L15-9V8L0 17L-15 8V-9ZM0 0L15-9M0 0L-15-9M0 0V17"/><path d="M-8-4L0 1L8-4"/>',
};

function cursorMarkup(engineId) {
  return `<svg viewBox="-24 -24 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${cursorShapes[engineId] || cursorShapes.genesis}</svg>`;
}


/** Nom affiché par les engines qui écrivent le titre (word-brush). */
function setTrackName(name) {
  trackName = String(name || '').toUpperCase();
}

// Éléments que les engines attendent du labo : scores de session (Pong, Breakout).
const sessionScores = { pong: { ai: 0, player: 0 }, breakout: { score: 0, best: 0 } };
function updateScoreboard() {
  if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('bf:lab-score', { detail: sessionScores }));
}

export { palettes, seededRandom, clamp, hexToRgb, mixColor, formatTime, fallbackSeed, randomSeed, randomChoice, trackName, trippyShapeCount, createShapeDescriptor, traceTrippyShape, drawTrippyShape, paletteTone, engineCatalog, engineIds, cursorShapes, cursorMarkup, setTrackName, sessionScores, updateScoreboard };
