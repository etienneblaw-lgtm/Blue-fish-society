// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'caustics',
  label: 'CAUSTIC POOL',
  note: engineCatalog[28].note,
  mount(ctx) {
    const columns = 170, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    ctx.caustics = {
      columns, rows, canvas, drawing, image: drawing.createImageData(columns, rows),
      sources: Array.from({ length: 4 }, () => ({ x: ctx.random(), y: ctx.random(), phase: ctx.random() * Math.PI * 2 })),
    };
  },
  frame(ctx, ts) {
    const ca = ctx.caustics;
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    if (ctx.pointer.active) { ca.sources[0].x += (ctx.pointer.x / ctx.width - ca.sources[0].x) * 0.12; ca.sources[0].y += (ctx.pointer.y / ctx.height - ca.sources[0].y) * 0.12; }
    for (let py = 0; py < ca.rows; py += 1) {
      for (let px = 0; px < ca.columns; px += 1) {
        const x = px / ca.columns, y = py / ca.rows;
        let wave = 0;
        ca.sources.forEach((source, index) => {
          const distance = Math.hypot(x - source.x, y - source.y);
          wave += Math.sin(distance * (45 + ctx.state.scale * 0.32) - ts * (0.001 + ctx.state.speed * 0.00002) + source.phase + index);
        });
        const intensity = Math.pow(Math.abs(wave / ca.sources.length), 2.2);
        const offset = (py * ca.columns + px) * 4;
        ca.image.data[offset] = Math.round(background[0] * (1 - intensity) + primary[0] * intensity + secondary[0] * intensity * 0.4);
        ca.image.data[offset + 1] = Math.round(background[1] * (1 - intensity) + primary[1] * intensity + secondary[1] * intensity * 0.4);
        ca.image.data[offset + 2] = Math.round(background[2] * (1 - intensity) + primary[2] * intensity + secondary[2] * intensity * 0.4);
        ca.image.data[offset + 3] = 255;
      }
    }
    ca.drawing.putImageData(ca.image, 0, 0);
    ctx.context.imageSmoothingEnabled = true;
    ctx.context.drawImage(ca.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove() {},
  pointerDown(ctx, x, y) { ctx.caustics.sources.push({ x: x / ctx.width, y: y / ctx.height, phase: ctx.random() * Math.PI * 2 }); if (ctx.caustics.sources.length > 8) ctx.caustics.sources.splice(1, 1); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.caustics; },
});
