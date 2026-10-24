// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'cellular-garden',
  label: 'CELLULAR GARDEN',
  note: engineCatalog[40].note,
  mount(ctx) {
    const columns = 150, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.cellularGarden = {
      columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows),
      cells: new Uint8Array(columns * rows), next: new Uint8Array(columns * rows), lastUpdate: 0,
    };
    for (let cluster = 0; cluster < 18; cluster += 1) this.plant(ctx, ctx.random() * columns, ctx.random() * rows, 2 + Math.floor(ctx.random() * 5));
  },
  plant(ctx, x, y, radius) {
    const g = ctx.cellularGarden;
    for (let oy = -radius; oy <= radius; oy += 1) for (let ox = -radius; ox <= radius; ox += 1) {
      const column = Math.floor(x + ox), row = Math.floor(y + oy);
      if (column >= 0 && column < g.columns && row >= 0 && row < g.rows && ctx.random() > 0.4) g.cells[row * g.columns + column] = 1 + Math.floor(ctx.random() * 3);
    }
  },
  update(ctx) {
    const g = ctx.cellularGarden;
    for (let row = 0; row < g.rows; row += 1) {
      for (let column = 0; column < g.columns; column += 1) {
        let neighbors = 0;
        for (let oy = -1; oy <= 1; oy += 1) for (let ox = -1; ox <= 1; ox += 1) {
          if (ox === 0 && oy === 0) continue;
          const x = (column + ox + g.columns) % g.columns, y = (row + oy + g.rows) % g.rows;
          if (g.cells[y * g.columns + x] > 0) neighbors += 1;
        }
        const index = row * g.columns + column, alive = g.cells[index] > 0;
        g.next[index] = alive && (neighbors === 2 || neighbors === 3) ? Math.min(3, g.cells[index] + 1) : (!alive && neighbors === 3 ? 1 : 0);
      }
    }
    [g.cells, g.next] = [g.next, g.cells];
  },
  frame(ctx, ts) {
    const g = ctx.cellularGarden;
    if (ts - g.lastUpdate > Math.max(28, 125 - ctx.state.speed)) { this.update(ctx); g.lastUpdate = ts; }
    const colors = [hexToRgb(ctx.palette.bg), hexToRgb(ctx.palette.muted), hexToRgb(ctx.palette.primary), hexToRgb(ctx.palette.secondary)];
    for (let index = 0; index < g.cells.length; index += 1) {
      const color = colors[g.cells[index]], offset = index * 4;
      g.image.data[offset] = color[0]; g.image.data[offset + 1] = color[1]; g.image.data[offset + 2] = color[2]; g.image.data[offset + 3] = 255;
    }
    g.drawing.putImageData(g.image, 0, 0);
    ctx.context.imageSmoothingEnabled = false; ctx.context.drawImage(g.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y, speed) { if (speed > 3) this.plant(ctx, x / ctx.width * ctx.cellularGarden.columns, y / ctx.height * ctx.cellularGarden.rows, 1 + Math.floor(ctx.state.force / 30)); },
  pointerDown(ctx, x, y) { this.plant(ctx, x / ctx.width * ctx.cellularGarden.columns, y / ctx.height * ctx.cellularGarden.rows, 6 + Math.floor(ctx.state.scale / 15)); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.cellularGarden; },
});
