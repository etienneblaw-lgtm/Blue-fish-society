// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'ferrofluid',
  label: 'FERROFLUID SPIKES',
  note: engineCatalog[26].note,
  mount(ctx) { ctx.ferrofluid = { centerX: ctx.width / 2, centerY: ctx.height / 2, targetX: ctx.width / 2, targetY: ctx.height / 2, pulse: 0 }; },
  frame(ctx, ts, dt) {
    const f = ctx.ferrofluid, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    f.centerX += (f.targetX - f.centerX) * 0.04; f.centerY += (f.targetY - f.centerY) * 0.04;
    f.pulse = Math.max(0, f.pulse - dt / 700);
    const pointerAngle = Math.atan2(ctx.pointer.y - f.centerY, ctx.pointer.x - f.centerX);
    const pointerDistance = Math.hypot(ctx.pointer.x - f.centerX, ctx.pointer.y - f.centerY);
    const segments = 180;
    const baseRadius = 65 + ctx.state.scale * 1.4 + (ctx.audio.paused ? 0 : Math.sin(ts * 0.005) * 12);
    c.beginPath();
    for (let index = 0; index <= segments; index += 1) {
      const angle = index / segments * Math.PI * 2;
      const alignment = Math.pow(Math.max(0, Math.cos(angle - pointerAngle)), 18);
      const magnetic = ctx.pointer.active ? alignment * (50 + ctx.state.force * 1.4) * clamp(1 - pointerDistance / 700) : 0;
      const harmonic = Math.sin(angle * (8 + Math.floor(ctx.state.chaos / 10)) + ts * 0.001) * (4 + ctx.state.chaos * 0.12);
      const radius = baseRadius + magnetic + harmonic + f.pulse * 75 * Math.sin(angle * 12);
      const x = f.centerX + Math.cos(angle) * radius, y = f.centerY + Math.sin(angle) * radius;
      if (index === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.closePath();
    const gradient = c.createRadialGradient(f.centerX, f.centerY, 0, f.centerX, f.centerY, baseRadius * 1.8);
    gradient.addColorStop(0, ctx.palette.primary); gradient.addColorStop(0.45, ctx.palette.muted); gradient.addColorStop(1, ctx.palette.bg);
    c.fillStyle = gradient; c.globalAlpha = 0.72; c.fill();
    c.strokeStyle = ctx.palette.secondary; c.globalAlpha = 0.95; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.ferrofluid.targetX = ctx.width / 2 + (x - ctx.width / 2) * 0.18; ctx.ferrofluid.targetY = ctx.height / 2 + (y - ctx.height / 2) * 0.18; },
  pointerDown(ctx) { ctx.ferrofluid.pulse = 1; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.ferrofluid; },
});
