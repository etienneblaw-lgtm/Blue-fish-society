// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'marbling',
  label: 'LIQUID MARBLING',
  note: engineCatalog[12].note,
  mount(ctx) {
    const count = 220 + Math.floor(ctx.state.density * 5);
    const bands = 5 + Math.floor(ctx.state.scale / 15);
    ctx.marbling = { particles: [] };
    for (let index = 0; index < count; index += 1) {
      const band = index % bands;
      const y = (band + 0.5) / bands * ctx.height + (ctx.random() - 0.5) * 18;
      ctx.marbling.particles.push({ x: ctx.random() * ctx.width, y, px: 0, py: 0, phase: ctx.random() * Math.PI * 2, band });
    }
    ctx.context.fillStyle = ctx.palette.bg; ctx.context.fillRect(0, 0, ctx.width, ctx.height);
  },
  frame(ctx, ts, dt) {
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg;
    c.globalAlpha = ctx.state.memory === 'accumulate' ? 0.025 : 0.08;
    c.fillRect(0, 0, ctx.width, ctx.height);
    c.globalAlpha = 1;
    const timeScale = dt / 16.67;
    ctx.marbling.particles.forEach((particle) => {
      particle.px = particle.x; particle.py = particle.y;
      const field = Math.sin(particle.y * 0.012 + ts * 0.0003 + particle.phase) + Math.cos(particle.x * 0.009 - ts * 0.0002);
      particle.x += (1 + ctx.state.speed * 0.035) * timeScale;
      particle.y += field * (0.15 + ctx.state.chaos * 0.025) * timeScale;
      if (ctx.pointer.active) {
        const dx = particle.x - ctx.pointer.x, dy = particle.y - ctx.pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 60 + ctx.state.force * 1.6;
        if (distance < radius) {
          const swirl = (1 - distance / radius) * (ctx.pointer.down ? 8 : 3);
          particle.x += -dy / distance * swirl;
          particle.y += dx / distance * swirl;
        }
      }
      if (particle.x > ctx.width + 10) { particle.x = -10; particle.px = -10; }
      if (particle.y < 0) particle.y += ctx.height;
      if (particle.y > ctx.height) particle.y -= ctx.height;
      c.strokeStyle = particle.band % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      c.globalAlpha = 0.22 + (particle.band % 3) * 0.16;
      c.lineWidth = 0.7 + ctx.state.scale * 0.025;
      c.beginPath(); c.moveTo(particle.px, particle.py); c.lineTo(particle.x, particle.y); c.stroke();
    });
    c.globalAlpha = 1;
  },
  pointerMove() {}, pointerDown() {}, pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.marbling; },
});
