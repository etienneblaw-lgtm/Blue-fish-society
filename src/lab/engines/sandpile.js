// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'sandpile',
  label: 'SANDPILE AVALANCHE',
  note: engineCatalog[35].note,
  mount(ctx) {
    const columns = 150, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.sandpile = { columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows), cells: new Uint16Array(columns * rows), next: new Uint16Array(columns * rows), lastDrop: 0 };
    this.add(ctx, columns / 2, rows / 2, 22000);
    for (let index = 0; index < 8; index += 1) this.add(ctx, ctx.random() * columns, ctx.random() * rows, 3500 + Math.floor(ctx.random() * 6000));
  },
  add(ctx, x, y, amount) {
    const s = ctx.sandpile;
    const column = Math.max(1, Math.min(s.columns - 2, Math.floor(x))), row = Math.max(1, Math.min(s.rows - 2, Math.floor(y)));
    s.cells[row * s.columns + column] = Math.min(65535, s.cells[row * s.columns + column] + amount);
  },
  topple(ctx) {
    const s = ctx.sandpile;
    s.next.set(s.cells);
    let changed = false;
    for (let row = 1; row < s.rows - 1; row += 1) {
      for (let column = 1; column < s.columns - 1; column += 1) {
        const index = row * s.columns + column;
        if (s.cells[index] < 4) continue;
        const amount = Math.floor(s.cells[index] / 4);
        s.next[index] -= amount * 4;
        s.next[index - 1] += amount; s.next[index + 1] += amount; s.next[index - s.columns] += amount; s.next[index + s.columns] += amount;
        changed = true;
      }
    }
    [s.cells, s.next] = [s.next, s.cells];
    return changed;
  },
  frame(ctx, ts) {
    const s = ctx.sandpile;
    if (!ctx.audio.paused && ts - s.lastDrop > 260) { this.add(ctx, ctx.random() * s.columns, ctx.random() * s.rows, 90 + ctx.state.force * 3); s.lastDrop = ts; }
    const iterations = 7 + Math.floor(ctx.state.speed / 9);
    for (let index = 0; index < iterations; index += 1) this.topple(ctx);
    const colors = [hexToRgb(ctx.palette.bg), hexToRgb(ctx.palette.muted), hexToRgb(ctx.palette.primary), hexToRgb(ctx.palette.secondary)];
    for (let index = 0; index < s.cells.length; index += 1) {
      const color = colors[s.cells[index] % 4], offset = index * 4;
      s.image.data[offset] = color[0]; s.image.data[offset + 1] = color[1]; s.image.data[offset + 2] = color[2]; s.image.data[offset + 3] = 255;
    }
    s.drawing.putImageData(s.image, 0, 0);
    ctx.context.imageSmoothingEnabled = false; ctx.context.drawImage(s.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y, speed) { if (speed > 4) this.add(ctx, x / ctx.width * ctx.sandpile.columns, y / ctx.height * ctx.sandpile.rows, 8 + Math.floor(speed)); },
  pointerDown(ctx, x, y) { this.add(ctx, x / ctx.width * ctx.sandpile.columns, y / ctx.height * ctx.sandpile.rows, 1000 + ctx.state.force * 30); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.sandpile; },
});
