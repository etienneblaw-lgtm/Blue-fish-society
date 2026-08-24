# Bluefish Society - Design System

Source : `../WANO Terminal Design System`.

## Principes

- Site terminal, pas site vitrine.
- Fond noir pur.
- Monospace unique : `JetBrains Mono`.
- Accent fonctionnel turquoise phosphore : `#1ff3e0`.
- Accent marque Bluefish : `#1ec8c8`.
- Pas d'emoji.
- Pas d'ombres.
- Pas de radius, sauf knob de volume.
- Tout est structure par bordures `1px`, ASCII, glyphes et texte.
- Motion minimale : curseur blink, manifesto typewriter, waveform player.

## Tokens

Les tokens sont centralises dans `src/styles/tokens.css`.

Les noms gardent le prefixe historique `--wano-*`, mais les valeurs visibles sont celles du rebrand Bluefish.

## Composants Astro

- `BaseLayout.astro` : layout global, meta, styles.
- `SiteHeader.astro` : header sticky.
- `TrackCard.astro` : carte de mix avec art ASCII deterministe.
- `BrandFish.astro` : marque poisson ASCII.
- `TerminalFrame.astro` : cadre ASCII simple.

## Pages MVP

- `/` : sas d'entree nominatif.
- `/menu` : menu principal apres identification.
- `/tracks` : catalogue des mixes, recherche, filtres, player audio global.
- `/mixes/[slug]` : page detail de mix, base pour les oeuvres ASCII uniques.

## Regles pour la suite

- Ne pas coder chaque page de mix comme une exception complete.
- Personnaliser par donnees : theme, motifs ASCII, phrase manifeste, symboles, couleurs restreintes.
- Garder l'audio fiable avant d'ajouter des effets visuels lourds.
- Garder les pages rapides, statiques et maintenables par IA.
