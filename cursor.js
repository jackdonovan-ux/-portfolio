(function () {
  // JDUX custom cursor — minimal difference-blend dot + trailing hairline ring.
  if (window.__jduxCursor) return;
  // Pointer-only; skip touch / coarse pointers.
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  window.__jduxCursor = true;

  var INTERACTIVE = 'a,button,input,textarea,select,label,summary,' +
    '[data-btn],[data-cs-jump],[data-thought],[data-nav],[data-mnav],[data-toggle],' +
    '[data-home-trig],[data-g3-step],[data-prev],[data-next],[role="button"],[onclick],' +
    '[style*="cursor:pointer"],[style*="cursor: pointer"]';

  function init() {
    if (document.getElementById('jdux-cursor-dot')) return;

    var style = document.createElement('style');
    style.textContent =
      '*{cursor:none!important}' +
      '#jdux-cursor-dot,#jdux-cursor-ring{position:fixed;top:0;left:0;z-index:2147483647;' +
      'pointer-events:none;border-radius:50%;mix-blend-mode:difference;will-change:transform;' +
      'transform:translate(-50%,-50%);opacity:0}' +
      '#jdux-cursor-dot{width:8px;height:8px;background:#fff;transition:opacity .25s ease,width .2s ease,height .2s ease}' +
      '#jdux-cursor-ring{width:34px;height:34px;border:1px solid #fff;' +
      'transition:width .28s cubic-bezier(.4,0,.2,1),height .28s cubic-bezier(.4,0,.2,1),opacity .3s ease,border-color .3s ease}';
    document.head.appendChild(style);

    var dot = document.createElement('div'); dot.id = 'jdux-cursor-dot';
    var ring = document.createElement('div'); ring.id = 'jdux-cursor-ring';
    document.body.appendChild(ring); document.body.appendChild(dot);

    var mx = -100, my = -100, rx = -100, ry = -100, shown = false, grow = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; dot.style.opacity = '1'; ring.style.opacity = '1'; }
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    }, { passive: true });

    document.addEventListener('mouseleave', function () { shown = false; dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function (e) { mx = e.clientX; my = e.clientY; });

    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      var hit = t && t.closest && t.closest(INTERACTIVE);
      if (!!hit !== grow) {
        grow = !!hit;
        ring.style.width = grow ? '54px' : '34px';
        ring.style.height = grow ? '54px' : '34px';
        dot.style.opacity = (shown && grow) ? '0' : (shown ? '1' : '0');
      }
    });

    (function raf() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(raf);
    })();
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
