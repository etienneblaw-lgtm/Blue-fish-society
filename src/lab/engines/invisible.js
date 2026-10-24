// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { createShapeDescriptor, drawTrippyShape, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'invisible',
  label: 'INVISIBLE PRESENCE',
  note: engineCatalog[2].note,
  mount(ctx) {
    const { context: c, width: w, height: h, random: r } = ctx;
    ctx.invisible = { particles: [], ripples: [] };
    const count = Math.round(60 + ctx.state.density * 2.5);
    for (let i = 0; i < count; i++) {
      ctx.invisible.particles.push({
        x: r() * w, y: r() * h, vx: 0, vy: 0,
        size: 8 + r() * 16, phase: r() * Math.PI * 2,
        shape: createShapeDescriptor(r), alpha: 0.28 + r() * 0.6,
      });
    }
    ctx.hideCursor = true;
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s, random: r } = ctx;
    c.fillStyle = p.bg;
    c.fillRect(0, 0, w, h);
    const timeScale = dt / 16.67;
    const force = s.force / 100;
    const radius = 60 + force * 200 + (ctx.pointer.down ? 80 : 0);

    ctx.invisible.particles.forEach((pt) => {
      if (ctx.pointer.active) {
        const dx = pt.x - ctx.pointer.x, dy = pt.y - ctx.pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < radius) {
          const power = (1 - dist / radius) * (0.5 + force * 3) * (ctx.pointer.down ? 2 : 1);
          if (s.interaction === 'attract') { pt.vx -= dx / dist * power; pt.vy -= dy / dist * power; }
          else { pt.vx += dx / dist * power; pt.vy += dy / dist * power; }
        }
      }
      pt.x += pt.vx * timeScale; pt.y += pt.vy * timeScale;
      pt.vx *= 0.92; pt.vy *= 0.92;
      if (pt.x < 0) pt.x = w; if (pt.x > w) pt.x = 0;
      if (pt.y < 0) pt.y = h; if (pt.y > h) pt.y = 0;
      const drift = s.speed / 100;
      pt.x += Math.sin(ts * 0.0004 + pt.phase) * drift * 2;
      pt.y += Math.cos(ts * 0.0003 + pt.phase) * drift * 2;
      c.globalAlpha = pt.alpha * (0.5 + Math.sin(ts * 0.002 + pt.phase) * 0.3);
      c.strokeStyle = paletteTone(ctx, Math.floor(pt.phase * 10));
      c.fillStyle = paletteTone(ctx, Math.floor(pt.phase * 10) + 2);
      c.lineWidth = 0.7 + pt.size * 0.06;
      drawTrippyShape(c, pt.shape, pt.x, pt.y, pt.size, 'both');
    });

    // Ripples on click
    ctx.invisible.ripples = ctx.invisible.ripples.filter((rip) => {
      rip.radius += dt * 0.3;
      rip.alpha -= dt / 800;
      if (rip.alpha <= 0) return false;
      c.globalAlpha = rip.alpha;
      c.strokeStyle = p.primary;
      c.lineWidth = 1;
      c.beginPath(); c.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2); c.stroke();
      return true;
    });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) {},
  pointerDown(ctx, x, y) { ctx.invisible.ripples.push({ x, y, radius: 5, alpha: 0.8 }); },
  pointerUp(ctx) {},
  play(ctx) {},
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { ctx.hideCursor = false; delete ctx.invisible; },
});
