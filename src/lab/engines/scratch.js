// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { createShapeDescriptor, drawTrippyShape, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'scratch',
  label: 'SCRATCH LAYER',
  note: engineCatalog[0].note,
  mount(ctx) {
    const { width: w, height: h, palette: p, random: r } = ctx;
    const hiddenCanvas = document.createElement('canvas');
    const coverCanvas = document.createElement('canvas');
    hiddenCanvas.width = coverCanvas.width = w;
    hiddenCanvas.height = coverCanvas.height = h;
    const hidden = hiddenCanvas.getContext('2d');
    const cover = coverCanvas.getContext('2d');
    ctx.scratch = { lastX: -1, lastY: -1, regrowing: false, hiddenCanvas, coverCanvas, hidden, cover };
    hidden.fillStyle = p.bg;
    hidden.fillRect(0, 0, w, h);
    const shapes = Math.floor(12 + ctx.state.density / 5);
    for (let i = 0; i < shapes; i++) {
      hidden.globalAlpha = 0.45 + r() * 0.55;
      hidden.strokeStyle = paletteTone(ctx, i + Math.floor(r() * 5));
      hidden.fillStyle = paletteTone(ctx, i + 2);
      hidden.lineWidth = 1 + r() * 4;
      const x = r() * w, y = r() * h, size = 10 + r() * Math.min(w, h) * 0.18;
      drawTrippyShape(hidden, createShapeDescriptor(r), x, y, size, i % 3 === 0 ? 'both' : 'stroke');
    }
    hidden.globalAlpha = 0.28;
    hidden.strokeStyle = p.secondary;
    hidden.lineWidth = 8;
    drawTrippyShape(hidden, { kind: 1, phase: r() * Math.PI * 2, rotation: 0 }, w / 2, h / 2, Math.min(w, h) * 0.24, 'stroke');
    hidden.globalAlpha = 1;
    cover.fillStyle = p.primary;
    cover.fillRect(0, 0, w, h);
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p } = ctx;
    if (ctx.scratch.regrowing && ctx.state.memory === 'heal') {
      const cover = ctx.scratch.cover;
      cover.globalCompositeOperation = 'source-over';
      cover.globalAlpha = 0.012 + (100 - ctx.state.persistence) * 0.00015;
      cover.fillStyle = p.primary;
      cover.fillRect(0, 0, w, h);
      cover.globalAlpha = 1;
    }
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, w, h);
    c.drawImage(ctx.scratch.hiddenCanvas, 0, 0);
    c.drawImage(ctx.scratch.coverCanvas, 0, 0);
  },
  pointerMove(ctx, x, y) {
    const { state: s } = ctx;
    const c = ctx.scratch.cover;
    c.globalCompositeOperation = 'destination-out';
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = 12 + s.force / 100 * 50 + (ctx.pointer.down ? 30 : 0);
    c.beginPath();
    if (ctx.scratch.lastX >= 0) { c.moveTo(ctx.scratch.lastX, ctx.scratch.lastY); c.lineTo(x, y); }
    else { c.arc(x, y, c.lineWidth / 2, 0, Math.PI * 2); }
    c.stroke();
    ctx.scratch.lastX = x;
    ctx.scratch.lastY = y;
    c.globalCompositeOperation = 'source-over';
    ctx.scratch.regrowing = false;
  },
  pointerDown(ctx, x, y) { ctx.scratch.lastX = x; ctx.scratch.lastY = y; },
  pointerUp(ctx) { ctx.scratch.lastX = -1; ctx.scratch.lastY = -1; ctx.scratch.regrowing = ctx.state.memory === 'heal'; },
  play(ctx) {},
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.scratch; },
});
