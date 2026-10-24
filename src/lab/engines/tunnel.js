// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'tunnel',
  label: 'INFINITE TUNNEL',
  note: engineCatalog[11].note,
  mount(ctx) {
    const count = 26 + Math.floor(ctx.state.density / 4);
    ctx.tunnel = {
      rings: Array.from({ length: count }, (_, index) => ({ z: index / count, sides: 4 + Math.floor(ctx.random() * 8), rotation: ctx.random() * Math.PI })),
      centerX: ctx.width / 2,
      centerY: ctx.height / 2,
      targetX: ctx.width / 2,
      targetY: ctx.height / 2,
      direction: 1,
    };
  },
  frame(ctx, ts, dt) {
    const t = ctx.tunnel;
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    t.centerX += (t.targetX - t.centerX) * 0.045;
    t.centerY += (t.targetY - t.centerY) * 0.045;
    const speed = (0.00008 + ctx.state.speed * 0.000006) * (ctx.audio.paused ? 1 : 2.2) * t.direction;
    const maxRadius = Math.hypot(ctx.width, ctx.height) * 0.72;
    t.rings.forEach((ring, ringIndex) => {
      ring.z -= dt * speed;
      if (ring.z < 0) ring.z += 1;
      if (ring.z > 1) ring.z -= 1;
      const depth = 1 - ring.z;
      const radius = 8 + Math.pow(depth, 2.1) * maxRadius;
      const alpha = 0.08 + depth * 0.85;
      const rotation = ring.rotation + ts * 0.00005 * (ringIndex % 2 ? 1 : -1) * (1 + ctx.state.chaos / 30);
      c.globalAlpha = alpha;
      c.strokeStyle = ringIndex % 3 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      c.lineWidth = 0.5 + depth * 2.2;
      c.beginPath();
      for (let side = 0; side <= ring.sides; side += 1) {
        const angle = side / ring.sides * Math.PI * 2 + rotation;
        const x = t.centerX + Math.cos(angle) * radius;
        const y = t.centerY + Math.sin(angle) * radius;
        if (side === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
    });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.tunnel.targetX = x; ctx.tunnel.targetY = y; },
  pointerDown(ctx) { ctx.tunnel.direction *= -1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.tunnel; },
});
