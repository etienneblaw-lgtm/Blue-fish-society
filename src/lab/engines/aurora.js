// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'aurora',
  label: 'AURORA CURTAIN',
  note: engineCatalog[44].note,
  mount(ctx) { ctx.aurora = { charge: 0, phase: ctx.random() * Math.PI * 2 }; },
  frame(ctx, ts, dt) {
    const a = ctx.aurora, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const curtains = 12 + Math.floor(ctx.state.density / 6);
    const gradient = c.createLinearGradient(0, 0, 0, ctx.height);
    gradient.addColorStop(0, ctx.palette.secondary); gradient.addColorStop(0.48, ctx.palette.primary); gradient.addColorStop(1, ctx.palette.bg);
    c.strokeStyle = gradient;
    for (let curtain = 0; curtain < curtains; curtain += 1) {
      const baseX = (curtain + 0.5) / curtains * ctx.width;
      c.beginPath();
      for (let y = -20; y <= ctx.height + 20; y += 9) {
        const phase = y * (0.007 + ctx.state.chaos * 0.00004) + ts * (0.00025 + ctx.state.speed * 0.000009) + curtain * 0.55 + a.phase;
        let x = baseX + Math.sin(phase) * (18 + ctx.state.scale * 0.65) + Math.sin(phase * 0.43) * 24;
        if (ctx.pointer.active) {
          const dy = y - ctx.pointer.y, influence = Math.exp(-(dy * dy) / Math.pow(120 + ctx.state.force * 2, 2));
          x += (ctx.pointer.x - x) * influence * (0.22 + a.charge * 0.5);
        }
        if (y === -20) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.globalAlpha = 0.07 + (curtain % 6) * 0.035 + a.charge * 0.08; c.lineWidth = 2 + (curtain % 5) * 1.8; c.stroke();
    }
    c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.15; c.drawImage(ctx.canvas, 2, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    a.charge = Math.max(0, a.charge - dt / 800);
  },
  pointerMove(ctx) { ctx.aurora.charge = Math.min(1, ctx.aurora.charge + ctx.pointer.speed * 0.008); },
  pointerDown(ctx) { ctx.aurora.charge = 1; ctx.aurora.phase += Math.PI * 0.5; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.aurora; },
});
