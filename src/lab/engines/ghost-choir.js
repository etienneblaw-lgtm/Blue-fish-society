// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'ghost-choir',
  label: 'CURSOR GHOST CHOIR',
  note: engineCatalog[36].note,
  mount(ctx) { ctx.ghostChoir = { history: [], phase: 0, scatter: 0 }; },
  frame(ctx, ts, dt) {
    const g = ctx.ghostChoir, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.globalAlpha = ctx.state.memory === 'accumulate' ? 0.12 : 0.3; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 1;
    g.phase += dt * 0.001;
    const sourceX = ctx.pointer.active ? ctx.pointer.x : ctx.width / 2 + Math.cos(g.phase * 1.1) * ctx.width * 0.25;
    const sourceY = ctx.pointer.active ? ctx.pointer.y : ctx.height / 2 + Math.sin(g.phase * 1.7) * ctx.height * 0.24;
    g.history.unshift({ x: sourceX, y: sourceY, speed: ctx.pointer.speed });
    if (g.history.length > 900) g.history.length = 900;
    const ghosts = 8 + Math.floor(ctx.state.density / 5);
    for (let index = ghosts - 1; index >= 0; index -= 1) {
      const point = g.history[Math.min(g.history.length - 1, index * (5 + Math.floor(ctx.state.persistence / 8)))] || { x: sourceX, y: sourceY, speed: 0 };
      const ratio = index / ghosts;
      const angle = ratio * Math.PI * 2 * (1 + ctx.state.chaos / 40) + g.scatter * index;
      const dx = point.x - ctx.width / 2, dy = point.y - ctx.height / 2;
      const scale = 0.55 + ratio * 0.75;
      const x = ctx.width / 2 + (dx * Math.cos(angle) - dy * Math.sin(angle)) * scale;
      const y = ctx.height / 2 + (dx * Math.sin(angle) + dy * Math.cos(angle)) * scale;
      const size = 4 + ctx.state.scale * 0.08 + point.speed * 0.05;
      c.strokeStyle = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      c.globalAlpha = 0.12 + (1 - ratio) * 0.72;
      c.lineWidth = 0.7 + (1 - ratio) * 1.8;
      c.save(); c.translate(x, y); c.rotate(angle + g.phase);
      if (index % 3 === 0) { c.strokeRect(-size, -size, size * 2, size * 2); }
      else if (index % 3 === 1) { c.beginPath(); c.arc(0, 0, size, 0, Math.PI * 2); c.stroke(); }
      else { c.beginPath(); c.moveTo(-size * 1.5, 0); c.lineTo(size * 1.5, 0); c.moveTo(0, -size * 1.5); c.lineTo(0, size * 1.5); c.stroke(); }
      c.restore();
    }
    g.scatter *= 0.96; c.globalAlpha = 1;
  },
  pointerMove() {}, pointerDown(ctx) { ctx.ghostChoir.scatter = 0.35 + ctx.state.force * 0.008; }, pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.ghostChoir; },
});
