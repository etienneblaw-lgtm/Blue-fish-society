// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'tesseract',
  label: 'TESSERACT SLICE',
  note: engineCatalog[43].note,
  mount(ctx) {
    const vertices = [];
    for (let mask = 0; mask < 16; mask += 1) vertices.push([0, 1, 2, 3].map(axis => (mask & (1 << axis)) ? 1 : -1));
    const edges = [];
    for (let a = 0; a < vertices.length; a += 1) for (let b = a + 1; b < vertices.length; b += 1) {
      let differences = 0; for (let axis = 0; axis < 4; axis += 1) if (vertices[a][axis] !== vertices[b][axis]) differences += 1;
      if (differences === 1) edges.push([a, b]);
    }
    ctx.tesseract = { vertices, edges, targetX: 0.7, targetY: 0.8, x: 0.7, y: 0.8, projection: 1 };
  },
  rotate(point, a, b, angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle), first = point[a] * cos - point[b] * sin;
    point[b] = point[a] * sin + point[b] * cos; point[a] = first;
  },
  frame(ctx, ts) {
    const t = ctx.tesseract, c = ctx.context;
    t.x += (t.targetX - t.x) * 0.05; t.y += (t.targetY - t.y) * 0.05;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const projected = t.vertices.map((vertex) => {
      const point = [...vertex];
      this.rotate(point, 0, 3, t.x + ts * 0.00017); this.rotate(point, 1, 2, t.y - ts * 0.00011); this.rotate(point, 0, 2, ts * 0.00013); this.rotate(point, 1, 3, ts * 0.00009);
      const distance4 = 3.2 - point[3] * 0.7 * t.projection;
      const x3 = point[0] / distance4, y3 = point[1] / distance4, z3 = point[2] / distance4;
      const depth = 3.4 - z3;
      const scale = Math.min(ctx.width, ctx.height) * (0.8 + ctx.state.scale * 0.007) / depth;
      return { x: ctx.width / 2 + x3 * scale, y: ctx.height / 2 + y3 * scale, depth, w: point[3] };
    });
    t.edges.forEach(([a, b], index) => {
      const from = projected[a], to = projected[b];
      c.strokeStyle = index % 3 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = clamp(1.15 - (from.depth + to.depth) * 0.12, 0.18, 0.9); c.lineWidth = 0.6 + Math.abs(from.w + to.w) * 0.35;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
    });
    projected.forEach((point, index) => { c.fillStyle = index % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary; c.globalAlpha = 0.65; c.beginPath(); c.arc(point.x, point.y, 1.5 + ctx.state.density * 0.015, 0, Math.PI * 2); c.fill(); });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.tesseract.targetX = (x / ctx.width - 0.5) * Math.PI * 2; ctx.tesseract.targetY = (y / ctx.height - 0.5) * Math.PI * 2; },
  pointerDown(ctx) { ctx.tesseract.projection *= -1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.tesseract; },
});
