// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'wave-tank',
  label: 'WAVE TANK',
  note: engineCatalog[30].note,
  mount(ctx) {
    const columns = 150, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.waveTank = {
      columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows),
      current: new Float32Array(columns * rows), previous: new Float32Array(columns * rows), next: new Float32Array(columns * rows), lastAuto: 0,
    };
    this.disturb(ctx, columns / 2, rows / 2, 1.8);
    for (let index = 0; index < 7; index += 1) this.disturb(ctx, ctx.random() * columns, ctx.random() * rows, 0.7 + ctx.random() * 1.1);
  },
  disturb(ctx, x, y, strength) {
    const w = ctx.waveTank;
    const radius = 2 + Math.floor(ctx.state.force / 22);
    for (let oy = -radius; oy <= radius; oy += 1) {
      for (let ox = -radius; ox <= radius; ox += 1) {
        const column = Math.floor(x + ox), row = Math.floor(y + oy);
        if (column > 1 && column < w.columns - 1 && row > 1 && row < w.rows - 1) w.current[row * w.columns + column] += strength * Math.cos(Math.hypot(ox, oy) / radius * Math.PI / 2);
      }
    }
  },
  frame(ctx, ts) {
    const w = ctx.waveTank;
    if (!ctx.audio.paused && ts - w.lastAuto > 380) { this.disturb(ctx, ctx.random() * w.columns, ctx.random() * w.rows, 0.8); w.lastAuto = ts; }
    const damping = 0.982 + ctx.state.persistence * 0.00014;
    for (let row = 1; row < w.rows - 1; row += 1) {
      for (let column = 1; column < w.columns - 1; column += 1) {
        const index = row * w.columns + column;
        w.next[index] = ((w.current[index - 1] + w.current[index + 1] + w.current[index - w.columns] + w.current[index + w.columns]) * 0.5 - w.previous[index]) * damping;
      }
    }
    [w.previous, w.current, w.next] = [w.current, w.next, w.previous];
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    for (let index = 0; index < w.current.length; index += 1) {
      const value = clamp(w.current[index] * 0.55 + 0.5);
      const edge = Math.min(1, Math.abs(w.current[index]) * 2.4);
      const offset = index * 4;
      w.image.data[offset] = Math.round(background[0] * (1 - edge) + primary[0] * edge * value + secondary[0] * edge * (1 - value));
      w.image.data[offset + 1] = Math.round(background[1] * (1 - edge) + primary[1] * edge * value + secondary[1] * edge * (1 - value));
      w.image.data[offset + 2] = Math.round(background[2] * (1 - edge) + primary[2] * edge * value + secondary[2] * edge * (1 - value));
      w.image.data[offset + 3] = 255;
    }
    w.drawing.putImageData(w.image, 0, 0);
    ctx.context.imageSmoothingEnabled = true; ctx.context.drawImage(w.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y, speed) { if (speed > 5) this.disturb(ctx, x / ctx.width * ctx.waveTank.columns, y / ctx.height * ctx.waveTank.rows, Math.min(1.4, speed / 35)); },
  pointerDown(ctx, x, y) { this.disturb(ctx, x / ctx.width * ctx.waveTank.columns, y / ctx.height * ctx.waveTank.rows, 2.4); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.waveTank; },
});
