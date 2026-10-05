/* STITCHING website script */

/* Project start date, used for the "Month X" marker on the work plan.
   Update it if the official start date differs. Months are 0-based: 4 = May. */
const PROJECT_START = new Date(2026, 4, 1);

/* Mobile menu */
(function(){
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
})();

/* Work plan "now" marker */
(function(){
  const body = document.getElementById('gbody');
  if (!body) return;
  const now = new Date();
  const m = (now.getFullYear() - PROJECT_START.getFullYear()) * 12
          + (now.getMonth() - PROJECT_START.getMonth()) + now.getDate() / 31;
  if (m < 0 || m > 36) return;
  const track = body.querySelector('.g-track');
  const marker = document.createElement('div');
  marker.className = 'now';
  marker.setAttribute('aria-hidden', 'true');
  marker.innerHTML = '<span>Month ' + Math.ceil(m) + '</span>';
  body.appendChild(marker);
  const place = () => {
    const b = body.getBoundingClientRect(), t = track.getBoundingClientRect();
    marker.style.left = (t.left - b.left + t.width * (m / 36)) + 'px';
  };
  place();
  window.addEventListener('resize', place);
})();

/* Home hero: pores close as the healing front passes */
(function(){
  const svg = document.querySelector('.micro');
  if (!svg) return;
  const front = document.getElementById('front');
  const replay = document.getElementById('replay');
  const W = 1600, FADE = 240, DUR = 4200;
  const data = [...svg.querySelectorAll('#pores g')].map(g => ({
    x: +g.dataset.x, p: g.querySelector('.pore'), h: g.querySelector('.healed')
  }));
  function render(x){
    front.setAttribute('transform', 'translate(' + x + ' 0)');
    for (const d of data){
      const k = Math.min(1, Math.max(0, (x - d.x) / FADE));
      const s = 1 - k * k * (3 - 2 * k);
      d.p.setAttribute('transform', 'scale(' + s.toFixed(3) + ')');
      d.h.style.opacity = (k * 0.7).toFixed(2);
    }
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    render(W * 0.55);
    return;
  }
  let t0 = null;
  function frame(t){
    if (t0 === null) t0 = t;
    const p = Math.min(1, (t - t0) / DUR);
    const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    render(-80 + (W + FADE + 400) * e);
    if (p < 1) requestAnimationFrame(frame); else replay.hidden = false;
  }
  function start(){
    t0 = null; replay.hidden = true; render(-80);
    setTimeout(() => requestAnimationFrame(frame), 700);
  }
  replay.addEventListener('click', start);
  start();
})();
