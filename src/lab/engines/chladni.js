// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'chladni',
  label: 'CHLADNI PLATE',
  note: engineCatalog[24].note,
  mount(ctx) {
    const count = 2200 + Math.floor(ctx.state.density * 35);
    ctx.chladni = {
      grains: Array.from({ length: count }, () => ({ x: ctx.random(), y: ctx.random(), phase: ctx.random() * Math.PI * 2 })),
      modeX: 3.1, modeY: 5.2,
    };
  },
  frame(ctx, ts) {
    const ch = ctx.chladni;
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    const audio = ctx.audio.paused ? 0 : Math.sin(ts * 0.002) * 0.35;
    ch.grains.forEach((grain, index) => {
      const x = (grain.x - 0.5) * Math.PI * 2;
      const y = (grain.y - 0.5) * Math.PI * 2;
      const field = Math.sin((ch.modeX + audio) * x) * Math.sin(ch.modeY * y) - Math.sin(ch.modeY * x) * Math.sin((ch.modeX + audio) * y);
      const intensity = Math.exp(-Math.abs(field) * (6 + ctx.state.force * 0.12));
      if (intensity < 0.08) return;
      c.globalAlpha = intensity * 0.82;
      c.fillStyle = index % 11 === 0 ? ctx.palette.secondary : ctx.palette.primary;
      const size = 0.7 + intensity * (1.2 + ctx.state.scale * 0.018);
      c.fillRect(grain.x * ctx.width, grain.y * ctx.height, size, size);
    });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.chladni.modeX = 1.5 + x / ctx.width * 8; ctx.chladni.modeY = 1.5 + y / ctx.height * 8; },
  pointerDown(ctx) { const value = ctx.chladni.modeX; ctx.chladni.modeX = ctx.chladni.modeY; ctx.chladni.modeY = value; },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.chladni; },
});
