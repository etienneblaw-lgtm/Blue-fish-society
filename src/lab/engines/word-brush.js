// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { trackName, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'word-brush',
  label: 'WORD BRUSH',
  note: engineCatalog[1].note,
  mount(ctx) {
    const { layer } = ctx;
    layer.innerHTML = '';
    layer.style.background = ctx.palette.bg;
    ctx.brush = { words: [], lastEmit: 0, corrupting: false };
  },
  frame(ctx, ts, dt) {
    if (!ctx.brush) return;
    const s = ctx.state;
    const lifeMult = s.memory === 'evaporate' ? 2 : s.memory === 'heal' ? 8 : 999;
    const corrupt = ctx.brush.corrupting;
    ctx.brush.words = ctx.brush.words.filter((word) => {
      word.life += dt;
      if (corrupt && word.life > 800 && ctx.random() < 0.02) {
        word.el.textContent = trackName;
        word.el.style.color = ctx.palette.secondary;
        word.el.style.transform += ` skew(${(ctx.random() - 0.5) * 28}deg)`;
      }
      if (word.life > 1000 * lifeMult && s.memory !== 'accumulate') {
        word.el.style.opacity = Math.max(0, parseFloat(word.el.style.opacity || '1') - dt / 600);
        if (parseFloat(word.el.style.opacity) <= 0) { word.el.remove(); return false; }
      }
      return true;
    });
  },
  pointerMove(ctx, x, y, speed) {
    if (!ctx.pointer.active) return;
    const now = performance.now();
    if (now - ctx.brush.lastEmit < 40) return;
    ctx.brush.lastEmit = now;
    const s = ctx.state;
    const size = 10 + speed * 0.4 + s.scale * 0.3;
    const el = document.createElement('span');
    el.textContent = trackName;
    el.style.cssText = `position:absolute;font:${size}px 'JetBrains Mono',monospace;color:${paletteTone(ctx, Math.floor(ctx.random() * ctx.palette.accents.length))};opacity:0;transition:opacity 0.2s;pointer-events:none;white-space:nowrap;left:${x}px;top:${y}px;transform:translate(-50%,-50%) rotate(${(ctx.random()-0.5)*20}deg)`;
    ctx.layer.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = 0.6 + ctx.random() * 0.4; });
    ctx.brush.words.push({ el, life: 0 });
    if (ctx.brush.words.length > 200) { const old = ctx.brush.words.shift(); old.el.remove(); }
  },
  pointerDown(ctx, x, y) {},
  pointerUp(ctx) {},
  play(ctx) { ctx.brush.corrupting = true; },
  pause(ctx) { ctx.brush.corrupting = false; },
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) { ctx.layer.innerHTML = ''; delete ctx.brush; },
});
