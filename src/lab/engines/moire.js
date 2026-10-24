// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'moire',
  label: 'MOIRE LENS',
  note: engineCatalog[37].note,
  mount(ctx) {
    const columns = 190, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.moire = {
      columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows),
      x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, polarity: 1, lastRender: 0,
    };
  },
  render(ctx, ts) {
    const m = ctx.moire;
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    const frequency = 24 + ctx.state.density * 0.28;
    const angle = 0.04 + ctx.state.chaos * 0.0017;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    for (let py = 0; py < m.rows; py += 1) {
      for (let px = 0; px < m.columns; px += 1) {
        const x = px / m.columns, y = py / m.rows;
        const dx = x - m.x, dy = (y - m.y) * ctx.height / ctx.width;
        const distanceSq = dx * dx + dy * dy;
        const lens = Math.exp(-distanceSq * (12 + ctx.state.scale * 0.16)) * m.polarity * (0.015 + ctx.state.force * 0.0009);
        const warpedX = x + dx * lens / Math.max(0.018, distanceSq);
        const warpedY = y + dy * lens / Math.max(0.018, distanceSq);
        const first = Math.sin((warpedX * frequency + ts * 0.00008) * Math.PI * 2);
        const second = Math.sin(((warpedX * cos + warpedY * sin) * frequency - ts * 0.00006) * Math.PI * 2);
        const interference = Math.pow(Math.abs((first + second) * 0.5), 4);
        const split = clamp(0.5 + (first - second) * 0.35);
        const offset = (py * m.columns + px) * 4;
        m.image.data[offset] = Math.round(background[0] * (1 - interference) + primary[0] * interference * split + secondary[0] * interference * (1 - split));
        m.image.data[offset + 1] = Math.round(background[1] * (1 - interference) + primary[1] * interference * split + secondary[1] * interference * (1 - split));
        m.image.data[offset + 2] = Math.round(background[2] * (1 - interference) + primary[2] * interference * split + secondary[2] * interference * (1 - split));
        m.image.data[offset + 3] = 255;
      }
    }
    m.drawing.putImageData(m.image, 0, 0);
  },
  frame(ctx, ts) {
    const m = ctx.moire;
    m.x += (m.targetX - m.x) * 0.08; m.y += (m.targetY - m.y) * 0.08;
    if (ts - m.lastRender > 40) { this.render(ctx, ts); m.lastRender = ts; }
    ctx.context.imageSmoothingEnabled = true; ctx.context.drawImage(m.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y) { ctx.moire.targetX = x / ctx.width; ctx.moire.targetY = y / ctx.height; },
  pointerDown(ctx) { ctx.moire.polarity *= -1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.moire; },
});
