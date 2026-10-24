// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { createShapeDescriptor, paletteTone, engineCatalog, sessionScores, updateScoreboard } from '../shared.js';

export default ({
  id: 'breakout',
  label: 'BREAKOUT REVEAL',
  note: engineCatalog[6].note,
  mount(ctx) {
    ctx.breakout = { blocks: [], ball: null, launched: false, level: 0, clearedAt: 0 };
    this.buildWall(ctx);
  },
  buildWall(ctx) {
    const { width: w, height: h, random: r } = ctx;
    ctx.breakout.blocks = [];
    const cols = Math.max(8, Math.round(8 + ctx.state.density * 0.12));
    const blockW = w / cols;
    const blockH = 22;
    const rows = Math.min(12, Math.floor(h * 0.5 / blockH));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (r() < 0.15) continue;
        ctx.breakout.blocks.push({
          x: col * blockW, y: 40 + row * blockH, w: blockW - 2, h: blockH - 2,
          alive: true, tone: r(), shape: createShapeDescriptor(r),
        });
      }
    }
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s, random: r } = ctx;
    const timeScale = dt / 16.67;
    c.fillStyle = p.bg; c.fillRect(0, 0, w, h);

    c.globalAlpha = 0.18;
    c.strokeStyle = p.primary;
    c.lineWidth = 9;
    c.beginPath(); c.arc(w / 2, h * 0.3, Math.min(w, h) * 0.17, 0, Math.PI * 2); c.stroke();
    c.globalAlpha = 1;

    // Draw blocks
    ctx.breakout.blocks.forEach((b) => {
      if (!b.alive) return;
      c.fillStyle = paletteTone(ctx, Math.floor(b.tone * p.accents.length));
      c.globalAlpha = 0.7;
      c.fillRect(b.x, b.y, b.w, b.h);
    });
    c.globalAlpha = 1;

    // Ball
    if (ctx.breakout.ball) {
      const ball = ctx.breakout.ball;
      if (ctx.breakout.launched) {
        ball.x += ball.vx * timeScale;
        ball.y += ball.vy * timeScale;
        if (ball.x < ball.r) { ball.x = ball.r; ball.vx *= -1; }
        if (ball.x > w - ball.r) { ball.x = w - ball.r; ball.vx *= -1; }
        if (ball.y < ball.r) { ball.y = ball.r; ball.vy *= -1; }
        if (ball.y > h - ball.r) {
          ctx.breakout.ball = null;
          ctx.breakout.launched = false;
          ctx.breakout.level = 0;
          this.buildWall(ctx);
          sessionScores.breakout.score = 0;
          sessionScores.breakout.best = 0;
          updateScoreboard();
        }
        // Paddle
        const paddleY = h - 20;
        if (ball.y > paddleY - ball.r && ball.y < paddleY + 10 && ball.vy > 0) {
          ball.vy *= -1;
          ball.vx += (ball.x - ctx.pointer.x) * 0.05;
        }
        // Block collision
        let hitBlock = false;
        ctx.breakout.blocks.forEach((b) => {
          if (!b.alive) return;
          if (ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y - ball.r && ball.y < b.y + b.h + ball.r) {
            b.alive = false;
            if (!hitBlock) { ball.vy *= -1; hitBlock = true; }
            sessionScores.breakout.score += 10;
            sessionScores.breakout.best = Math.max(sessionScores.breakout.best, sessionScores.breakout.score);
            updateScoreboard();
          }
        });
        if (ctx.breakout.blocks.length > 0 && ctx.breakout.blocks.every(block => !block.alive)) {
          ctx.breakout.level += 1;
          ctx.breakout.launched = false;
          ctx.breakout.ball = null;
          this.buildWall(ctx);
          ctx.breakout.clearedAt = ts;
        }
      } else {
        ball.x = ctx.pointer.x || w / 2;
        ball.y = h - 40;
      }
      c.fillStyle = paletteTone(ctx, ctx.breakout.level + 1);
      c.beginPath(); c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); c.fill();
    }

    c.fillStyle = paletteTone(ctx, 0);
    c.fillRect((ctx.pointer.x || w / 2) - 40, h - 20, 80, 4);

    if (!ctx.breakout.launched) {
      c.strokeStyle = p.muted; c.globalAlpha = 0.6; c.lineWidth = 1;
      c.beginPath(); c.arc(w / 2, h - 45, 8 + Math.sin(ts * 0.004) * 3, 0, Math.PI * 2); c.stroke();
    }
  },
  pointerMove(ctx, x, y) {},
  pointerDown(ctx, x, y) {
    if (!ctx.breakout.launched) {
      ctx.breakout.ball = { x, y: ctx.height - 40, vx: (ctx.random() - 0.5) * 4, vy: -5, r: 7, shape: createShapeDescriptor(ctx.random) };
      ctx.breakout.launched = true;
    }
  },
  pointerUp(ctx) {},
  play(ctx) {
    if (!ctx.breakout.launched) {
      ctx.breakout.ball = { x: ctx.width / 2, y: ctx.height - 40, vx: 2, vy: -5, r: 7, shape: createShapeDescriptor(ctx.random) };
      ctx.breakout.launched = true;
    }
  },
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.breakout; },
});
