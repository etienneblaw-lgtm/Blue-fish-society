// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'impossible-room',
  label: 'IMPOSSIBLE ROOM',
  note: engineCatalog[34].note,
  mount(ctx) { ctx.impossibleRoom = { rotationX: 0.55, rotationY: 0.65, targetX: 0.55, targetY: 0.65, flip: 1 }; },
  project(ctx, x, y, z) {
    const room = ctx.impossibleRoom;
    const cy = Math.cos(room.rotationY), sy = Math.sin(room.rotationY), cx = Math.cos(room.rotationX), sx = Math.sin(room.rotationX);
    const rotatedX = x * cy - z * sy;
    const rotatedZ = x * sy + z * cy;
    const rotatedY = y * cx - rotatedZ * sx;
    const depth = y * sx + rotatedZ * cx + 4;
    const scale = Math.min(ctx.width, ctx.height) * 0.2 / Math.max(0.8, depth);
    return { x: ctx.width / 2 + rotatedX * scale * room.flip, y: ctx.height / 2 + rotatedY * scale, depth };
  },
  frame(ctx, ts) {
    const room = ctx.impossibleRoom, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    room.rotationX += (room.targetX - room.rotationX) * 0.04; room.rotationY += (room.targetY - room.rotationY) * 0.04;
    const layers = 3 + Math.floor(ctx.state.density / 28);
    for (let layer = layers - 1; layer >= 0; layer -= 1) {
      const size = 1 + layer * 0.55;
      const vertices = [
        [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
        [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size],
      ].map(([x, y, z]) => this.project(ctx, x, y, z));
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      c.strokeStyle = layer % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      c.globalAlpha = 0.18 + (layers - layer) / layers * 0.65;
      c.lineWidth = 0.7 + layer * 0.35;
      edges.forEach(([a, b]) => { c.beginPath(); c.moveTo(vertices[a].x, vertices[a].y); c.lineTo(vertices[b].x, vertices[b].y); c.stroke(); });
      [[0,2,5,7],[1,3,4,6]].forEach((order) => {
        c.beginPath(); order.forEach((index, position) => position === 0 ? c.moveTo(vertices[index].x, vertices[index].y) : c.lineTo(vertices[index].x, vertices[index].y)); c.closePath(); c.stroke();
      });
    }
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.impossibleRoom.targetY = (x / ctx.width - 0.5) * Math.PI * 1.7; ctx.impossibleRoom.targetX = (y / ctx.height - 0.5) * Math.PI * 1.25; },
  pointerDown(ctx) { ctx.impossibleRoom.flip *= -1; }, pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.impossibleRoom; },
});
