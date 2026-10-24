// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'pixel-sort',
  label: 'PIXEL SORT STORM',
  note: engineCatalog[39].note,
  mount(ctx) {
    const source = document.createElement('canvas'); source.width = ctx.width; source.height = ctx.height;
    const drawing = source.getContext('2d'); drawing.fillStyle = ctx.palette.bg; drawing.fillRect(0, 0, ctx.width, ctx.height);
    const bands = 28 + Math.floor(ctx.state.density * 0.5);
    for (let index = 0; index < bands; index += 1) {
      const x = ctx.random() * ctx.width, y = ctx.random() * ctx.height;
      const width = 12 + ctx.random() * ctx.width * 0.28, height = 4 + ctx.random() * ctx.height * 0.12;
      drawing.globalAlpha = 0.2 + ctx.random() * 0.75;
      drawing.fillStyle = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      drawing.fillRect(x - width / 2, y - height / 2, width, height);
    }
    drawing.globalAlpha = 1;
    ctx.pixelSort = { source, x: ctx.width / 2, y: ctx.height / 2, targetX: ctx.width / 2, targetY: ctx.height / 2, burst: 0 };
  },
  frame(ctx, ts, dt) {
    const p = ctx.pixelSort, c = ctx.context;
    p.x += (p.targetX - p.x) * 0.08; p.y += (p.targetY - p.y) * 0.08;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const strip = Math.max(2, Math.floor(7 - ctx.state.density * 0.045));
    for (let x = 0; x < ctx.width; x += strip) {
      const distance = Math.abs(x - p.x);
      const envelope = Math.exp(-distance * distance / Math.pow(90 + ctx.state.force * 2.5, 2));
      const shift = Math.sin(x * 0.025 + ts * (0.0005 + ctx.state.speed * 0.000025)) * envelope * (20 + ctx.state.chaos * 1.7 + p.burst * 130);
      const split = Math.sin(x * 0.013 - ts * 0.0004) * p.burst * 18;
      c.globalAlpha = 0.94;
      c.drawImage(p.source, x, 0, strip, ctx.height, x + split, shift, strip, ctx.height);
      if (shift > 0) c.drawImage(p.source, x, ctx.height - shift, strip, shift, x + split, 0, strip, shift);
      else if (shift < 0) c.drawImage(p.source, x, 0, strip, -shift, x + split, ctx.height + shift, strip, -shift);
    }
    c.globalAlpha = 1; p.burst = Math.max(0, p.burst - dt / 900);
  },
  pointerMove(ctx, x, y) { ctx.pixelSort.targetX = x; ctx.pixelSort.targetY = y; },
  pointerDown(ctx) { ctx.pixelSort.burst = 1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.pixelSort; },
});
