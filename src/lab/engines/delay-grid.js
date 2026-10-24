// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'delay-grid',
  label: 'TEMPORAL DELAY GRID',
  note: engineCatalog[33].note,
  mount(ctx) {
    const columns = 7 + Math.floor(ctx.state.density / 8);
    const rows = Math.max(5, Math.round(columns * ctx.height / ctx.width));
    ctx.delayGrid = { columns, rows, history: [], phase: 0, burst: 0 };
  },
  frame(ctx, ts, dt) {
    const d = ctx.delayGrid, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    d.phase += dt * 0.001;
    const sourceX = ctx.pointer.active ? ctx.pointer.x : ctx.width / 2 + Math.cos(d.phase) * ctx.width * 0.24;
    const sourceY = ctx.pointer.active ? ctx.pointer.y : ctx.height / 2 + Math.sin(d.phase * 1.3) * ctx.height * 0.2;
    d.history.unshift({ x: sourceX / ctx.width, y: sourceY / ctx.height, speed: ctx.pointer.speed });
    const maxHistory = d.columns * d.rows * 6;
    if (d.history.length > maxHistory) d.history.length = maxHistory;
    const cellWidth = ctx.width / d.columns, cellHeight = ctx.height / d.rows;
    for (let row = 0; row < d.rows; row += 1) {
      for (let column = 0; column < d.columns; column += 1) {
        const cellIndex = row * d.columns + column;
        const historyIndex = Math.min(d.history.length - 1, cellIndex * (2 + Math.floor(ctx.state.persistence / 20)));
        const point = d.history[Math.max(0, historyIndex)] || { x: 0.5, y: 0.5, speed: 0 };
        const localX = column * cellWidth + point.x * cellWidth;
        const localY = row * cellHeight + point.y * cellHeight;
        c.strokeStyle = cellIndex % 3 === 0 ? ctx.palette.secondary : ctx.palette.primary;
        c.globalAlpha = 0.25 + (1 - historyIndex / Math.max(1, maxHistory)) * 0.65;
        c.lineWidth = 0.7 + point.speed * 0.02;
        const radius = 2 + ctx.state.scale * 0.06 + d.burst * 12;
        c.beginPath(); c.arc(localX, localY, radius, 0, Math.PI * 2); c.stroke();
        if (ctx.state.chaos > 55) { c.beginPath(); c.moveTo(column * cellWidth, row * cellHeight); c.lineTo(localX, localY); c.stroke(); }
      }
    }
    d.burst = Math.max(0, d.burst - dt / 500); c.globalAlpha = 1;
  },
  pointerMove() {}, pointerDown(ctx) { ctx.delayGrid.burst = 1; }, pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.delayGrid; },
});
