// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, createShapeDescriptor, engineCatalog, sessionScores, updateScoreboard } from '../shared.js';

export default ({
  id: 'pong',
  label: 'SPLIT PONG',
  note: engineCatalog[3].note,
  mount(ctx) {
    const { width: w, height: h, random: r } = ctx;
    ctx.pong = {
      ball: null,
      leftY: h / 2, rightY: h / 2,
      paddleH: 66 + ctx.state.scale * 0.55,
      trail: [], rallies: 0, aiWobble: r() * Math.PI * 2, roundFlash: 0,
    };
    this.serve(ctx, r() > 0.5 ? 1 : -1);
  },
  serve(ctx, direction) {
    const game = ctx.pong, r = ctx.random;
    game.ball = {
      x: ctx.width / 2, y: ctx.height / 2,
      vx: direction * (3.1 + ctx.state.speed / 32), vy: (r() - 0.5) * 3.8,
      r: 8, shape: createShapeDescriptor(r),
    };
    game.trail = []; game.rallies = 0; game.roundFlash = 1;
  },
  frame(ctx, ts, dt) {
    const { context: c, width: w, height: h, palette: p, state: s, random: r } = ctx;
    const timeScale = dt / 16.67;
    const audioBoost = ctx.audio.paused ? 1 : 1 + Math.sin(ts * 0.005) * 0.3;
    const game = ctx.pong;

    c.fillStyle = p.bg; c.fillRect(0, 0, w, h);

    c.strokeStyle = p.muted; c.lineWidth = 1; c.setLineDash([4, 8]);
    c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.stroke(); c.setLineDash([]);

    const targetLeft = game.ball.y + Math.sin(ts * 0.0012 + game.aiWobble) * (42 + s.chaos * 0.55);
    game.leftY += (targetLeft - game.leftY) * (0.019 + s.speed * 0.00016) * timeScale;
    game.leftY = clamp(game.leftY, game.paddleH / 2, h - game.paddleH / 2);
    game.rightY = clamp(game.rightY, game.paddleH / 2, h - game.paddleH / 2);

    // Ball physics
    game.ball.x += game.ball.vx * timeScale * audioBoost;
    game.ball.y += game.ball.vy * timeScale * audioBoost;

    // Wall collisions
    if (game.ball.y < game.ball.r) { game.ball.y = game.ball.r; game.ball.vy *= -1; }
    if (game.ball.y > h - game.ball.r) { game.ball.y = h - game.ball.r; game.ball.vy *= -1; }

    // Paddle collisions
    const paddleW = 6;
    if (game.ball.vx < 0 && game.ball.x - game.ball.r < 20 + paddleW && game.ball.x + game.ball.r > 20) {
      if (Math.abs(game.ball.y - game.leftY) < game.paddleH / 2) {
        game.ball.x = 20 + paddleW + game.ball.r;
        game.ball.vx = Math.min(9, Math.abs(game.ball.vx) * 1.045);
        game.ball.vy += (game.ball.y - game.leftY) * 0.1;
        game.rallies++;
      }
    }
    if (game.ball.vx > 0 && game.ball.x + game.ball.r > w - 20 - paddleW && game.ball.x - game.ball.r < w - 20) {
      if (Math.abs(game.ball.y - game.rightY) < game.paddleH / 2) {
        game.ball.x = w - 20 - paddleW - game.ball.r;
        game.ball.vx = -Math.min(9, Math.abs(game.ball.vx) * 1.045);
        game.ball.vy += (game.ball.y - game.rightY) * 0.1;
        game.rallies++;
      }
    }

    // Reset on out of bounds
    if (game.ball.x < -game.ball.r) {
      sessionScores.pong.player += 1;
      updateScoreboard();
      this.serve(ctx, 1);
    } else if (game.ball.x > w + game.ball.r) {
      sessionScores.pong.ai += 1;
      updateScoreboard();
      this.serve(ctx, -1);
    }

    // Trail
    game.trail.push({ x: game.ball.x, y: game.ball.y, alpha: 1 });
    if (game.trail.length > 20) game.trail.shift();
    game.trail.forEach((t, i) => {
      c.globalAlpha = (i / game.trail.length) * 0.4;
      c.fillStyle = p.secondary;
      c.fillRect(t.x - 2, t.y - 2, 4, 4);
    });
    c.globalAlpha = 1;

    c.fillStyle = p.muted;
    c.fillRect(20, game.leftY - game.paddleH / 2, paddleW, game.paddleH);
    c.fillStyle = p.primary;
    c.fillRect(w - 20 - paddleW, game.rightY - game.paddleH / 2, paddleW, game.paddleH);

    c.fillStyle = p.primary;
    c.beginPath(); c.arc(game.ball.x, game.ball.y, game.ball.r * audioBoost, 0, Math.PI * 2); c.fill();

    c.globalAlpha = 0.4;
    c.fillStyle = p.secondary;
    for (let index = 0; index < Math.min(game.rallies, 24); index += 1) {
      c.fillRect(w / 2 - game.rallies * 3 + index * 6, 24, 3, 3);
    }
    game.roundFlash = Math.max(0, game.roundFlash - dt / 500);
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.pong.rightY = y; },
  pointerDown(ctx, x, y) { ctx.pong.rightY = y; },
  pointerUp(ctx) {},
  play(ctx) {},
  pause(ctx) {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.pong; },
});
