// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'nbody',
  label: 'N-BODY CHAOS',
  note: engineCatalog[29].note,
  mount(ctx) {
    const count = 7 + Math.floor(ctx.state.density / 8);
    ctx.nbody = { bodies: [], trails: [] };
    for (let index = 0; index < count; index += 1) {
      const angle = index / count * Math.PI * 2;
      const radius = 50 + ctx.random() * Math.min(ctx.width, ctx.height) * 0.34;
      ctx.nbody.bodies.push({
        x: ctx.width / 2 + Math.cos(angle) * radius,
        y: ctx.height / 2 + Math.sin(angle) * radius,
        vx: -Math.sin(angle) * (0.3 + ctx.random()),
        vy: Math.cos(angle) * (0.3 + ctx.random()),
        mass: 3 + ctx.random() * 14,
        tone: ctx.random(),
      });
    }
  },
  frame(ctx, ts, dt) {
    const n = ctx.nbody, c = ctx.context, bodies = n.bodies;
    c.fillStyle = ctx.palette.bg; c.globalAlpha = ctx.state.memory === 'accumulate' ? 0.08 : 0.2; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 1;
    const timeScale = dt / 16.67;
    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const a = bodies[i], b = bodies[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const distanceSq = Math.max(80, dx * dx + dy * dy);
        const distance = Math.sqrt(distanceSq);
        const gravity = (0.035 + ctx.state.force * 0.0008) / distanceSq;
        const fx = dx / distance * gravity, fy = dy / distance * gravity;
        a.vx += fx * b.mass; a.vy += fy * b.mass;
        b.vx -= fx * a.mass; b.vy -= fy * a.mass;
      }
    }
    bodies.forEach((body, index) => {
      if (ctx.pointer.active) {
        const dx = ctx.pointer.x - body.x, dy = ctx.pointer.y - body.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < 260) { const direction = ctx.state.interaction === 'repel' ? -1 : 1; body.vx += dx / distance * 0.015 * direction; body.vy += dy / distance * 0.015 * direction; }
      }
      body.x += body.vx * timeScale * (1 + ctx.state.speed / 70); body.y += body.vy * timeScale * (1 + ctx.state.speed / 70);
      if (body.x < -30) body.x = ctx.width + 30; if (body.x > ctx.width + 30) body.x = -30;
      if (body.y < -30) body.y = ctx.height + 30; if (body.y > ctx.height + 30) body.y = -30;
      const radius = 2 + Math.sqrt(body.mass) * (1 + ctx.state.scale / 45);
      const gradient = c.createRadialGradient(body.x, body.y, 0, body.x, body.y, radius * 3);
      const color = body.tone > 0.5 ? ctx.palette.primary : ctx.palette.secondary;
      gradient.addColorStop(0, color); gradient.addColorStop(0.3, color); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gradient; c.globalAlpha = 0.82; c.beginPath(); c.arc(body.x, body.y, radius * 3, 0, Math.PI * 2); c.fill();
    });
    c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) {
    ctx.nbody.bodies.push({ x, y, vx: (ctx.random() - 0.5) * 2, vy: (ctx.random() - 0.5) * 2, mass: 5 + ctx.random() * 18, tone: ctx.random() });
    if (ctx.nbody.bodies.length > 28) ctx.nbody.bodies.shift();
  },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.nbody; },
});
