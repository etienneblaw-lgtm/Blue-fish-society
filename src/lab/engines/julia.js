// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'julia',
  label: 'JULIA NAVIGATOR',
  note: engineCatalog[22].note,
  mount(ctx) {
    const columns = Math.max(150, Math.min(230, Math.round(ctx.width / 7)));
    const rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.julia = {
      canvas, drawing, image: drawing.createImageData(columns, rows), columns, rows,
      cx: -0.72, cy: 0.255, centerX: 0, centerY: 0, zoom: 1, lastRender: 0,
    };
  },
  render(ctx, ts) {
    const j = ctx.julia;
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    const maxIterations = 38 + Math.floor(ctx.state.scale * 0.35);
    const audioShift = ctx.audio.paused ? 0 : Math.sin(ts * 0.0007) * 0.018;
    for (let py = 0; py < j.rows; py += 1) {
      for (let px = 0; px < j.columns; px += 1) {
        let zx = (px - j.columns / 2) / (0.36 * j.zoom * j.columns) + j.centerX;
        let zy = (py - j.rows / 2) / (0.36 * j.zoom * j.columns) + j.centerY;
        let iteration = 0;
        while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
          const nextX = zx * zx - zy * zy + j.cx + audioShift;
          zy = 2 * zx * zy + j.cy;
          zx = nextX;
          iteration += 1;
        }
        const offset = (py * j.columns + px) * 4;
        const amount = iteration === maxIterations ? 0 : iteration / maxIterations;
        const wave = 0.5 + Math.sin(amount * Math.PI * (3 + ctx.state.chaos / 18)) * 0.5;
        j.image.data[offset] = Math.round(background[0] * (1 - amount) + primary[0] * amount + secondary[0] * wave * amount * 0.45);
        j.image.data[offset + 1] = Math.round(background[1] * (1 - amount) + primary[1] * amount + secondary[1] * wave * amount * 0.45);
        j.image.data[offset + 2] = Math.round(background[2] * (1 - amount) + primary[2] * amount + secondary[2] * wave * amount * 0.45);
        j.image.data[offset + 3] = 255;
      }
    }
    j.drawing.putImageData(j.image, 0, 0);
  },
  frame(ctx, ts) {
    if (ts - ctx.julia.lastRender > Math.max(32, 110 - ctx.state.speed)) {
      this.render(ctx, ts);
      ctx.julia.lastRender = ts;
    }
    ctx.context.imageSmoothingEnabled = false;
    ctx.context.drawImage(ctx.julia.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y) { ctx.julia.cx = (x / ctx.width - 0.5) * 1.65; ctx.julia.cy = (y / ctx.height - 0.5) * 1.35; },
  pointerDown(ctx, x, y) {
    ctx.julia.centerX += (x / ctx.width - 0.5) * 2.2 / ctx.julia.zoom;
    ctx.julia.centerY += (y / ctx.height - 0.5) * 1.3 / ctx.julia.zoom;
    ctx.julia.zoom *= 1.75;
    if (ctx.julia.zoom > 45) { ctx.julia.zoom = 1; ctx.julia.centerX = 0; ctx.julia.centerY = 0; }
  },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.julia; },
});
