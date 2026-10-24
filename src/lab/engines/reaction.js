// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'reaction',
  label: 'REACTION DIFFUSION',
  note: engineCatalog[14].note,
  mount(ctx) {
    const columns = Math.max(90, Math.min(180, Math.round(ctx.width / 9)));
    const rows = Math.max(55, Math.round(columns * ctx.height / ctx.width));
    const size = columns * rows;
    const a = new Float32Array(size); a.fill(1);
    const b = new Float32Array(size);
    const nextA = new Float32Array(size); const nextB = new Float32Array(size);
    const cv = document.createElement('canvas'); cv.width = columns; cv.height = rows;
    const cvContext = cv.getContext('2d');
    ctx.reaction = { columns, rows, a, b, nextA, nextB, canvas: cv, context: cvContext, image: cvContext.createImageData(columns, rows) };
    for (let seed = 0; seed < 8; seed += 1) {
      this.seed(ctx, ctx.random() * columns, ctx.random() * rows, 3 + ctx.random() * 6);
    }
  },
  seed(ctx, x, y, radius) {
    const r = ctx.reaction;
    for (let oy = -radius; oy <= radius; oy += 1) {
      for (let ox = -radius; ox <= radius; ox += 1) {
        if (ox * ox + oy * oy > radius * radius) continue;
        const column = Math.floor(x + ox); const row = Math.floor(y + oy);
        if (column >= 0 && column < r.columns && row >= 0 && row < r.rows) r.b[row * r.columns + column] = 1;
      }
    }
  },
  simulate(ctx) {
    const r = ctx.reaction;
    const feed = 0.028 + ctx.state.density * 0.00012;
    const kill = 0.053 + ctx.state.chaos * 0.0001;
    for (let row = 1; row < r.rows - 1; row += 1) {
      for (let column = 1; column < r.columns - 1; column += 1) {
        const index = row * r.columns + column;
        const a = r.a[index], b = r.b[index];
        const lapA = r.a[index - 1] + r.a[index + 1] + r.a[index - r.columns] + r.a[index + r.columns] - 4 * a;
        const lapB = r.b[index - 1] + r.b[index + 1] + r.b[index - r.columns] + r.b[index + r.columns] - 4 * b;
        const reaction = a * b * b;
        r.nextA[index] = clamp(a + 0.92 * lapA - reaction + feed * (1 - a));
        r.nextB[index] = clamp(b + 0.46 * lapB + reaction - (kill + feed) * b);
      }
    }
    [r.a, r.nextA] = [r.nextA, r.a];
    [r.b, r.nextB] = [r.nextB, r.b];
  },
  frame(ctx) {
    const r = ctx.reaction;
    const steps = 2 + Math.floor(ctx.state.speed / 35) + (ctx.audio.paused ? 0 : 1);
    for (let index = 0; index < steps; index += 1) this.simulate(ctx);
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    for (let index = 0; index < r.a.length; index += 1) {
      const value = clamp((r.a[index] - r.b[index]) * 1.6);
      const middle = Math.sin(value * Math.PI);
      const offset = index * 4;
      r.image.data[offset] = Math.round(background[0] * value + primary[0] * (1 - value) + secondary[0] * middle * 0.35);
      r.image.data[offset + 1] = Math.round(background[1] * value + primary[1] * (1 - value) + secondary[1] * middle * 0.35);
      r.image.data[offset + 2] = Math.round(background[2] * value + primary[2] * (1 - value) + secondary[2] * middle * 0.35);
      r.image.data[offset + 3] = 255;
    }
    r.context.putImageData(r.image, 0, 0);
    ctx.context.imageSmoothingEnabled = false;
    ctx.context.drawImage(r.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y) { this.seed(ctx, x / ctx.width * ctx.reaction.columns, y / ctx.height * ctx.reaction.rows, 2 + ctx.state.force / 16); },
  pointerDown(ctx, x, y) { this.pointerMove(ctx, x, y); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.reaction; },
});
