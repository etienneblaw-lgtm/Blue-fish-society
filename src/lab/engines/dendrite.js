// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'dendrite',
  label: 'DENDRITE LIGHTNING',
  note: engineCatalog[49].note,
  mount(ctx) {
    const canvas = document.createElement('canvas'); canvas.width = ctx.width; canvas.height = ctx.height;
    const drawing = canvas.getContext('2d');
    ctx.dendrite = { canvas, drawing, tips: [], lastSeed: 0 };
    this.seed(ctx, ctx.width / 2, ctx.height / 2, 42);
  },
  seed(ctx, x, y, count) {
    for (let index = 0; index < count; index += 1) ctx.dendrite.tips.push({ x, y, angle: index / count * Math.PI * 2, life: 0, tone: ctx.random() });
  },
  frame(ctx, ts) {
    const d = ctx.dendrite, drawing = d.drawing, c = ctx.context;
    if (ctx.state.memory === 'evaporate') { drawing.fillStyle = ctx.palette.bg; drawing.globalAlpha = 0.008; drawing.fillRect(0, 0, ctx.width, ctx.height); drawing.globalAlpha = 1; }
    const iterations = 4 + Math.floor(ctx.state.speed / 14);
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const nextTips = [];
      d.tips.forEach((tip) => {
        const targetAngle = ctx.pointer.active ? Math.atan2(ctx.pointer.y - tip.y, ctx.pointer.x - tip.x) : tip.angle + Math.sin(ts * 0.0007 + tip.life) * 0.2;
        tip.angle += Math.atan2(Math.sin(targetAngle - tip.angle), Math.cos(targetAngle - tip.angle)) * (0.015 + ctx.state.force * 0.0008);
        tip.angle += (ctx.random() - 0.5) * (0.08 + ctx.state.chaos * 0.004);
        const length = 3.2 + ctx.state.scale * 0.05;
        const x = tip.x + Math.cos(tip.angle) * length, y = tip.y + Math.sin(tip.angle) * length;
        drawing.strokeStyle = tip.tone > 0.55 ? ctx.palette.secondary : ctx.palette.primary;
        drawing.globalAlpha = 0.2 + clamp(1 - tip.life / 500) * 0.55; drawing.lineWidth = 0.5 + clamp(1 - tip.life / 650) * 1.2;
        drawing.beginPath(); drawing.moveTo(tip.x, tip.y); drawing.lineTo(x, y); drawing.stroke();
        tip.x = x; tip.y = y; tip.life += 1;
        if (x > -20 && x < ctx.width + 20 && y > -20 && y < ctx.height + 20 && tip.life < 700) nextTips.push(tip);
        if (nextTips.length < 260 && tip.life > 10 && ctx.random() < 0.004 + ctx.state.density * 0.000055) nextTips.push({ x, y, angle: tip.angle + (ctx.random() > 0.5 ? 1 : -1) * (0.35 + ctx.random() * 0.65), life: tip.life, tone: 1 - tip.tone });
      });
      d.tips = nextTips;
    }
    if (d.tips.length === 0 || (d.tips.length < 5 && ts - d.lastSeed > 900)) { this.seed(ctx, ctx.random() * ctx.width, ctx.random() * ctx.height, 8); d.lastSeed = ts; }
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 0.9; c.drawImage(d.canvas, 0, 0); c.globalAlpha = 1;
  },
  pointerMove() {},
  pointerDown(ctx, x, y) { this.seed(ctx, x, y, 10 + Math.floor(ctx.state.force / 8)); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.dendrite; },
});
