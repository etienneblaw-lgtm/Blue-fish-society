// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'feedback',
  label: 'RGB FEEDBACK',
  note: engineCatalog[15].note,
  mount(ctx) {
    const a = document.createElement('canvas'), b = document.createElement('canvas');
    a.width = b.width = ctx.width; a.height = b.height = ctx.height;
    const ac = a.getContext('2d'), bc = b.getContext('2d');
    ac.fillStyle = bc.fillStyle = ctx.palette.bg; ac.fillRect(0, 0, ctx.width, ctx.height); bc.fillRect(0, 0, ctx.width, ctx.height);
    const points = [];
    for (let index = 0; index < 36; index += 1) {
      const angle = index / 36 * Math.PI * 2;
      points.push({ x: ctx.width / 2 + Math.cos(angle) * 90, y: ctx.height / 2 + Math.sin(angle * 3) * 65, speed: 18 + index % 5 * 5 });
    }
    ctx.feedback = { front: a, back: b, frontContext: ac, backContext: bc, points, rotation: 0 };
  },
  frame(ctx, ts, dt) {
    const f = ctx.feedback;
    const back = f.backContext;
    back.save();
    back.globalAlpha = ctx.state.memory === 'accumulate' ? 0.985 : 0.94;
    back.fillStyle = ctx.palette.bg; back.fillRect(0, 0, ctx.width, ctx.height);
    back.translate(ctx.width / 2, ctx.height / 2);
    const zoom = 1.002 + ctx.state.speed * 0.00004 + (ctx.audio.paused ? 0 : 0.002);
    f.rotation += (ctx.state.chaos - 50) * 0.0000007 * dt;
    back.rotate(f.rotation);
    back.scale(zoom, zoom);
    back.drawImage(f.front, -ctx.width / 2, -ctx.height / 2);
    back.restore();
    f.points.forEach((point) => {
      const radius = 5 + point.speed * 0.28 + ctx.state.scale * 0.15;
      [[-8, '#ff3355'], [0, '#33ffcc'], [8, '#3355ff']].forEach(([offset, color]) => {
        back.globalAlpha = 0.55;
        back.fillStyle = color;
        back.beginPath(); back.arc(point.x + offset, point.y, radius, 0, Math.PI * 2); back.fill();
      });
    });
    f.points.length = 0;
    [f.front, f.back] = [f.back, f.front];
    [f.frontContext, f.backContext] = [f.backContext, f.frontContext];
    ctx.context.fillStyle = ctx.palette.bg; ctx.context.fillRect(0, 0, ctx.width, ctx.height);
    ctx.context.drawImage(f.front, 0, 0);
  },
  pointerMove(ctx, x, y, speed) { ctx.feedback.points.push({ x, y, speed }); },
  pointerDown(ctx, x, y) { ctx.feedback.points.push({ x, y, speed: 80 }); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.feedback; },
});
