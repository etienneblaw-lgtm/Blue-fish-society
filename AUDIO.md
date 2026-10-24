# Audio et radio

Doc complète (décisions, raisons, limites) : `Second Cerveau/2 - Projets/Blue Fish Society/Radio et audio.md`.

## Principe

- MP3 320 kbit/s servis depuis Cloudflare R2. Le WAV reste l'original archivé.
- La radio est calculée sur l'heure (`src/lib/radio.ts`). Même liste + même heure = même mix, même position, pour tous. Aucun serveur de streaming.
- Un seul lecteur (`src/components/RadioPlayer.astro`), persistant entre les pages grâce à `ClientRouter` et `transition:persist`.

## Ajouter un mix

Passer par le skill `fish-bluefish-add-mix` (« publie le mix de [artiste] »). Il s'appuie sur :

```bash
node Script/bluefish_add_mix.mjs --input <fichier.json>
```

Le script valide l'entrée, convertit en MP3 320 (MP3 fourni gardé tel quel), mesure la durée, envoie sur R2 (`wano/mixes/<slug>.mp3`, wrangler déjà connecté), ajoute l'entrée dans `src/data/tracks.ts` avec la recette du labo, puis construit le site. Reste : commit de `tracks.ts` et push.

Un mix sans `src` ou sans `durationSec` s'affiche dans l'archive mais ne passe pas à la radio.

## Page de mix et labo

- `track.lab` = recette du labo (COPY CONFIG ou lien COPY LINK décodé). Si présente, `/mixes/<slug>` affiche l'œuvre en plein écran, sinon l'art ASCII.
- `src/lab/engines/<id>.js` et `src/lab/shared.js` sont générés depuis `bluefish-experience-lab/app.js` par `node Script/bluefish_sync_lab_engines.mjs`. Ne pas les modifier à la main : modifier le labo, puis relancer.
- `src/lab/runtime.ts` monte la recette : seul l'engine de la recette est chargé. Même recette = même œuvre de départ.
- L'œuvre réagit au lecteur du site (lecture, pause) et à la souris hors des zones d'interface.

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
