// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'topographic',
  label: 'TOPOGRAPHIC DRIFT',
  note: engineCatalog[47].note,
  mount(ctx) {
    const columns = 190, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.topographic = { columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows), peaks: [], x: 0.5, y: 0.5, lastRender: 0 };
  },
  render(ctx, ts) {
    const t = ctx.topographic;
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    const levels = 7 + Math.floor(ctx.state.density / 8);
    for (let py = 0; py < t.rows; py += 1) for (let px = 0; px < t.columns; px += 1) {
      const x = px / t.columns, y = py / t.rows;
      let height = Math.sin(x * 12 + ts * 0.00018) * 0.24 + Math.cos(y * 15 - ts * 0.00013) * 0.2 + Math.sin((x + y) * 21) * 0.1;
      const peaks = [...t.peaks, { x: t.x, y: t.y, force: 1 }];
      peaks.forEach((peak) => {
        const dx = x - peak.x, dy = (y - peak.y) * ctx.height / ctx.width;
        height += Math.exp(-(dx * dx + dy * dy) * (18 + ctx.state.scale * 0.15)) * peak.force * (0.8 + ctx.state.force * 0.014);
      });
      const band = Math.abs((height * levels - Math.floor(height * levels)) - 0.5);
      const line = Math.pow(clamp(1 - band * (14 + ctx.state.chaos * 0.08)), 3);
      const fill = clamp((height + 1.1) * 0.12) * 0.22;
      const intensity = clamp(line + fill);
      const offset = (py * t.columns + px) * 4;
      t.image.data[offset] = Math.round(background[0] * (1 - intensity) + primary[0] * line + secondary[0] * fill);
      t.image.data[offset + 1] = Math.round(background[1] * (1 - intensity) + primary[1] * line + secondary[1] * fill);
      t.image.data[offset + 2] = Math.round(background[2] * (1 - intensity) + primary[2] * line + secondary[2] * fill);
      t.image.data[offset + 3] = 255;
    }
    t.drawing.putImageData(t.image, 0, 0);
  },
  frame(ctx, ts) {
    if (ts - ctx.topographic.lastRender > 45) { this.render(ctx, ts); ctx.topographic.lastRender = ts; }
    ctx.context.imageSmoothingEnabled = true; ctx.context.drawImage(ctx.topographic.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove(ctx, x, y) { ctx.topographic.x = x / ctx.width; ctx.topographic.y = y / ctx.height; },
  pointerDown(ctx, x, y) { ctx.topographic.peaks.push({ x: x / ctx.width, y: y / ctx.height, force: 0.7 + ctx.state.force * 0.012 }); if (ctx.topographic.peaks.length > 7) ctx.topographic.peaks.shift(); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.topographic; },
});
