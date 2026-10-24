// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'delaunay',
  label: 'DELAUNAY SHATTER',
  note: engineCatalog[41].note,
  mount(ctx) {
    const columns = 14 + Math.floor(ctx.state.density / 10);
    const rows = Math.max(9, Math.round(columns * ctx.height / ctx.width));
    const points = [];
    for (let row = 0; row <= rows; row += 1) for (let column = 0; column <= columns; column += 1) {
      points.push({
        x: (column + (column > 0 && column < columns ? (ctx.random() - 0.5) * 0.7 : 0)) / columns * ctx.width,
        y: (row + (row > 0 && row < rows ? (ctx.random() - 0.5) * 0.7 : 0)) / rows * ctx.height,
      });
    }
    ctx.delaunay = { columns, rows, points, impacts: [], phase: 0 };
  },
  displaced(ctx, point, ts) {
    let x = point.x, y = point.y;
    const d = ctx.delaunay;
    if (ctx.pointer.active) {
      const dx = x - ctx.pointer.x, dy = y - ctx.pointer.y, distance = Math.hypot(dx, dy) || 1;
      const radius = 80 + ctx.state.force * 2;
      if (distance < radius) { const push = (1 - distance / radius) * (ctx.pointer.down ? 90 : 28); x += dx / distance * push; y += dy / distance * push; }
    }
    d.impacts.forEach((impact) => {
      const dx = x - impact.x, dy = y - impact.y, distance = Math.hypot(dx, dy) || 1;
      const wave = Math.exp(-Math.pow(distance - impact.radius, 2) / 900) * impact.life * (25 + ctx.state.chaos);
      x += dx / distance * wave; y += dy / distance * wave;
    });
    x += Math.sin(point.y * 0.015 + ts * 0.001) * ctx.state.chaos * 0.05;
    return { x, y };
  },
  frame(ctx, ts, dt) {
    const d = ctx.delaunay, c = ctx.context, stride = d.columns + 1;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const displayed = d.points.map(point => this.displaced(ctx, point, ts));
    for (let row = 0; row < d.rows; row += 1) for (let column = 0; column < d.columns; column += 1) {
      const a = displayed[row * stride + column], b = displayed[row * stride + column + 1];
      const c1 = displayed[(row + 1) * stride + column], d1 = displayed[(row + 1) * stride + column + 1];
      const triangles = (row + column) % 2 === 0 ? [[a,b,d1],[a,d1,c1]] : [[a,b,c1],[b,d1,c1]];
      triangles.forEach((triangle, index) => {
        c.beginPath(); c.moveTo(triangle[0].x, triangle[0].y); c.lineTo(triangle[1].x, triangle[1].y); c.lineTo(triangle[2].x, triangle[2].y); c.closePath();
        c.fillStyle = (row + column + index) % 3 === 0 ? ctx.palette.muted : ctx.palette.bg; c.globalAlpha = 0.12 + ((row + column) % 5) * 0.035; c.fill();
        c.strokeStyle = (row + column) % 4 === 0 ? ctx.palette.secondary : ctx.palette.primary; c.globalAlpha = 0.25 + ((row * column) % 7) * 0.06; c.lineWidth = 0.55; c.stroke();
      });
    }
    d.impacts.forEach((impact) => { impact.radius += dt * 0.22; impact.life -= dt / 1100; });
    d.impacts = d.impacts.filter(impact => impact.life > 0); c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) { ctx.delaunay.impacts.push({ x, y, radius: 0, life: 1 }); if (ctx.delaunay.impacts.length > 6) ctx.delaunay.impacts.shift(); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.delaunay; },
});
