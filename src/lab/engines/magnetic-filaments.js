// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'magnetic-filaments',
  label: 'MAGNETIC FILAMENTS',
  note: engineCatalog[38].note,
  mount(ctx) { ctx.magneticFilaments = { x: ctx.width * 0.62, y: ctx.height * 0.5, targetX: ctx.width * 0.62, targetY: ctx.height * 0.5, polarity: 1 }; },
  field(ctx, x, y, time) {
    const m = ctx.magneticFilaments;
    const poles = [
      { x: m.x, y: m.y, charge: m.polarity },
      { x: ctx.width - m.x, y: ctx.height - m.y, charge: -m.polarity },
      { x: ctx.width / 2 + Math.cos(time) * ctx.width * 0.18, y: ctx.height / 2 + Math.sin(time * 1.3) * ctx.height * 0.14, charge: 0.55 },
    ];
    let vx = 0, vy = 0;
    poles.forEach((pole) => {
      const dx = x - pole.x, dy = y - pole.y;
      const distanceSq = Math.max(90, dx * dx + dy * dy);
      const force = pole.charge / distanceSq;
      vx += dx * force; vy += dy * force;
    });
    const length = Math.hypot(vx, vy) || 1;
    return { x: vx / length, y: vy / length };
  },
  frame(ctx, ts) {
    const m = ctx.magneticFilaments, c = ctx.context;
    m.x += (m.targetX - m.x) * 0.06; m.y += (m.targetY - m.y) * 0.06;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const lines = 22 + Math.floor(ctx.state.density * 0.22);
    const steps = 58 + Math.floor(ctx.state.scale * 0.4);
    const stepSize = 4 + ctx.state.scale * 0.035;
    for (let line = 0; line < lines; line += 1) {
      const angle = line / lines * Math.PI * 2;
      let x = m.x + Math.cos(angle) * (9 + ctx.state.force * 0.08);
      let y = m.y + Math.sin(angle) * (9 + ctx.state.force * 0.08);
      c.beginPath(); c.moveTo(x, y);
      for (let step = 0; step < steps; step += 1) {
        const field = this.field(ctx, x, y, ts * 0.00025);
        x += field.x * stepSize * m.polarity; y += field.y * stepSize * m.polarity;
        c.lineTo(x, y);
        if (x < -20 || x > ctx.width + 20 || y < -20 || y > ctx.height + 20) break;
      }
      c.strokeStyle = line % 3 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      c.globalAlpha = 0.18 + (line % 5) * 0.08; c.lineWidth = 0.7 + (line % 4) * 0.2; c.stroke();
    }
    c.globalAlpha = 0.9; c.fillStyle = ctx.palette.primary; c.beginPath(); c.arc(m.x, m.y, 4, 0, Math.PI * 2); c.fill();
    c.strokeStyle = ctx.palette.secondary; c.beginPath(); c.arc(ctx.width - m.x, ctx.height - m.y, 7, 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.magneticFilaments.targetX = x; ctx.magneticFilaments.targetY = y; },
  pointerDown(ctx) { ctx.magneticFilaments.polarity *= -1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.magneticFilaments; },
});
