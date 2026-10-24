// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'rorschach',
  label: 'RORSCHACH REACTOR',
  note: engineCatalog[23].note,
  mount(ctx) {
    const canvas = document.createElement('canvas'); canvas.width = ctx.width; canvas.height = ctx.height;
    const ink = canvas.getContext('2d'); ink.fillStyle = ctx.palette.bg; ink.fillRect(0, 0, ctx.width, ctx.height);
    ctx.rorschach = { canvas, ink, lastX: null, lastY: null, phase: 0 };
    for (let index = 0; index < 28; index += 1) this.splat(ctx, ctx.width * (0.5 + (ctx.random() - 0.5) * 0.28), ctx.height * (0.15 + ctx.random() * 0.7), 8 + ctx.random() * 26);
  },
  splat(ctx, x, y, radius) {
    const r = ctx.rorschach;
    const distanceFromCenter = x - ctx.width / 2;
    [x, ctx.width / 2 - distanceFromCenter].forEach((mirrorX, side) => {
      const gradient = r.ink.createRadialGradient(mirrorX, y, 0, mirrorX, y, radius);
      const color = side % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.55, color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      r.ink.globalCompositeOperation = 'lighter';
      r.ink.globalAlpha = 0.24 + ctx.state.force / 180;
      r.ink.fillStyle = gradient;
      r.ink.beginPath(); r.ink.arc(mirrorX, y, radius, 0, Math.PI * 2); r.ink.fill();
    });
    r.ink.globalCompositeOperation = 'source-over'; r.ink.globalAlpha = 1;
  },
  frame(ctx, ts, dt) {
    const r = ctx.rorschach;
    if (ctx.state.memory === 'evaporate') {
      r.ink.fillStyle = ctx.palette.bg; r.ink.globalAlpha = 0.006; r.ink.fillRect(0, 0, ctx.width, ctx.height); r.ink.globalAlpha = 1;
    }
    r.phase += dt * 0.0002 * (ctx.audio.paused ? 1 : 2);
    ctx.context.fillStyle = ctx.palette.bg; ctx.context.fillRect(0, 0, ctx.width, ctx.height);
    ctx.context.save();
    ctx.context.translate(ctx.width / 2, ctx.height / 2);
    const breathe = 1 + Math.sin(r.phase) * 0.018;
    ctx.context.scale(breathe, 1 / breathe);
    ctx.context.drawImage(r.canvas, -ctx.width / 2, -ctx.height / 2);
    ctx.context.restore();
  },
  pointerMove(ctx, x, y, speed) {
    const distance = ctx.rorschach.lastX === null ? 999 : Math.hypot(x - ctx.rorschach.lastX, y - ctx.rorschach.lastY);
    if (distance > 8) { this.splat(ctx, x, y, 5 + speed * 0.35 + ctx.state.scale * 0.18); ctx.rorschach.lastX = x; ctx.rorschach.lastY = y; }
  },
  pointerDown(ctx, x, y) { this.splat(ctx, x, y, 35 + ctx.state.force); },
  pointerUp(ctx) { ctx.rorschach.lastX = null; },
  play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.rorschach; },
});
