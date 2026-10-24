// Moteur de la radio Bluefish : aucune requête serveur, tout est calculé à partir de l'heure.
// Même liste + même heure = même mix, au même endroit, pour tout le monde.

/** Début du temps radio (secondes Unix). Ne pas changer : ça décale toute la diffusion. */
export const RADIO_EPOCH = Date.UTC(2026, 0, 1) / 1000;

export interface RadioItem {
  id: string;
  durationSec: number;
}

export interface NowPlaying {
  item: RadioItem;
  /** Position dans le mix, en secondes. */
  offsetSec: number;
  /** Secondes restantes avant le mix suivant. */
  remainingSec: number;
  /** Numéro du tour complet de la liste. */
  cycle: number;
}

/** Petit générateur pseudo-aléatoire déterministe (mulberry32). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rawShuffle(items: RadioItem[], cycle: number): RadioItem[] {
  const list = [...items];
  const random = mulberry32(cycle * 2654435761 + 12345);
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/**
 * Ordre de lecture d'un tour. Mélangé de façon déterministe, sans jamais enchaîner
 * deux fois le même mix à la jonction de deux tours (à partir de 3 mixes).
 * Les items sont triés par id d'abord : l'ordre de la liste source n'a pas d'effet.
 */
export function cycleOrder(items: RadioItem[], cycle: number): RadioItem[] {
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));
  if (sorted.length <= 2) return sorted;
  const order = rawShuffle(sorted, cycle);
  if (cycle > 0) {
    const previousLast = rawShuffle(sorted, cycle - 1).at(-1);
    if (order[0].id === previousLast?.id) [order[0], order[1]] = [order[1], order[0]];
  }
  return order;
}

/** Durée totale d'un tour, en secondes. */
export function cycleLength(items: RadioItem[]): number {
  return items.reduce((sum, item) => sum + item.durationSec, 0);
}

/** Ce qui passe à l'antenne à l'instant `nowSec` (secondes Unix). Null si la liste est vide. */
export function nowPlaying(items: RadioItem[], nowSec: number): NowPlaying | null {
  const playable = items.filter((item) => item.durationSec > 0);
  const total = cycleLength(playable);
  if (!playable.length || total <= 0) return null;

  const elapsed = Math.max(0, nowSec - RADIO_EPOCH);
  const cycle = Math.floor(elapsed / total);
  let cursor = elapsed - cycle * total;

  for (const item of cycleOrder(playable, cycle)) {
    if (cursor < item.durationSec) {
      return { item, offsetSec: cursor, remainingSec: item.durationSec - cursor, cycle };
    }
    cursor -= item.durationSec;
  }
  // Garde-fou contre les erreurs d'arrondi : on retombe sur le dernier mix, à sa fin.
  const last = cycleOrder(playable, cycle).at(-1)!;
  return { item: last, offsetSec: last.durationSec, remainingSec: 0, cycle };
}

export function formatClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}
