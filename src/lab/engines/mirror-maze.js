// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'mirror-maze',
  label: 'MIRROR MAZE',
  note: engineCatalog[48].note,
  mount(ctx) {
    const columns = 13 + Math.floor(ctx.state.density / 18), rows = Math.max(8, Math.round(columns * ctx.height / ctx.width));
    ctx.mirrorMaze = {
      columns, rows, mirrors: Array.from({ length: columns * rows }, (_, index) => ({ angle: (index + Math.floor(ctx.random() * 2)) % 2 === 0 ? Math.PI * 0.25 : -Math.PI * 0.25 })),
      sourceY: ctx.height * 0.5, pulse: 0,
    };
  },
  frame(ctx, ts, dt) {
    const m = ctx.mirrorMaze, c = ctx.context, cellWidth = ctx.width / m.columns, cellHeight = ctx.height / m.rows;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    m.mirrors.forEach((mirror, index) => {
      const column = index % m.columns, row = Math.floor(index / m.columns), x = (column + 0.5) * cellWidth, y = (row + 0.5) * cellHeight;
      if (ctx.pointer.active && Math.hypot(ctx.pointer.x - x, ctx.pointer.y - y) < Math.max(cellWidth, cellHeight) * 1.2) mirror.angle += (Math.atan2(ctx.pointer.y - y, ctx.pointer.x - x) - mirror.angle) * 0.08;
      const length = Math.min(cellWidth, cellHeight) * 0.34;
      c.strokeStyle = index % 5 === 0 ? ctx.palette.secondary : ctx.palette.muted; c.globalAlpha = 0.32; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(x - Math.cos(mirror.angle) * length, y - Math.sin(mirror.angle) * length); c.lineTo(x + Math.cos(mirror.angle) * length, y + Math.sin(mirror.angle) * length); c.stroke();
    });
    const rays = 2 + Math.floor(ctx.state.density / 40);
    for (let rayIndex = 0; rayIndex < rays; rayIndex += 1) {
      let x = 0, y = m.sourceY + (rayIndex - (rays - 1) / 2) * 11, angle = m.pulse * 0.18 + Math.sin(ts * 0.0004 + rayIndex) * 0.03;
      let lastCell = -1;
      c.beginPath(); c.moveTo(x, y);
      for (let step = 0; step < 720; step += 1) {
        x += Math.cos(angle) * 3.2; y += Math.sin(angle) * 3.2;
        if (x < 0 || x > ctx.width || y < 0 || y > ctx.height) break;
        const column = Math.floor(x / cellWidth), row = Math.floor(y / cellHeight), cell = row * m.columns + column;
        if (cell !== lastCell) {
          const mirror = m.mirrors[cell];
          if (mirror && (step + cell) % 3 === 0) angle = 2 * mirror.angle - angle;
          lastCell = cell;
        }
        c.lineTo(x, y);
      }
      c.strokeStyle = rayIndex % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary; c.globalAlpha = 0.75; c.lineWidth = 1 + rayIndex * 0.4; c.stroke();
    }
    m.pulse = Math.max(0, m.pulse - dt / 700); c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.mirrorMaze.sourceY = y; },
  pointerDown(ctx, x, y) {
    const m = ctx.mirrorMaze, column = Math.floor(x / ctx.width * m.columns), row = Math.floor(y / ctx.height * m.rows), mirror = m.mirrors[row * m.columns + column];
    if (mirror) mirror.angle += Math.PI * 0.5; m.pulse = 1;
  },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.mirrorMaze; },
});
