// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { mixColor, engineCatalog } from '../shared.js';

export default ({
  id: 'metaballs',
  label: 'METABALL ORGANISM',
  note: engineCatalog[13].note,
  mount(ctx) {
    const count = 10 + Math.floor(ctx.state.density / 6);
    ctx.metaballs = { blobs: [] };
    for (let index = 0; index < count; index += 1) {
      ctx.metaballs.blobs.push({
        x: ctx.random() * ctx.width, y: ctx.random() * ctx.height,
        vx: (ctx.random() - 0.5) * 1.4, vy: (ctx.random() - 0.5) * 1.4,
        radius: 25 + ctx.random() * (35 + ctx.state.scale * 0.7), phase: ctx.random() * Math.PI * 2,
      });
    }
  },
  frame(ctx, ts, dt) {
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    c.globalCompositeOperation = 'lighter';
    const timeScale = dt / 16.67;
    ctx.metaballs.blobs.forEach((blob, index) => {
      if (ctx.pointer.active) {
        const dx = ctx.pointer.x - blob.x, dy = ctx.pointer.y - blob.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < 350) {
          const direction = ctx.state.interaction === 'repel' ? -1 : 1;
          blob.vx += dx / distance * 0.03 * direction * (1 + ctx.state.force / 30);
          blob.vy += dy / distance * 0.03 * direction * (1 + ctx.state.force / 30);
        }
      }
      blob.x += blob.vx * timeScale; blob.y += blob.vy * timeScale;
      blob.vx *= 0.995; blob.vy *= 0.995;
      if (blob.x < -blob.radius) blob.x = ctx.width + blob.radius;
      if (blob.x > ctx.width + blob.radius) blob.x = -blob.radius;
      if (blob.y < -blob.radius) blob.y = ctx.height + blob.radius;
      if (blob.y > ctx.height + blob.radius) blob.y = -blob.radius;
      const pulse = 1 + Math.sin(ts * 0.002 + blob.phase) * 0.18 + (ctx.audio.paused ? 0 : 0.14);
      const radius = blob.radius * pulse;
      const gradient = c.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, radius);
      gradient.addColorStop(0, index % 2 ? ctx.palette.primary : ctx.palette.secondary);
      gradient.addColorStop(0.42, mixColor(ctx.palette.primary, ctx.palette.secondary, index / Math.max(1, ctx.metaballs.blobs.length - 1)));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gradient;
      c.globalAlpha = 0.74;
      c.beginPath(); c.arc(blob.x, blob.y, radius, 0, Math.PI * 2); c.fill();
    });
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) {
    ctx.metaballs.blobs.push({ x, y, vx: 0, vy: 0, radius: 30 + ctx.state.scale, phase: ctx.random() * Math.PI * 2 });
    if (ctx.metaballs.blobs.length > 36) ctx.metaballs.blobs.shift();
  },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.metaballs; },
});
