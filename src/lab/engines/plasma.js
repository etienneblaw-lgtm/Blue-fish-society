// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'plasma',
  label: 'PLASMA NETWORK',
  note: engineCatalog[31].note,
  mount(ctx) {
    const count = 5 + Math.floor(ctx.state.density / 20);
    ctx.plasma = { anchors: Array.from({ length: count }, () => ({ x: ctx.random() * ctx.width, y: ctx.random() * ctx.height, phase: ctx.random() * Math.PI * 2 })) };
  },
  arc(ctx, from, to, seed) {
    const c = ctx.context;
    const segments = 12 + Math.floor(ctx.state.chaos / 6);
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length, normalY = dx / length;
    c.beginPath(); c.moveTo(from.x, from.y);
    for (let index = 1; index < segments; index += 1) {
      const ratio = index / segments;
      const envelope = Math.sin(ratio * Math.PI);
      const jitter = (Math.sin(seed * 13 + index * 47 + performance.now() * 0.04) * 0.5 + ctx.random() - 0.5) * envelope * (6 + ctx.state.force * 0.14);
      c.lineTo(from.x + dx * ratio + normalX * jitter, from.y + dy * ratio + normalY * jitter);
    }
    c.lineTo(to.x, to.y); c.stroke();
  },
  frame(ctx, ts) {
    const p = ctx.plasma, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const cursorPoint = ctx.pointer.active ? { x: ctx.pointer.x, y: ctx.pointer.y } : { x: ctx.width / 2 + Math.sin(ts * 0.001) * 180, y: ctx.height / 2 + Math.cos(ts * 0.0013) * 120 };
    p.anchors.forEach((anchor, index) => {
      const wobbleX = anchor.x + Math.sin(ts * 0.0007 + anchor.phase) * 12;
      const wobbleY = anchor.y + Math.cos(ts * 0.0008 + anchor.phase) * 12;
      const point = { x: wobbleX, y: wobbleY };
      c.strokeStyle = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      c.lineWidth = 0.7 + (ctx.audio.paused ? 0 : 0.8);
      c.globalAlpha = 0.45 + ctx.random() * 0.45;
      this.arc(ctx, point, cursorPoint, index + ts * 0.0001);
      c.globalAlpha = 0.7; c.fillStyle = paletteTone(ctx, index); c.beginPath(); c.arc(point.x, point.y, 3 + ctx.random() * 3, 0, Math.PI * 2); c.fill();
    });
    c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) { ctx.plasma.anchors.push({ x, y, phase: ctx.random() * Math.PI * 2 }); if (ctx.plasma.anchors.length > 12) ctx.plasma.anchors.shift(); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.plasma; },
});
