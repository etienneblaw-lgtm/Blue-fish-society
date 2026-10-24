// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { engineCatalog } from '../shared.js';

export default ({
  id: 'loop-recorder',
  label: 'LOOP RECORDER',
  note: engineCatalog[21].note,
  mount(ctx) {
    const points = [];
    for (let index = 0; index < 90; index += 1) {
      const angle = index / 90 * Math.PI * 2;
      points.push({ x: ctx.width / 2 + Math.cos(angle) * 90, y: ctx.height / 2 + Math.sin(angle * 2) * 55, time: index * 22 });
    }
    ctx.loopRecorder = { points, recording: false, startTime: 0, playbackStart: performance.now() };
  },
  frame(ctx, ts) {
    const loop = ctx.loopRecorder;
    const c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.fillRect(0, 0, ctx.width, ctx.height);
    if (loop.points.length < 2) return;
    const duration = Math.max(300, loop.points[loop.points.length - 1].time || 2000);
    const playhead = ((ts - loop.playbackStart) * (ctx.audio.paused ? 1 : 1.5)) % duration;
    const copies = 4 + Math.floor(ctx.state.density / 18);
    for (let copy = 0; copy < copies; copy += 1) {
      const delayed = (playhead - copy * duration / copies + duration) % duration;
      let currentIndex = loop.points.findIndex((point) => point.time >= delayed);
      if (currentIndex < 1) currentIndex = 1;
      const visible = Math.max(2, Math.floor(loop.points.length * (0.15 + ctx.state.persistence * 0.006)));
      c.strokeStyle = copy % 2 === 0 ? ctx.palette.primary : ctx.palette.secondary;
      c.globalAlpha = 0.16 + (1 - copy / copies) * 0.6;
      c.lineWidth = 0.8 + ctx.state.scale * 0.025;
      c.beginPath();
      for (let offset = 0; offset < visible; offset += 1) {
        const point = loop.points[(currentIndex - offset + loop.points.length) % loop.points.length];
        const angle = copy / copies * Math.PI * 2 * (ctx.state.chaos / 50);
        const dx = point.x - ctx.width / 2, dy = point.y - ctx.height / 2;
        const x = ctx.width / 2 + dx * Math.cos(angle) - dy * Math.sin(angle);
        const y = ctx.height / 2 + dx * Math.sin(angle) + dy * Math.cos(angle);
        if (offset === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
    }
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) {
    if (!ctx.loopRecorder.recording) return;
    const elapsed = performance.now() - ctx.loopRecorder.startTime;
    if (elapsed <= 3200) ctx.loopRecorder.points.push({ x, y, time: elapsed });
  },
  pointerDown(ctx, x, y) {
    ctx.loopRecorder.points = [{ x, y, time: 0 }];
    ctx.loopRecorder.recording = true;
    ctx.loopRecorder.startTime = performance.now();
  },
  pointerUp(ctx) { ctx.loopRecorder.recording = false; ctx.loopRecorder.playbackStart = performance.now(); },
  play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.loopRecorder; },
});
