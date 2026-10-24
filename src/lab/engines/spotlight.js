// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { createShapeDescriptor, drawTrippyShape, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'spotlight',
  label: 'SPOTLIGHT',
  note: engineCatalog[5].note,
  mount(ctx) {
    const { context: c, width: w, height: h, palette: p, random: r } = ctx;
    // Draw hidden content on a separate canvas
    ctx.spotlight = { hiddenCanvas: document.createElement('canvas'), spotR: 120 };
    const hc = ctx.spotlight.hiddenCanvas;
    hc.width = w; hc.height = h;
    const hctx = hc.getContext('2d');
    hctx.fillStyle = p.bg; hctx.fillRect(0, 0, w, h);
    const count = Math.floor(15 + ctx.state.density * 0.5);
    for (let i = 0; i < count; i++) {
      hctx.globalAlpha = 0.2 + r() * 0.8;
      hctx.strokeStyle = paletteTone(ctx, i + Math.floor(r() * 5));
      hctx.fillStyle = paletteTone(ctx, i + 3);
      hctx.lineWidth = 1 + r() * 5;
      const x = r() * w, y = r() * h, size = 12 + r() * Math.min(w, h) * 0.2;
      drawTrippyShape(hctx, createShapeDescriptor(r), x, y, size, i % 4 === 0 ? 'both' : 'stroke');
    }
    hctx.globalAlpha = 0.12;
    hctx.strokeStyle = p.primary;
    hctx.lineWidth = 10;
    drawTrippyShape(hctx, { kind: 4, phase: r() * Math.PI * 2, rotation: r() * Math.PI }, w / 2, h / 2, Math.min(w, h) * 0.28, 'stroke');
    hctx.globalAlpha = 1;
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s, pointer } = ctx;
    c.fillStyle = p.bg; c.fillRect(0, 0, w, h);
    // Draw hidden content
    c.drawImage(ctx.spotlight.hiddenCanvas, 0, 0);
    // Dark overlay
    const audioPulse = ctx.audio.paused ? 0 : Math.sin(ts * 0.004) * 40;
    const radius = ctx.spotlight.spotR + audioPulse + s.force * 0.8;
    const actualRadius = pointer.active ? radius : 0;
    const grad = c.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.max(1, actualRadius));
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.7, 'rgba(0,0,0,0.5)');
    grad.addColorStop(1, p.bg);
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);
    // Spotlight ring
    if (pointer.active) {
      c.strokeStyle = p.primary; c.globalAlpha = 0.4; c.lineWidth = 1;
      c.beginPath(); c.arc(pointer.x, pointer.y, actualRadius, 0, Math.PI * 2); c.stroke();
      c.globalAlpha = 1;
    }
  },
  pointerMove(ctx, x, y) {},
  pointerDown(ctx, x, y) { ctx.spotlight.spotR = Math.min(400, ctx.spotlight.spotR + 30); },
  pointerUp(ctx) {},
  play(ctx) {},
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.spotlight; },
});
