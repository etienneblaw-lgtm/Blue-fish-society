// Avec la navigation sans rechargement (ClientRouter), un <script> de page ne s'exécute
// qu'une fois par session. `onPage` relance l'initialisation à chaque visite de la page
// et coupe tout ce qu'elle a branché quand on la quitte.

export interface PageContext {
  signal: AbortSignal;
  /** Pause qui ne se résout jamais si la page est quittée : stoppe proprement les animations en chaîne. */
  wait: (ms: number) => Promise<void>;
}

export function onPage(selector: string, init: (root: HTMLElement, ctx: PageContext) => void) {
  const boot = () => {
    const root = document.querySelector<HTMLElement>(selector);
    if (!root || root.dataset.booted) return;
    root.dataset.booted = '1';

    const controller = new AbortController();
    const { signal } = controller;
    document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        if (signal.aborted) return;
        const id = window.setTimeout(() => {
          if (!signal.aborted) resolve();
        }, ms);
        signal.addEventListener('abort', () => window.clearTimeout(id), { once: true });
      });

    init(root, { signal, wait });
  };

  boot();
  document.addEventListener('astro:page-load', boot);
}
