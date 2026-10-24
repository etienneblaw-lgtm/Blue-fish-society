// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, hexToRgb, engineCatalog } from '../shared.js';

export default ({
  id: 'voronoi',
  label: 'VORONOI MELT',
  note: engineCatalog[25].note,
  mount(ctx) {
    const columns = 145, rows = Math.round(columns * ctx.height / ctx.width);
    const canvas = document.createElement('canvas'); canvas.width = columns; canvas.height = rows;
    const drawing = canvas.getContext('2d');
    const count = 12 + Math.floor(ctx.state.density / 3);
    ctx.voronoi = {
      canvas, drawing, image: drawing.createImageData(columns, rows), columns, rows, lastRender: 0,
      sites: Array.from({ length: count }, (_, index) => ({ x: ctx.random(), y: ctx.random(), vx: (ctx.random() - 0.5) * 0.0003, vy: (ctx.random() - 0.5) * 0.0003, tone: index / count })),
    };
  },
  render(ctx, ts) {
    const v = ctx.voronoi;
    const primary = hexToRgb(ctx.palette.primary), secondary = hexToRgb(ctx.palette.secondary), background = hexToRgb(ctx.palette.bg);
    for (let py = 0; py < v.rows; py += 1) {
      for (let px = 0; px < v.columns; px += 1) {
        const x = px / v.columns, y = py / v.rows;
        let nearest = Infinity, second = Infinity, selected = v.sites[0];
        v.sites.forEach((site) => {
          const dx = x - site.x, dy = y - site.y;
          const distance = dx * dx + dy * dy;
          if (distance < nearest) { second = nearest; nearest = distance; selected = site; }
          else if (distance < second) second = distance;
        });
        const edge = clamp((second - nearest) * (180 + ctx.state.force * 4));
        const pulse = 0.5 + Math.sin(selected.tone * 18 + ts * 0.001) * 0.5;
        const offset = (py * v.columns + px) * 4;
        v.image.data[offset] = Math.round(background[0] * (1 - edge) + primary[0] * edge * pulse + secondary[0] * edge * (1 - pulse));
        v.image.data[offset + 1] = Math.round(background[1] * (1 - edge) + primary[1] * edge * pulse + secondary[1] * edge * (1 - pulse));
        v.image.data[offset + 2] = Math.round(background[2] * (1 - edge) + primary[2] * edge * pulse + secondary[2] * edge * (1 - pulse));
        v.image.data[offset + 3] = 255;
      }
    }
    v.drawing.putImageData(v.image, 0, 0);
  },
  frame(ctx, ts, dt) {
    const v = ctx.voronoi;
    v.sites.forEach((site, index) => {
      if (index === 0 && ctx.pointer.active) { site.x += (ctx.pointer.x / ctx.width - site.x) * 0.08; site.y += (ctx.pointer.y / ctx.height - site.y) * 0.08; return; }
      site.x += site.vx * dt; site.y += site.vy * dt;
      if (site.x < 0 || site.x > 1) site.vx *= -1;
      if (site.y < 0 || site.y > 1) site.vy *= -1;
    });
    if (ts - v.lastRender > 55) { this.render(ctx, ts); v.lastRender = ts; }
    ctx.context.imageSmoothingEnabled = true;
    ctx.context.drawImage(v.canvas, 0, 0, ctx.width, ctx.height);
  },
  pointerMove() {},
  pointerDown(ctx, x, y) { ctx.voronoi.sites.push({ x: x / ctx.width, y: y / ctx.height, vx: 0, vy: 0, tone: ctx.random() }); if (ctx.voronoi.sites.length > 55) ctx.voronoi.sites.shift(); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.voronoi; },
});
