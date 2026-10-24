// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { clamp, engineCatalog } from '../shared.js';

export default ({
  id: 'smoke',
  label: 'SMOKE ADVECTION',
  note: engineCatalog[27].note,
  mount(ctx) {
    const count = 280 + Math.floor(ctx.state.density * 7);
    ctx.smoke = { sourceX: ctx.width / 2, sourceY: ctx.height / 2, particles: [] };
    for (let index = 0; index < count; index += 1) ctx.smoke.particles.push(this.createParticle(ctx, true));
  },
  createParticle(ctx, spread = false) {
    const source = ctx.smoke || { sourceX: ctx.width / 2, sourceY: ctx.height / 2 };
    return {
      x: source.sourceX + (ctx.random() - 0.5) * (spread ? ctx.width * 0.5 : 18),
      y: source.sourceY + (ctx.random() - 0.5) * (spread ? ctx.height * 0.5 : 18),
      vx: (ctx.random() - 0.5) * 0.45,
      vy: -0.15 - ctx.random() * 0.45,
      life: spread ? ctx.random() : 0,
      maxLife: 0.8 + ctx.random() * 1.8,
      size: 5 + ctx.random() * (10 + ctx.state.scale * 0.35),
      tone: ctx.random(), phase: ctx.random() * Math.PI * 2,
    };
  },
  frame(ctx, ts, dt) {
    const smoke = ctx.smoke, c = ctx.context;
    c.fillStyle = ctx.palette.bg; c.globalAlpha = ctx.state.memory === 'accumulate' ? 0.06 : 0.14; c.fillRect(0, 0, ctx.width, ctx.height); c.globalAlpha = 1;
    const timeScale = dt / 16.67;
    if (!ctx.pointer.active) { smoke.sourceX = ctx.width / 2 + Math.sin(ts * 0.0004) * ctx.width * 0.22; smoke.sourceY = ctx.height * 0.65 + Math.cos(ts * 0.0003) * ctx.height * 0.12; }
    smoke.particles.forEach((particle, index) => {
      particle.life += dt / 1000;
      if (particle.life > particle.maxLife) Object.assign(particle, this.createParticle(ctx));
      const noise = Math.sin(particle.y * 0.015 + ts * 0.0007 + particle.phase) + Math.cos(particle.x * 0.011 - ts * 0.0005);
      particle.vx += noise * 0.008 * (1 + ctx.state.chaos / 25);
      particle.vy -= 0.003 + ctx.state.speed * 0.00008;
      if (ctx.pointer.active) {
        const dx = particle.x - ctx.pointer.x, dy = particle.y - ctx.pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < 150 + ctx.state.force) { particle.vx += dx / distance * 0.06; particle.vy += dy / distance * 0.06; }
      }
      particle.vx *= 0.985; particle.vy *= 0.985;
      particle.x += particle.vx * timeScale; particle.y += particle.vy * timeScale;
      const alpha = Math.sin(clamp(particle.life / particle.maxLife) * Math.PI) * 0.16;
      const gradient = c.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
      const color = particle.tone > 0.5 ? ctx.palette.primary : ctx.palette.secondary;
      gradient.addColorStop(0, color); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gradient; c.globalAlpha = alpha; c.beginPath(); c.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); c.fill();
    });
    c.globalAlpha = 1;
  },
  pointerMove(ctx, x, y) { ctx.smoke.sourceX = x; ctx.smoke.sourceY = y; },
  pointerDown(ctx, x, y) { for (let index = 0; index < 45; index += 1) ctx.smoke.particles[index % ctx.smoke.particles.length] = this.createParticle(ctx); },
  pointerUp() {}, play() {}, pause() {},
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { delete ctx.smoke; },
});
