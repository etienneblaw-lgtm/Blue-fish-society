// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'black-hole',
  label: 'BLACK HOLE',
  note: engineCatalog[16].note,
  mount(ctx) {
    const count = 180 + Math.floor(ctx.state.density * 5);
    ctx.blackHole = { particles: [], charge: 0, exploding: 0, centerX: ctx.width / 2, centerY: ctx.height / 2 };
    for (let index = 0; index < count; index += 1) {
      const angle = ctx.random() * Math.PI * 2;
      const radius = 30 + ctx.random() * Math.hypot(ctx.width, ctx.height) * 0.55;
      ctx.blackHole.particles.push({
        x: ctx.width / 2 + Math.cos(angle) * radius,
        y: ctx.height / 2 + Math.sin(angle) * radius,
        vx: Math.cos(angle + Math.PI / 2) * (0.2 + ctx.random()),
        vy: Math.sin(angle + Math.PI / 2) * (0.2 + ctx.random()),
        size: 0.7 + ctx.random() * 2.5,
        phase: ctx.random() * Math.PI * 2,
      });
    }
  },
  frame(ctx, ts, dt) {
    const bh = ctx.blackHole;
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.globalAlpha = 0.18; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 1;
    if (ctx.pointer.active) { bh.centerX += (ctx.pointer.x - bh.centerX) * 0.08; bh.centerY += (ctx.pointer.y - bh.centerY) * 0.08; }
    if (ctx.pointer.down) bh.charge = Math.min(1, bh.charge + dt / 1400);
    else bh.charge = Math.max(0, bh.charge - dt / 2200);
    bh.exploding = Math.max(0, bh.exploding - dt / 900);
    const timeScale = dt / 16.67;
    bh.particles.forEach((particle, index) => {
      const dx = bh.centerX - particle.x, dy = bh.centerY - particle.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (bh.exploding > 0) {
        particle.vx -= dx / distance * bh.exploding * 2.8;
        particle.vy -= dy / distance * bh.exploding * 2.8;
      } else {
        const gravity = (0.12 + ctx.state.force * 0.006 + bh.charge * 1.2) / Math.max(0.35, distance / 140);
        particle.vx += dx / distance * gravity;
        particle.vy += dy / distance * gravity;
        particle.vx += -dy / distance * 0.018;
        particle.vy += dx / distance * 0.018;
      }
      particle.vx *= 0.992; particle.vy *= 0.992;
      particle.x += particle.vx * timeScale; particle.y += particle.vy * timeScale;
      if (distance < 8 + bh.charge * 30) {
        const angle = ctx.random() * Math.PI * 2;
        const radius = Math.hypot(ctx.width, ctx.height) * 0.5;
        particle.x = bh.centerX + Math.cos(angle) * radius;
        particle.y = bh.centerY + Math.sin(angle) * radius;
        particle.vx = particle.vy = 0;
      }
      c.fillStyle = index % 4 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = 0.25 + Math.sin(ts * 0.002 + particle.phase) * 0.2 + bh.exploding * 0.45;
      c.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    const gradient = c.createRadialGradient(bh.centerX, bh.centerY, 0, bh.centerX, bh.centerY, 25 + bh.charge * 70);
    gradient.addColorStop(0, ctx.palette.bg);
    gradient.addColorStop(0.5, ctx.palette.bg);
    gradient.addColorStop(0.72, ctx.palette.secondary);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = 0.9;
    c.fillStyle = gradient; c.beginPath(); c.arc(bh.centerX, bh.centerY, 25 + bh.charge * 70, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx) { ctx.blackHole.charge = Math.max(0.15, ctx.blackHole.charge); },
  pointerUp(ctx) { ctx.blackHole.exploding = Math.max(0.35, ctx.blackHole.charge); ctx.blackHole.charge = 0; },
  play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.blackHole; },
});
