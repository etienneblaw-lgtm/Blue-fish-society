// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'fractal',
  label: 'FRACTAL BLOOM',
  note: engineCatalog[20].note,
  mount(ctx) {
    ctx.fractal = { blooms: [{ x: ctx.width / 2, y: ctx.height / 2, age: 1200, angle: -Math.PI / 2, seed: ctx.random() }] };
  },
  drawBranch(ctx, x, y, length, angle, depth, colorShift) {
    if (depth <= 0 || length < 1) return;
    const c = ctx.context;
    const endX = x + Math.cos(angle) * length, endY = y + Math.sin(angle) * length;
    c.strokeStyle = colorShift % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
    c.globalAlpha = 0.18 + depth * 0.09;
    c.lineWidth = Math.max(0.45, depth * 0.42);
    c.beginPath(); c.moveTo(x, y); c.lineTo(endX, endY); c.stroke();
    const spread = 0.28 + ctx.state.chaos * 0.004;
    const shrink = 0.62 + ctx.state.persistence * 0.0016;
    this.drawBranch(ctx, endX, endY, length * shrink, angle - spread, depth - 1, colorShift + 1);
    this.drawBranch(ctx, endX, endY, length * shrink, angle + spread, depth - 1, colorShift + 2);
    if (depth % 3 === 0 && ctx.state.density > 58) this.drawBranch(ctx, endX, endY, length * shrink * 0.8, angle, depth - 2, colorShift + 3);
  },
  frame(ctx, ts, dt) {
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    ctx.fractal.blooms.forEach((bloom, index) => {
      bloom.age += dt * (ctx.audio.paused ? 1 : 1.8);
      const growth = clamp(bloom.age / 1800);
      const depth = Math.min(9, 4 + Math.floor(ctx.state.density / 20));
      const angleInfluence = ctx.pointer.active ? (ctx.pointer.x / ctx.width - 0.5) * 0.9 : 0;
      this.drawBranch(ctx, bloom.x, bloom.y, (28 + ctx.state.scale * 0.65) * growth, bloom.angle + angleInfluence + Math.sin(ts * 0.0003 + bloom.seed) * 0.15, depth, index);
    });
    c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) {
    ctx.fractal.blooms.push({ x, y, age: 0, angle: -Math.PI / 2 + (ctx.random() - 0.5) * Math.PI, seed: ctx.random() * Math.PI * 2 });
    if (ctx.fractal.blooms.length > 7) ctx.fractal.blooms.shift();
  },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.fractal; },
});
