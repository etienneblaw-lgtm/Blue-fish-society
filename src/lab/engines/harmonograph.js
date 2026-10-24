// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'harmonograph',
  label: 'HARMONOGRAPH',
  note: engineCatalog[19].note,
  mount(ctx) {
    const cv = document.createElement('canvas'); cv.width = ctx.width; cv.height = ctx.height;
    const drawing = cv.getContext('2d'); drawing.fillStyle = ctx.palette.bg; drawing.fillRect(0, 0, ctx.width, ctx.height);
    ctx.harmonograph = { canvas: cv, drawing, time: 0, lastX: ctx.width / 2, lastY: ctx.height / 2, ratioX: 2.01, ratioY: 3.02 };
  },
  frame(ctx, ts, dt) {
    const h = ctx.harmonograph;
    const centerX = ctx.width / 2, centerY = ctx.height / 2;
    const amplitudeX = ctx.width * (0.18 + ctx.state.scale * 0.0025);
    const amplitudeY = ctx.height * (0.18 + ctx.state.scale * 0.0025);
    const iterations = 22 + Math.floor(ctx.state.speed / 3) + (ctx.audio.paused ? 0 : 18);
    for (let index = 0; index < iterations; index += 1) {
      h.time += 0.009 + ctx.state.speed * 0.00018;
      const decay = Math.exp(-h.time * 0.001 * (100 - ctx.state.persistence));
      const x = centerX + Math.sin(h.time * h.ratioX) * amplitudeX * decay + Math.sin(h.time * 0.31) * amplitudeX * 0.2;
      const y = centerY + Math.sin(h.time * h.ratioY + Math.PI / 2) * amplitudeY * decay + Math.cos(h.time * 0.27) * amplitudeY * 0.2;
      h.drawing.strokeStyle = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      h.drawing.globalAlpha = 0.32;
      h.drawing.lineWidth = 0.6 + ctx.state.force * 0.012;
      h.drawing.beginPath(); h.drawing.moveTo(h.lastX, h.lastY); h.drawing.lineTo(x, y); h.drawing.stroke();
      h.lastX = x; h.lastY = y;
    }
    ctx.context.fillStyle = ctx.palette.bg; ctx.context.fillRect(0, 0, ctx.width, ctx.height);
    ctx.context.drawImage(h.canvas, 0, 0);
  },
  pointerMove(ctx, x, y) { ctx.harmonograph.ratioX = 1 + x / ctx.width * 5; ctx.harmonograph.ratioY = 1 + y / ctx.height * 5; },
  pointerDown(ctx) { ctx.harmonograph.drawing.fillStyle = ctx.palette.bg; ctx.harmonograph.drawing.fillRect(0, 0, ctx.width, ctx.height); ctx.harmonograph.time = 0; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.harmonograph; },
});
