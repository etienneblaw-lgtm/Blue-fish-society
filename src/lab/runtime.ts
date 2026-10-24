// Affiche une recette du laboratoire sur une page de mix.
// Reprend la logique de bluefish-experience-lab/app.js (montage, palette, souris, boucle),
// mais ne charge que l'engine de la recette.
// @ts-nocheck : les engines générés sont en JavaScript sans types.

import { palettes, seededRandom, clamp, mixColor, hexToRgb, formatTime, paletteTone, cursorMarkup, setTrackName } from './shared.js';
import type { LabRecipe } from './recipe';

const loaders = import.meta.glob('./engines/*.js');

const ART_SLIDERS = ['density', 'speed', 'chaos', 'scale', 'force', 'persistence'] as const;

const percent = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, Math.round(number * 100))) : fallback;
};

/** Recette du labo vers l'état interne des engines (mêmes règles que applyRecipe du labo). */
function recipeToState(recipe: LabRecipe) {
  const state: Record<string, any> = {
    engine: recipe.engine,
    interaction: ['erase', 'repel', 'attract'].includes(recipe.interaction) ? recipe.interaction : 'erase',
    memory: ['evaporate', 'heal', 'accumulate'].includes(recipe.memory) ? recipe.memory : 'heal',
    palette: palettes[recipe.palette] ? recipe.palette : 'bluefish',
    density: 58, speed: 24, chaos: 46, scale: 42, force: 62, persistence: 38,
    colorSpread: 72, colorSeed: 3589426968, seed: 14271,
  };
  ART_SLIDERS.forEach((key) => { state[key] = percent(recipe.parameters?.[key], state[key]); });
  if (recipe.colors) {
    const colorSeed = Number(recipe.colors.seed);
    if (Number.isFinite(colorSeed)) state.colorSeed = colorSeed >>> 0;
    state.colorSpread = percent(recipe.colors.spread, state.colorSpread);
  }
  const seed = Number(recipe.seed);
  if (Number.isFinite(seed)) state.seed = seed >>> 0;
  return state;
}

function resolvePalette(state: Record<string, any>) {
  const base = palettes[state.palette];
  const source = base.accents;
  const offset = state.colorSeed % source.length;
  const count = 2 + Math.round((source.length - 2) * state.colorSpread / 100);
  const accents = Array.from({ length: count }, (_, index) => source[(offset + index) % source.length]);
  return { ...base, primary: accents[0], secondary: accents[1], accents };
}

export function hasEngine(id: string) {
  return Boolean(loaders[`./engines/${id}.js`]);
}

interface MountOptions {
  audio: HTMLAudioElement;
  title: string;
  signal: AbortSignal;
}

/**
 * Monte l'œuvre dans `root` (qui contient canvas.lab-canvas, .lab-layer, .lab-cursor).
 * Tout est démonté quand `signal` est annulé (changement de page).
 */
export async function mountRecipe(root: HTMLElement, recipe: LabRecipe, { audio, title, signal }: MountOptions) {
  const loader = loaders[`./engines/${recipe.engine}.js`];
  if (!loader) throw new Error(`Engine inconnu : ${recipe.engine}`);
  const engine = (await loader()).default;
  if (signal.aborted) return;

  setTrackName(title);
  const canvas = root.querySelector<HTMLCanvasElement>('.lab-canvas')!;
  const layer = root.querySelector<HTMLElement>('.lab-layer')!;
  const cursor = root.querySelector<HTMLElement>('.lab-cursor')!;
  const context = canvas.getContext('2d')!;
  const state = recipeToState(recipe);
  const palette = resolvePalette(state);
  const pointer = { x: -1000, y: -1000, active: false, down: false, speed: 0, lastX: 0, lastY: 0 };
  const ctx: Record<string, any> = { hideCursor: false };
  let width = window.innerWidth;
  let height = window.innerHeight;
  let frameId = 0;
  let lastFrame = performance.now();
  let mounted = false;

  const buildCtx = () =>
    Object.assign(ctx, {
      canvas, context, width, height, state, palette, audio, pointer, layer,
      utils: { clamp, mixColor, hexToRgb, formatTime, paletteTone },
    });

  function mount() {
    const c = buildCtx();
    if (mounted) engine.unmount(c);
    layer.innerHTML = '';
    layer.style.background = 'transparent';
    c.random = seededRandom(state.seed); // même seed = même œuvre au départ
    c.hideCursor = false;
    engine.mount(c);
    mounted = true;
    root.classList.toggle('hide-cursor', Boolean(c.hideCursor));
    cursor.innerHTML = cursorMarkup(state.engine);
    cursor.style.color = palette.primary;
    if (!audio.paused) engine.play(c);
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    mount();
  }

  function loop(ts: number) {
    const dt = Math.min(34, ts - lastFrame);
    lastFrame = ts;
    try {
      engine.frame(buildCtx(), ts, dt);
    } catch (error) {
      console.error('[bluefish lab] erreur de rendu', error);
      return; // on fige l'œuvre plutôt que d'enchaîner les erreurs
    }
    frameId = requestAnimationFrame(loop);
  }

  // La souris ne pilote l'œuvre que hors des zones d'interface (textes, boutons, lecteur).
  const isUi = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest('.ui, a, button, input, .bf-player, .site-header'));

  const on = (target: EventTarget, type: string, handler: (event: any) => void) =>
    target.addEventListener(type, handler, { signal });

  on(document, 'pointermove', (event: PointerEvent) => {
    const overUi = isUi(event.target);
    root.classList.toggle('over-ui', overUi);
    pointer.active = !overUi && event.pointerType === 'mouse';
    const dx = event.clientX - pointer.lastX;
    const dy = event.clientY - pointer.lastY;
    pointer.speed = Math.sqrt(dx * dx + dy * dy);
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (pointer.active) {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add('visible');
      engine.pointerMove(buildCtx(), event.clientX, event.clientY, pointer.speed);
    } else {
      cursor.classList.remove('visible');
    }
  });
  on(document, 'pointerdown', (event: PointerEvent) => {
    if (isUi(event.target)) return;
    pointer.down = true;
    cursor.classList.add('active');
    engine.pointerDown(buildCtx(), event.clientX, event.clientY);
  });
  on(window, 'pointerup', () => {
    pointer.down = false;
    cursor.classList.remove('active');
    engine.pointerUp(buildCtx());
  });
  on(document, 'pointerleave', () => {
    pointer.active = false;
    cursor.classList.remove('visible');
  });
  on(window, 'resize', resize);
  on(audio, 'play', () => engine.play(buildCtx()));
  on(audio, 'pause', () => engine.pause(buildCtx()));

  signal.addEventListener(
    'abort',
    () => {
      cancelAnimationFrame(frameId);
      try {
        engine.unmount(buildCtx());
      } catch {
        // l'engine est déjà détaché
      }
      layer.innerHTML = '';
    },
    { once: true },
  );

  resize();
  frameId = requestAnimationFrame(loop);
}
