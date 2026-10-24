// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'recursive-windows',
  label: 'RECURSIVE WINDOWS',
  note: engineCatalog[32].note,
  mount(ctx) {
    const front = document.createElement('canvas'), back = document.createElement('canvas');
    front.width = back.width = ctx.width; front.height = back.height = ctx.height;
    const frontContext = front.getContext('2d'), backContext = back.getContext('2d');
    frontContext.fillStyle = backContext.fillStyle = ctx.palette.bg; frontContext.fillRect(0, 0, ctx.width, ctx.height); backContext.fillRect(0, 0, ctx.width, ctx.height);
    ctx.recursiveWindows = { front, back, frontContext, backContext, x: ctx.width / 2, y: ctx.height / 2, targetX: ctx.width / 2, targetY: ctx.height / 2, depth: 6 };
  },
  frame(ctx, ts) {
    const r = ctx.recursiveWindows, back = r.backContext;
    r.x += (r.targetX - r.x) * 0.05; r.y += (r.targetY - r.y) * 0.05;
    back.fillStyle = ctx.palette.bg; back.fillRect(0, 0, ctx.width, ctx.height);
    for (let index = r.depth; index >= 1; index -= 1) {
      const ratio = Math.pow(0.68 + ctx.state.scale * 0.0012, index);
      const windowWidth = ctx.width * ratio, windowHeight = ctx.height * ratio;
      const offsetX = (r.x - ctx.width / 2) * index * 0.045;
      const offsetY = (r.y - ctx.height / 2) * index * 0.045;
      back.globalAlpha = 0.28 + index / r.depth * 0.5;
      back.drawImage(r.front, r.x - windowWidth / 2 + offsetX, r.y - windowHeight / 2 + offsetY, windowWidth, windowHeight);
      back.strokeStyle = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      back.lineWidth = 1 + index * 0.25;
      back.strokeRect(r.x - windowWidth / 2 + offsetX, r.y - windowHeight / 2 + offsetY, windowWidth, windowHeight);
    }
    back.globalAlpha = 0.85;
    back.fillStyle = ctx.palette.primary;
    const orbitX = r.x + Math.cos(ts * 0.0013) * (50 + ctx.state.force);
    const orbitY = r.y + Math.sin(ts * 0.0017) * (40 + ctx.state.force * 0.6);
    back.beginPath(); back.arc(orbitX, orbitY, 5 + ctx.state.density * 0.07, 0, Math.PI * 2); back.fill();
    back.globalAlpha = 1;
    [r.front, r.back] = [r.back, r.front]; [r.frontContext, r.backContext] = [r.backContext, r.frontContext];
    ctx.context.drawImage(r.front, 0, 0);
  },
  pointerMove(ctx, x, y) { ctx.recursiveWindows.targetX = x; ctx.recursiveWindows.targetY = y; },
  pointerDown(ctx) { ctx.recursiveWindows.depth = ctx.recursiveWindows.depth >= 10 ? 3 : ctx.recursiveWindows.depth + 1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.recursiveWindows; },
});
