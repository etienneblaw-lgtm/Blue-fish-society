// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'gravity-lens',
  label: 'GRAVITATIONAL LENS',
  note: engineCatalog[45].note,
  mount(ctx) {
    const count = 420 + Math.floor(ctx.state.density * 9);
    ctx.gravityLens = {
      stars: Array.from({ length: count }, () => ({ x: ctx.random() * ctx.width, y: ctx.random() * ctx.height, size: 0.4 + ctx.random() * 2, phase: ctx.random() * Math.PI * 2, tone: ctx.random() })),
      lenses: [], x: ctx.width / 2, y: ctx.height / 2,
    };
  },
  frame(ctx, ts) {
    const g = ctx.gravityLens, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const activeLenses = [...g.lenses, { x: g.x, y: g.y, mass: 0.7 + ctx.state.force * 0.018 }];
    g.stars.forEach((star) => {
      let x = star.x, y = star.y;
      activeLenses.forEach((lens) => {
        const dx = x - lens.x, dy = y - lens.y, distanceSq = Math.max(130, dx * dx + dy * dy);
        const deflection = lens.mass * (1200 + ctx.state.scale * 35) / distanceSq;
        x += dx * deflection; y += dy * deflection;
      });
      const distance = Math.hypot(x - star.x, y - star.y);
      c.strokeStyle = star.tone > 0.72 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = (0.25 + Math.sin(ts * 0.002 + star.phase) * 0.18) * clamp(1 + distance / 16, 1, 3);
      c.lineWidth = star.size;
      if (distance > 1.5) { c.beginPath(); c.moveTo(star.x, star.y); c.lineTo(x, y); c.stroke(); }
      c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(x, y, star.size, 0, Math.PI * 2); c.fill();
    });
    activeLenses.forEach((lens, index) => { c.strokeStyle = index === activeLenses.length - 1 ? ctx.palette.primary : ctx.palette.secondary; c.globalAlpha = 0.22; c.lineWidth = 1; c.beginPath(); c.arc(lens.x, lens.y, 18 + lens.mass * 5, 0, Math.PI * 2); c.stroke(); });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.gravityLens.x = x; ctx.gravityLens.y = y; },
  pointerDown(ctx, x, y) { ctx.gravityLens.lenses.push({ x, y, mass: 0.8 + ctx.state.force * 0.02 }); if (ctx.gravityLens.lenses.length > 5) ctx.gravityLens.lenses.shift(); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.gravityLens; },
});
