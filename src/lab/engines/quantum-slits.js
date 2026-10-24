// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'quantum-slits',
  label: 'QUANTUM SLITS',
  note: engineCatalog[50].note,
  mount(ctx) {
    const columns = 190, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.quantumSlits = { columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows), gap: 0.13, targetGap: 0.13, phase: 0, targetPhase: 0, lastRender: 0 };
  },
  render(ctx, ts) {
    const q = ctx.quantumSlits;
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    const frequency = 35 + ctx.state.scale * 0.4;
    for (let py = 0; py < q.rows; py += 1) for (let px = 0; px < q.columns; px += 1) {
      const x = px / q.columns, y = py / q.rows;
      let intensity = 0;
      if (y > 0.18) {
        const r1 = Math.hypot(x - (0.5 - q.gap), (y - 0.18) * ctx.height / ctx.width);
        const r2 = Math.hypot(x - (0.5 + q.gap), (y - 0.18) * ctx.height / ctx.width);
        const wave = Math.sin(r1 * frequency - ts * 0.003) + Math.sin(r2 * frequency - ts * 0.003 + q.phase);
        intensity = Math.pow(Math.abs(wave * 0.5), 3) * clamp((y - 0.12) * 2.2);
      }
      const split = 0.5 + Math.sin((x - 0.5) * frequency + q.phase) * 0.5;
      const offset = (py * q.columns + px) * 4;
      q.image.data[offset] = Math.round(background[0] * (1 - intensity) + primary[0] * intensity * split + secondary[0] * intensity * (1 - split));
      q.image.data[offset + 1] = Math.round(background[1] * (1 - intensity) + primary[1] * intensity * split + secondary[1] * intensity * (1 - split));
      q.image.data[offset + 2] = Math.round(background[2] * (1 - intensity) + primary[2] * intensity * split + secondary[2] * intensity * (1 - split));
      q.image.data[offset + 3] = 255;
    }
    q.drawing.putImageData(q.image, 0, 0);
  },
  frame(ctx, ts) {
    const q = ctx.quantumSlits;
    q.gap += (q.targetGap - q.gap) * 0.08; q.phase += (q.targetPhase - q.phase) * 0.08;
    if (ts - q.lastRender > 40) { this.render(ctx, ts); q.lastRender = ts; }
    ctx.context.imageSmoothingEnabled = true; ctx.context.drawImage(q.canvas, 0, 0, ctx.width, ctx.height);
    const c = ctx.context, barrierY = ctx.height * 0.18, gapWidth = 8 + ctx.state.force * 0.08;
    c.strokeStyle = ctx.palette.primary; c.globalAlpha = 0.7; c.lineWidth = 2;
    const firstX = ctx.width * (0.5 - q.gap), secondX = ctx.width * (0.5 + q.gap);
    [[0, firstX - gapWidth], [firstX + gapWidth, secondX - gapWidth], [secondX + gapWidth, ctx.width]].forEach(([from, to]) => { c.beginPath(); c.moveTo(from, barrierY); c.lineTo(to, barrierY); c.stroke(); });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.quantumSlits.targetGap = 0.035 + x / ctx.width * 0.21; ctx.quantumSlits.targetPhase = (y / ctx.height - 0.5) * Math.PI * 2; },
  pointerDown(ctx) { ctx.quantumSlits.targetPhase += Math.PI; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.quantumSlits; },
});
