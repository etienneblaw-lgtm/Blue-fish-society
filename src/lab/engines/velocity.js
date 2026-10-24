// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { mixColor, createShapeDescriptor, drawTrippyShape, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'velocity',
  label: 'VELOCITY SPECTRUM',
  note: engineCatalog[4].note,
  mount(ctx) {
    ctx.velocity = { trails: [], hue: Math.floor(ctx.random() * 360), lastHue: 180 };
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s, pointer } = ctx;
    const speed = pointer.speed;
    const audioPulse = ctx.audio.paused ? 0 : Math.sin(ts * 0.006) * 0.1;
    const tone = Math.floor(speed / 8 + ts * 0.0004 + ctx.velocity.hue / 90);
    c.fillStyle = mixColor(p.bg, paletteTone(ctx, tone), 0.06 + s.chaos * 0.0015 + audioPulse * 0.08);
    c.fillRect(0, 0, w, h);

    // Trail dots
    if (pointer.active && speed > 1) {
      ctx.velocity.trails.push({ x: pointer.x, y: pointer.y, tone, life: 0, size: 3 + speed * 0.2, shape: createShapeDescriptor(ctx.random) });
      if (ctx.velocity.trails.length > 80) ctx.velocity.trails.shift();
    }
    ctx.velocity.trails = ctx.velocity.trails.filter((t) => {
      t.life += dt;
      const fade = 1 - t.life / 2000;
      if (fade <= 0) return false;
      c.globalAlpha = fade * 0.6;
      c.fillStyle = paletteTone(ctx, t.tone);
      c.strokeStyle = paletteTone(ctx, t.tone + 2);
      c.lineWidth = 0.8;
      drawTrippyShape(c, t.shape, t.x, t.y, t.size * fade, 'both');
      return true;
    });
    c.globalAlpha = 1;

    c.strokeStyle = paletteTone(ctx, tone + 3);
    c.globalAlpha = 0.28;
    c.lineWidth = 2;
    drawTrippyShape(c, { kind: 1, phase: ts * 0.001, rotation: ts * 0.0001 }, w / 2, h / 2, Math.min(w, h) * (0.12 + speed * 0.0008), 'stroke');
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y, speed) {},
  pointerDown(ctx, x, y) {},
  pointerUp(ctx) {},
  play(ctx) {},
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.velocity; },
});
