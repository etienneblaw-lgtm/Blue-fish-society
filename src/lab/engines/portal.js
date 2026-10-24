// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { createShapeDescriptor, drawTrippyShape, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'portal',
  label: 'PORTAL CURSOR',
  note: engineCatalog[8].note,
  mount(ctx) {
    const { width: w, height: h, random: r } = ctx;
    ctx.portal = { radius: 80, phase: 0 };
    // Build two compositions on offscreen canvases
    ctx.portal.layerA = document.createElement('canvas');
    ctx.portal.layerB = document.createElement('canvas');
    [ctx.portal.layerA, ctx.portal.layerB].forEach((cv, idx) => {
      cv.width = w; cv.height = h;
      const cc = cv.getContext('2d');
      const p = ctx.palette;
      cc.fillStyle = idx === 0 ? p.bg : p.muted; cc.fillRect(0, 0, w, h);
      const count = Math.round(30 + ctx.state.density);
      for (let i = 0; i < count; i++) {
        cc.globalAlpha = 0.2 + r() * 0.8;
        cc.strokeStyle = paletteTone(ctx, i + idx * 2);
        cc.fillStyle = paletteTone(ctx, i + idx * 2 + 2);
        cc.lineWidth = 1 + r() * 4;
        const x = r() * w, y = r() * h, size = 5 + r() * 80;
        drawTrippyShape(cc, createShapeDescriptor(r), x, y, size, i % 3 === 0 ? 'both' : 'stroke');
      }
      cc.globalAlpha = 0.16;
      cc.strokeStyle = idx === 0 ? p.secondary : p.primary;
      cc.lineWidth = 12;
      drawTrippyShape(cc, { kind: idx === 0 ? 1 : 5, phase: r() * Math.PI * 2, rotation: r() * Math.PI }, w / 2, h / 2, Math.min(w, h) * (idx === 0 ? 0.2 : 0.34), 'stroke');
      cc.globalAlpha = 1;
    });
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s, pointer } = ctx;
    ctx.portal.phase += dt * 0.0005 * (1 + s.speed / 50);
    const radius = ctx.portal.radius + Math.sin(ctx.portal.phase) * 20 + s.force * 0.5;
    const actualRadius = pointer.active ? Math.max(20, radius) : 0;

    // Draw layer A full
    c.drawImage(ctx.portal.layerA, 0, 0);

    // Draw layer B through portal
    if (actualRadius > 0) {
      c.save();
      c.beginPath();
      c.arc(pointer.x, pointer.y, actualRadius, 0, Math.PI * 2);
      c.clip();
      c.drawImage(ctx.portal.layerB, 0, 0);
      c.restore();
      // Portal border
      c.strokeStyle = p.primary; c.lineWidth = 2; c.globalAlpha = 0.6;
      c.beginPath(); c.arc(pointer.x, pointer.y, actualRadius, 0, Math.PI * 2); c.stroke();
      c.globalAlpha = 1;
      // Inner glow ring
      c.strokeStyle = p.secondary; c.lineWidth = 1; c.globalAlpha = 0.3;
      c.beginPath(); c.arc(pointer.x, pointer.y, actualRadius * 0.7, 0, Math.PI * 2); c.stroke();
      c.globalAlpha = 1;
    }
  },
  pointerMove(ctx, x, y) {},
  pointerDown(ctx, x, y) { ctx.portal.radius = Math.min(300, ctx.portal.radius + 30); },
  pointerUp(ctx) {},
  play(ctx) {},
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.portal; },
});
