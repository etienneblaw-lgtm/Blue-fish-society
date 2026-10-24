// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { mixColor, engineCatalog } from '../shared.js';

export default ({
  id: 'prism-rain',
  label: 'PRISM RAIN',
  note: engineCatalog[46].note,
  mount(ctx) {
    const count = 85 + Math.floor(ctx.state.density * 1.5);
    ctx.prismRain = {
      rays: Array.from({ length: count }, () => ({ x: ctx.random() * ctx.width, y: ctx.random() * ctx.height, speed: 0.4 + ctx.random() * 1.8, length: 25 + ctx.random() * 100, phase: ctx.random() * Math.PI * 2 })),
      burst: 0,
    };
  },
  frame(ctx, ts, dt) {
    const p = ctx.prismRain, c = ctx.context, timeScale = dt / 16.67;
    c.fillStyle = ctx.palette.bg; c.globalAlpha = ctx.state.memory === 'accumulate' ? 0.12 : 0.32; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 1;
    const colors = [ctx.palette.primary, mixColor(ctx.palette.primary, ctx.palette.secondary, 0.5), ctx.palette.secondary];
    p.rays.forEach((ray, index) => {
      ray.y += ray.speed * timeScale * (1 + ctx.state.speed / 35 + p.burst * 3);
      if (ray.y - ray.length > ctx.height) { ray.y = -ray.length; ray.x = ctx.random() * ctx.width; }
      const dx = ray.x - ctx.pointer.x, dy = ray.y - ctx.pointer.y, distance = Math.hypot(dx, dy);
      const refracting = ctx.pointer.active && distance < 110 + ctx.state.force;
      c.strokeStyle = index % 4 === 0 ? ctx.palette.secondary : ctx.palette.primary; c.globalAlpha = 0.28 + (index % 5) * 0.09; c.lineWidth = 0.8 + (index % 3) * 0.45;
      c.beginPath(); c.moveTo(ray.x, ray.y - ray.length); c.lineTo(ray.x, ray.y); c.stroke();
      if (refracting) {
        colors.forEach((color, channel) => {
          const direction = channel - 1;
          c.strokeStyle = color; c.globalAlpha = 0.55; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(ray.x, ray.y); c.lineTo(ray.x + direction * (25 + ctx.state.chaos * 0.8), ray.y + 55 + channel * 8); c.stroke();
        });
      }
    });
    p.burst = Math.max(0, p.burst - dt / 650); c.globalAlpha = 1;
  },
  pointerMove() {}, pointerDown(ctx) { ctx.prismRain.burst = 1; }, pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.prismRain; },
});
