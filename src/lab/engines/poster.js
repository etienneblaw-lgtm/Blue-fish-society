// Généré par Script/bluefish_sync_lab_engines.mjs depuis bluefish-experience-lab/app.js. Ne pas modifier à la main.
import { trippyShapeCount, paletteTone, engineCatalog } from '../shared.js';

export default ({
  id: 'poster',
  label: 'DRAGGABLE SCULPTURE',
  note: engineCatalog[7].note,
  mount(ctx) {
    const { layer, width: w, height: h, palette: p, random: r } = ctx;
    layer.innerHTML = '';
    layer.style.background = p.bg;
    ctx.poster = { items: [], dragging: null, drifting: false };
    const fragments = Array.from({ length: 18 }, (_, index) => ({
      shape: index % trippyShapeCount,
      width: 22 + r() * Math.min(180, w * 0.18),
      height: 22 + r() * Math.min(180, h * 0.22),
    }));
    const clips = [
      'polygon(50% 0,68% 30%,100% 35%,74% 56%,84% 100%,50% 74%,12% 92%,26% 56%,0 34%,34% 30%)',
      'polygon(0 22%,45% 0,100% 18%,68% 48%,100% 79%,43% 100%,0 76%,28% 50%)',
      'polygon(50% 0,100% 25%,76% 48%,100% 100%,49% 76%,0 100%,22% 49%,0 18%)',
      'polygon(0 42%,30% 18%,44% 0,63% 28%,100% 41%,73% 58%,57% 100%,39% 72%,0 61%)',
      'polygon(16% 0,68% 13%,100% 46%,73% 70%,62% 100%,34% 78%,0 61%,19% 39%)',
      'polygon(50% 0,70% 27%,100% 30%,77% 53%,89% 87%,54% 73%,23% 100%,26% 60%,0 35%,34% 29%)',
      'polygon(0 16%,50% 0,100% 18%,80% 45%,100% 84%,49% 100%,0 80%,20% 50%)',
    ];
    fragments.forEach((f, i) => {
      const el = document.createElement('div');
      const filled = f.shape % 3 === 0;
      const color = paletteTone(ctx, i + f.shape);
      el.style.cssText = `position:absolute;width:${f.width}px;height:${f.height}px;border:2px solid ${color};background:${filled ? color : 'transparent'};clip-path:${clips[f.shape]};cursor:grab;user-select:none;transform:rotate(${(r()-0.5)*140}deg);left:${r()*w*0.72}px;top:${r()*h*0.72}px;opacity:${0.35+r()*0.6};z-index:${i+1};touch-action:none`;
      const item = { el, vx: 0, vy: 0 };
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        ctx.poster.dragging = { item, offsetX: e.clientX - el.offsetLeft, offsetY: e.clientY - el.offsetTop };
        el.style.cursor = 'grabbing'; el.style.zIndex = '999';
      });
      ctx.poster.items.push(item);
      layer.appendChild(el);
    });
    // Global drag handling
    ctx.poster.onPointerMove = (e) => {
      if (!ctx.poster.dragging) return;
      const { item, offsetX, offsetY } = ctx.poster.dragging;
      item.el.style.left = `${e.clientX - offsetX}px`;
      item.el.style.top = `${e.clientY - offsetY}px`;
    };
    ctx.poster.onPointerUp = () => {
      if (ctx.poster.dragging) { ctx.poster.dragging.item.el.style.cursor = 'grab'; ctx.poster.dragging = null; }
    };
    layer.addEventListener('pointermove', ctx.poster.onPointerMove);
    window.addEventListener('pointerup', ctx.poster.onPointerUp);
  },
  frame(ctx, ts, dt) {
    if (ctx.poster.drifting) {
      ctx.poster.items.forEach((item) => {
        if (item === ctx.poster.dragging?.item) return;
        const left = parseFloat(item.el.style.left);
        const top = parseFloat(item.el.style.top);
        item.el.style.left = `${left + Math.sin(ts * 0.001 + item.el.offsetLeft) * 0.3}px`;
        item.el.style.top = `${top + Math.cos(ts * 0.0008 + item.el.offsetTop) * 0.3}px`;
      });
    }
  },
  pointerMove(ctx, x, y) {},
  pointerDown(ctx, x, y) {},
  pointerUp(ctx) {},
  play(ctx) { ctx.poster.drifting = true; },
  pause(ctx) { ctx.poster.drifting = false; },
  reset(ctx) { this.mount(ctx); },
  unmount(ctx) {
    if (ctx.poster.onPointerMove) ctx.layer.removeEventListener('pointermove', ctx.poster.onPointerMove);
    if (ctx.poster.onPointerUp) window.removeEventListener('pointerup', ctx.poster.onPointerUp);
    ctx.layer.innerHTML = '';
    delete ctx.poster;
  },
});
