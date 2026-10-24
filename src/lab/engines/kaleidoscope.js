// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'kaleidoscope',
  label: 'KALEIDOSCOPE BRUSH',
  note: engineCatalog[10].note,
  mount(ctx) {
    const cv = document.createElement('canvas');
    cv.width = ctx.width; cv.height = ctx.height;
    const brush = cv.getContext('2d');
    ctx.kaleidoscope = {
      canvas: cv,
      brush,
      centerX: ctx.width / 2,
      centerY: ctx.height / 2,
      lastX: null,
      lastY: null,
      symmetry: 6 + Math.floor(ctx.state.density / 12),
      rotation: 0,
    };
    brush.fillStyle = ctx.palette.bg;
    brush.fillRect(0, 0, ctx.width, ctx.height);
    for (let index = 0; index < 24; index += 1) {
      const angle = index / 24 * Math.PI * 2;
      const radius = 40 + ctx.random() * Math.min(ctx.width, ctx.height) * 0.3;
      this.drawPoint(ctx, ctx.kaleidoscope.centerX + Math.cos(angle) * radius, ctx.kaleidoscope.centerY + Math.sin(angle) * radius, 2 + ctx.random() * 8);
    }
  },
  drawPoint(ctx, x, y, speed) {
    const k = ctx.kaleidoscope;
    const dx = x - k.centerX;
    const dy = y - k.centerY;
    const previousDx = k.lastX === null ? dx : k.lastX - k.centerX;
    const previousDy = k.lastY === null ? dy : k.lastY - k.centerY;
    const brush = k.brush;
    brush.lineCap = 'round';
    brush.lineWidth = 1.5 + ctx.state.scale * 0.08 + speed * 0.08;
    for (let index = 0; index < k.symmetry; index += 1) {
      const angle = index / k.symmetry * Math.PI * 2;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const color = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      [-1, 1].forEach((mirror) => {
        const px = k.centerX + (previousDx * cos - previousDy * sin) * mirror;
        const py = k.centerY + previousDx * sin + previousDy * cos;
        const nx = k.centerX + (dx * cos - dy * sin) * mirror;
        const ny = k.centerY + dx * sin + dy * cos;
        brush.strokeStyle = color;
        brush.globalAlpha = 0.5 + ctx.state.force / 250;
        brush.beginPath(); brush.moveTo(px, py); brush.lineTo(nx, ny); brush.stroke();
      });
    }
    brush.globalAlpha = 1;
    k.lastX = x; k.lastY = y;
  },
  frame(ctx, ts, dt) {
    const k = ctx.kaleidoscope;
    const c = ctx.context;
    if (ctx.state.memory === 'evaporate') {
      k.brush.fillStyle = ctx.palette.bg;
      k.brush.globalAlpha = 0.012;
      k.brush.fillRect(0, 0, ctx.width, ctx.height);
      k.brush.globalAlpha = 1;
    }
    if (!ctx.audio.paused) k.rotation += dt * 0.00003 * (1 + ctx.state.speed / 20);
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    c.save();
    c.translate(k.centerX, k.centerY);
    c.rotate(k.rotation);
    c.drawImage(k.canvas, -k.centerX, -k.centerY);
    c.restore();
  },
  pointerMove(ctx, x, y, speed) { this.drawPoint(ctx, x, y, speed); },
  pointerDown(ctx, x, y) { ctx.kaleidoscope.centerX = x; ctx.kaleidoscope.centerY = y; ctx.kaleidoscope.lastX = null; },
  pointerUp(ctx) { ctx.kaleidoscope.lastX = null; },
  play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.kaleidoscope; },
});
