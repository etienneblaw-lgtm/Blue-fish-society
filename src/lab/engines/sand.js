// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'sand',
  label: 'GRAVITY SAND',
  note: engineCatalog[17].note,
  mount(ctx) {
    const count = 350 + Math.floor(ctx.state.density * 9);
    ctx.sand = { grains: [], gravityAngle: Math.PI / 2 };
    for (let index = 0; index < count; index += 1) {
      ctx.sand.grains.push({ x: ctx.random() * ctx.width, y: ctx.random() * ctx.height, vx: 0, vy: 0, size: 0.8 + ctx.random() * 2.2 });
    }
  },
  frame(ctx, ts, dt) {
    const sand = ctx.sand;
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const gravity = 0.025 + ctx.state.speed * 0.0018 + (ctx.audio.paused ? 0 : 0.04 * Math.sin(ts * 0.007));
    const gx = Math.cos(sand.gravityAngle) * gravity, gy = Math.sin(sand.gravityAngle) * gravity;
    const timeScale = dt / 16.67;
    sand.grains.forEach((grain, index) => {
      grain.vx += gx; grain.vy += gy;
      if (ctx.pointer.active) {
        const dx = ctx.pointer.x - grain.x, dy = ctx.pointer.y - grain.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 45 + ctx.state.force * 1.7;
        if (distance < radius) {
          const direction = ctx.state.interaction === 'repel' ? -1 : 1;
          const power = (1 - distance / radius) * 0.6 * direction;
          grain.vx += dx / distance * power; grain.vy += dy / distance * power;
        }
      }
      grain.vx *= 0.995; grain.vy *= 0.995;
      grain.x += grain.vx * timeScale; grain.y += grain.vy * timeScale;
      if (grain.x < 0) { grain.x = 0; grain.vx *= -0.55; }
      if (grain.x > ctx.width) { grain.x = ctx.width; grain.vx *= -0.55; }
      if (grain.y < 0) { grain.y = 0; grain.vy *= -0.55; }
      if (grain.y > ctx.height) { grain.y = ctx.height; grain.vy *= -0.55; }
      c.fillStyle = index % 5 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = 0.35 + grain.size * 0.2;
      c.fillRect(grain.x, grain.y, grain.size, grain.size);
    });
    c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx) { ctx.sand.gravityAngle += Math.PI / 2; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.sand; },
});
