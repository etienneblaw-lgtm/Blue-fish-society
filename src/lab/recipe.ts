// Recette du laboratoire Bluefish : ce que le bouton COPY CONFIG du labo produit.
// Le lien COPY LINK contient la même recette, encodée dans ?recipe=.

export interface LabRecipe {
  engine: string;
  interaction: 'erase' | 'repel' | 'attract';
  memory: 'evaporate' | 'heal' | 'accumulate';
  palette: string;
  colors: { seed: number; spread: number };
  parameters: {
    density: number;
    speed: number;
    chaos: number;
    scale: number;
    force: number;
    persistence: number;
  };
  seed: number;
}
