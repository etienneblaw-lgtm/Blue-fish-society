// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'voxel-erosion',
  label: 'VOXEL EROSION',
  note: engineCatalog[51].note,
  mount(ctx) {
    const columns = 25, rows = 19, base = new Float32Array(columns * rows), heights = new Float32Array(columns * rows);
    for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
      const dx = column / columns - 0.5, dy = row / rows - 0.5;
      const value = 5 + Math.sin(column * 0.48) * 2.4 + Math.cos(row * 0.57) * 2 + Math.exp(-(dx * dx + dy * dy) * 12) * 9 + ctx.random() * 2;
      base[row * columns + column] = value; heights[row * columns + column] = value;
    }
    ctx.voxelErosion = { columns, rows, base, heights, originX: ctx.width / 2, originY: ctx.height * 0.14, pulse: 0 };
  },
  alter(ctx, x, y, radius, amount) {
    const v = ctx.voxelErosion;
    const tileWidth = Math.min(34, ctx.width / (v.columns + v.rows) * 1.7), tileHeight = tileWidth * 0.48;
    const a = (x - v.originX) / (tileWidth / 2), b = (y - v.originY) / (tileHeight / 2);
    const centerColumn = (a + b) / 2, centerRow = (b - a) / 2;
    for (let row = 0; row < v.rows; row += 1) for (let column = 0; column < v.columns; column += 1) {
      const distance = Math.hypot(column - centerColumn, row - centerRow);
      if (distance < radius) v.heights[row * v.columns + column] = clamp(v.heights[row * v.columns + column] + amount * (1 - distance / radius), 0.2, 22);
    }
  },
  frame(ctx, ts, dt) {
    const v = ctx.voxelErosion, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const tileWidth = Math.min(34, ctx.width / (v.columns + v.rows) * 1.7), tileHeight = tileWidth * 0.48, heightScale = 2 + ctx.state.scale * 0.065;
    for (let index = 0; index < v.heights.length; index += 1) {
      const heal = ctx.state.memory === 'heal' ? 0.008 : 0.0015;
      v.heights[index] += (v.base[index] - v.heights[index]) * heal * dt / 16.67;
    }
    for (let diagonal = 0; diagonal < v.columns + v.rows - 1; diagonal += 1) {
      for (let row = 0; row < v.rows; row += 1) {
        const column = diagonal - row; if (column < 0 || column >= v.columns) continue;
        const height = v.heights[row * v.columns + column] + (ctx.audio.paused ? 0 : Math.sin(ts * 0.003 + column * 0.5 + row * 0.35) * 0.35);
        const x = v.originX + (column - row) * tileWidth / 2;
        const baseY = v.originY + (column + row) * tileHeight / 2;
        const topY = baseY - height * heightScale;
        c.globalAlpha = 0.26 + clamp(height / 18) * 0.62;
        c.fillStyle = ctx.palette.primary; c.beginPath(); c.moveTo(x, topY - tileHeight / 2); c.lineTo(x + tileWidth / 2, topY); c.lineTo(x, topY + tileHeight / 2); c.lineTo(x - tileWidth / 2, topY); c.closePath(); c.fill();
        c.fillStyle = ctx.palette.muted; c.beginPath(); c.moveTo(x - tileWidth / 2, topY); c.lineTo(x, topY + tileHeight / 2); c.lineTo(x, baseY + tileHeight / 2); c.lineTo(x - tileWidth / 2, baseY); c.closePath(); c.fill();
        c.fillStyle = ctx.palette.secondary; c.beginPath(); c.moveTo(x + tileWidth / 2, topY); c.lineTo(x, topY + tileHeight / 2); c.lineTo(x, baseY + tileHeight / 2); c.lineTo(x + tileWidth / 2, baseY); c.closePath(); c.fill();
      }
    }
    v.pulse = Math.max(0, v.pulse - dt / 600); c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y, speed) { if (speed > 2) this.alter(ctx, x, y, 2.5 + ctx.state.force * 0.025, ctx.state.interaction === 'attract' ? 0.16 : -0.2); },
  pointerDown(ctx, x, y) { this.alter(ctx, x, y, 4 + ctx.state.force * 0.045, ctx.state.interaction === 'attract' ? 5 : -7); ctx.voxelErosion.pulse = 1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.voxelErosion; },
});
