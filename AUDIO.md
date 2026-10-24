# Audio et radio

Doc complète (décisions, raisons, limites) : `Second Cerveau/2 - Projets/Blue Fish Society/Radio et audio.md`.

## Principe

- MP3 320 kbit/s servis depuis Cloudflare R2. Le WAV reste l'original archivé.
- La radio est calculée sur l'heure (`src/lib/radio.ts`). Même liste + même heure = même mix, même position, pour tous. Aucun serveur de streaming.
- Un seul lecteur (`src/components/RadioPlayer.astro`), persistant entre les pages grâce à `ClientRouter` et `transition:persist`.

## Ajouter un mix

1. `node Script/prepare_mix.mjs "<chemin du WAV>" <slug>` depuis la racine du workspace.
2. Envoyer `Script/output/audio/<slug>.mp3` à la racine du bucket R2.
3. Ajouter l'entrée dans `src/data/tracks.ts` avec `src`, `durationSec` et `duration` affichés par le script.
4. `npm run build`, commit, push sur `main`. Cloudflare Pages redéploie.

Un mix sans `src` ou sans `durationSec` s'affiche dans l'archive mais ne passe pas à la radio.

## Règles à respecter

- Ne pas changer `RADIO_EPOCH` dans `src/lib/radio.ts` : ça décale toute la diffusion.
- Ajouter ou retirer un mix recale la grille au déploiement (un saut pour les auditeurs en cours).
- Chaque page avec un `<script>` l'enveloppe dans `onPage('<repère unique>', ...)` (`src/lib/page.ts`). Le repère doit exister sur cette page seulement, sinon l'initialisation se déclenche sur les autres pages.
- Pas de `window.location.href` pour naviguer entre pages : utiliser `navigate()` de `astro:transitions/client`, sinon le son coupe.
- Les pages qui doivent rester sans lecteur (sas d'entrée, lab) passent `entry` à `BaseLayout`.

## API du lecteur

`window.bfPlayer` : `start()`, `playMix(slug)`, `tuneIn()`, `togglePlay()`, `toggleMute()`, `state()`.
Événement `bf:player-state` sur `document` (détail : `mode`, `state`, `slug`, `muted`).

## Préférences mémorisées

`localStorage['bluefish.audio']` : `muted`, `volume`, `radioOff` (la radio a été mise en pause).
