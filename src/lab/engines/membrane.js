// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'membrane',
  label: 'ELASTIC MEMBRANE',
  note: engineCatalog[18].note,
  mount(ctx) {
    const columns = 12 + Math.floor(ctx.state.density / 4);
    const rows = Math.max(8, Math.round(columns * ctx.height / ctx.width));
    const points = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column / (columns - 1) * ctx.width;
        const y = row / (rows - 1) * ctx.height;
        points.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0, row, column });
      }
    }
    ctx.membrane = { points, columns, rows };
  },
  frame(ctx, ts, dt) {
    const m = ctx.membrane;
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const timeScale = dt / 16.67;
    m.points.forEach((point) => {
      point.vx += (point.baseX - point.x) * 0.018;
      point.vy += (point.baseY - point.y) * 0.018;
      if (ctx.pointer.active) {
        const dx = ctx.pointer.x - point.x, dy = ctx.pointer.y - point.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 70 + ctx.state.force * 2;
        if (distance < radius) {
          const direction = ctx.state.interaction === 'repel' ? -1 : 1;
          const power = (1 - distance / radius) * (ctx.pointer.down ? 1.5 : 0.35) * direction;
          point.vx += dx / distance * power; point.vy += dy / distance * power;
        }
      }
      if (!ctx.audio.paused) point.vy += Math.sin(ts * 0.006 + point.column * 0.5) * 0.02;
      point.vx *= 0.91; point.vy *= 0.91;
      point.x += point.vx * timeScale; point.y += point.vy * timeScale;
    });
    c.lineWidth = 0.5 + ctx.state.scale * 0.018;
    m.points.forEach((point, index) => {
      const right = point.column < m.columns - 1 ? m.points[index + 1] : null;
      const below = point.row < m.rows - 1 ? m.points[index + m.columns] : null;
      c.strokeStyle = (point.row + point.column) % 4 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = 0.34 + Math.abs(point.vx + point.vy) * 0.3;
      [right, below].forEach((neighbor) => {
        if (!neighbor) return;
        c.beginPath(); c.moveTo(point.x, point.y); c.lineTo(neighbor.x, neighbor.y); c.stroke();
      });
    });
    c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) {
    ctx.membrane.points.forEach((point) => {
      const dx = point.x - x, dy = point.y - y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 220) { const force = (1 - distance / 220) * 8; point.vx += dx / distance * force; point.vy += dy / distance * force; }
    });
  },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.membrane; },
});
