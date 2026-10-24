// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, createShapeDescriptor, traceTrippyShape, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'genesis',
  label: 'AUDIO GENESIS',
  note: engineCatalog[9].note,
  mount(ctx) {
    const { width: w, height: h, random: r } = ctx;
    ctx.genesis = { elements: [], progress: 0, playing: false };
    const count = Math.round(20 + ctx.state.density * 0.8);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + r() * 0.5;
      const dist = r() * Math.min(w, h) * 0.4;
      ctx.genesis.elements.push({
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        targetX: w / 2 + Math.cos(angle) * dist * (1 + r()),
        targetY: h / 2 + Math.sin(angle) * dist * (1 + r()),
        size: 0, targetSize: 4 + r() * 20,
        alpha: 0, targetAlpha: 0.3 + r() * 0.7,
        rotation: r() * Math.PI * 2,
        birthOrder: Math.floor(r() * count),
        shape: createShapeDescriptor(r),
      });
    }
    ctx.genesis.elements.sort((a, b) => a.birthOrder - b.birthOrder);
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s } = ctx;
    c.fillStyle = p.bg; c.fillRect(0, 0, w, h);

    if (ctx.genesis.playing && ctx.audio.duration) {
      ctx.genesis.progress = clamp(ctx.audio.currentTime / ctx.audio.duration);
    }

    const revealCount = Math.ceil(ctx.genesis.elements.length * ctx.genesis.progress);
    const audioPulse = ctx.audio.paused ? 0 : 0.5 + Math.sin(ts * 0.005) * 0.3;

    // Center pulse
    if (ctx.genesis.progress > 0) {
      c.globalAlpha = ctx.genesis.progress * 0.3;
      c.fillStyle = p.primary;
      c.beginPath();
      c.arc(w / 2, h / 2, 20 + ctx.genesis.progress * 60 + audioPulse * 20, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    } else {
      c.globalAlpha = 0.3 + Math.sin(ts * 0.002) * 0.2;
      c.fillStyle = p.primary;
      c.beginPath(); c.arc(w / 2, h / 2, 4, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    }

    ctx.genesis.elements.forEach((el, i) => {
      if (i >= revealCount) return;
      el.size += (el.targetSize - el.size) * 0.05;
      el.alpha += (el.targetAlpha - el.alpha) * 0.05;
      el.x += (el.targetX - el.x) * 0.02;
      el.y += (el.targetY - el.y) * 0.02;
      el.rotation += 0.003 * s.speed / 100;

      c.save();
      c.translate(el.x, el.y);
      c.rotate(el.rotation);
      c.globalAlpha = el.alpha;
      c.fillStyle = paletteTone(ctx, i + el.shape.kind);
      c.strokeStyle = paletteTone(ctx, i + el.shape.kind + 2);
      const pulseSize = el.size * (1 + audioPulse * 0.2);
      c.lineWidth = 1 + pulseSize * 0.04;
      traceTrippyShape(c, el.shape.kind, Math.max(1, pulseSize / 2), el.shape.phase + el.rotation);
      if (i % 3 === 0) { c.fill(); c.stroke(); } else c.stroke();
      c.restore();
    });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) {
    if (!ctx.genesis.playing) return;
    // Pointer disturbs elements slightly
    ctx.genesis.elements.forEach((el) => {
      const dx = el.x - x, dy = el.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) { el.targetX += dx / dist * 2; el.targetY += dy / dist * 2; }
    });
  },
  pointerDown(ctx, x, y) {},
  pointerUp(ctx) {},
  play(ctx) { ctx.genesis.playing = true; },
  pause(ctx) { ctx.genesis.playing = false; },
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.genesis; },
});
