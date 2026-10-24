// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'attractor',
  label: 'STRANGE ATTRACTOR',
  note: engineCatalog[42].note,
  mount(ctx) {
    const trails = [];
    const walkers = Array.from({ length: 5 }, (_, index) => ({ x: 0.1 + index * 0.004, y: 0, z: 0 }));
    // Pre-fill the orbit so the chaotic form is present before the visitor moves.
    for (let iteration = 0; iteration < 520; iteration += 1) {
      walkers.forEach((walker, index) => {
        const dx = 10 * (walker.y - walker.x), dy = walker.x * (28 - walker.z) - walker.y, dz = walker.x * walker.y - 2.67 * walker.z;
        walker.x += dx * 0.004; walker.y += dy * 0.004; walker.z += dz * 0.004;
        trails.push({ x: ctx.width / 2 + walker.x * Math.min(ctx.width, ctx.height) * 0.014, y: ctx.height / 2 + walker.y * Math.min(ctx.width, ctx.height) * 0.01, tone: index / walkers.length });
      });
    }
    ctx.attractor = {
      walkers, trails, rotation: 0, burst: 0,
    };
  },
  frame(ctx, ts, dt) {
    const a = ctx.attractor, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.globalAlpha = ctx.state.memory === 'accumulate' ? 0.045 : 0.16; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 1;
    const sigma = 7 + (ctx.pointer.active ? ctx.pointer.x / ctx.width * 11 : ctx.state.force * 0.11);
    const rho = 20 + (ctx.pointer.active ? ctx.pointer.y / ctx.height * 22 : ctx.state.chaos * 0.22);
    const beta = 2.1 + ctx.state.scale * 0.012;
    const iterations = 5 + Math.floor(ctx.state.speed / 12);
    const step = 0.004 + ctx.state.speed * 0.000018;
    const scale = Math.min(ctx.width, ctx.height) * 0.014;
    a.rotation += dt * (0.00005 + ctx.state.speed * 0.0000015) + a.burst * 0.008;
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      a.walkers.forEach((walker, index) => {
        const dx = sigma * (walker.y - walker.x), dy = walker.x * (rho - walker.z) - walker.y, dz = walker.x * walker.y - beta * walker.z;
        walker.x += dx * step; walker.y += dy * step; walker.z += dz * step;
        const rotatedX = walker.x * Math.cos(a.rotation) - (walker.z - 24) * Math.sin(a.rotation);
        const rotatedZ = walker.x * Math.sin(a.rotation) + (walker.z - 24) * Math.cos(a.rotation);
        a.trails.push({ x: ctx.width / 2 + rotatedX * scale, y: ctx.height / 2 + walker.y * scale * 0.72 + rotatedZ * scale * 0.12, tone: index / a.walkers.length });
      });
    }
    if (a.trails.length > 5200) a.trails.splice(0, a.trails.length - 5200);
    for (let index = 1; index < a.trails.length; index += 1) {
      const previous = a.trails[index - 1], point = a.trails[index];
      if (Math.hypot(point.x - previous.x, point.y - previous.y) > 80) continue;
      c.strokeStyle = point.tone > 0.48 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = 0.14 + index / a.trails.length * 0.58; c.lineWidth = 0.55 + point.tone * 1.1;
      c.beginPath(); c.moveTo(previous.x, previous.y); c.lineTo(point.x, point.y); c.stroke();
    }
    a.burst *= 0.94; c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx) { ctx.attractor.burst = 1; ctx.attractor.walkers.forEach((walker, index) => { walker.x = 0.1 + index * 0.012; walker.y = index * 0.006; walker.z = 0; }); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.attractor; },
});
