/**
 * Orrery — randomized orbiting planet dots with visible orbit rings.
 * Canvas sits behind page content. Call window.orreryRegenerate() or
 * click the #orrery-regen button to randomize a new solar system.
 *
 * Usage: <script src="js/orrery.js"></script> before </body>.
 * No dependencies.
 */
(function () {
  /* ── canvas setup ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'orrery';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  /* ── color pool ── */
  const PALETTE = [
    '#f5a623', '#e8d5a3', '#5b9bd5', '#d45d5d', '#e8c170',
    '#c9b97a', '#7eccc6', '#6e8ef5', '#a78bfa', '#f472b6',
    '#34d399', '#fbbf24', '#fb923c', '#94a3b8', '#e2e8f0',
  ];

  /* ── helpers ── */
  function rand(lo, hi) { return lo + Math.random() * (hi - lo); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function hexToGlow(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  /* ── generate random planets ── */
  var planets = [];

  function generate() {
    planets = [];
    var count = Math.floor(rand(5, 12));
    /* spread orbits evenly with jitter so they don't overlap */
    var step = 0.6 / count;
    for (var i = 0; i < count; i++) {
      var color = pick(PALETTE);
      planets.push({
        radius: 0.06 + step * i + rand(-step * 0.15, step * 0.15),
        size:   rand(2, 6),
        color:  color,
        glow:   hexToGlow(color, rand(0.12, 0.3)),
        speed:  rand(0.00003, 0.0009) * (Math.random() < 0.5 ? 1 : -1),
        angle:  rand(0, Math.PI * 2),
      });
    }
  }

  generate();

  /* expose for external use */
  window.orreryRegenerate = generate;

  /* wire up button if present */
  var btn = document.getElementById('orrery-regen');
  if (btn) btn.addEventListener('click', generate);

  /* ── viewport state ── */
  var cx, cy, unit;

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx   = window.innerWidth  / 2;
    cy   = window.innerHeight / 2;
    unit = Math.min(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', resize);
  resize();

  /* ── sun ── */
  function drawSun() {
    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
    grad.addColorStop(0, 'rgba(255,220,120,0.9)');
    grad.addColorStop(0.5, 'rgba(255,200,80,0.25)');
    grad.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe8a0';
    ctx.fill();
  }

  /* ── track current screen positions for hit-testing ── */
  var lastTime = 0;

  /* ── click to randomize a planet ── */
  var HIT_PADDING = 12; /* extra px around the dot for easier clicking */

  document.addEventListener('click', function (e) {
    if (!planets.length || !unit) return;
    var mx = e.clientX;
    var my = e.clientY;

    for (var i = planets.length - 1; i >= 0; i--) {
      var p  = planets[i];
      var r  = p.radius * unit;
      var a  = p.angle + p.speed * lastTime;
      var px = cx + Math.cos(a) * r;
      var py = cy + Math.sin(a) * r;
      var dx = mx - px;
      var dy = my - py;
      var hitRadius = p.size + HIT_PADDING;

      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        /* freeze current angle so the planet doesn't jump */
        p.angle = a;
        /* new color */
        var newColor = pick(PALETTE);
        p.color = newColor;
        p.glow  = hexToGlow(newColor, rand(0.12, 0.3));
        /* new speed & direction */
        p.speed = rand(0.00003, 0.0009) * (Math.random() < 0.5 ? 1 : -1);
        /* reset angle base so freeze works with new speed */
        p.angle = a - p.speed * lastTime;
        break;
      }
    }
  });

  /* ── animation loop ── */
  function draw(t) {
    lastTime = t;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawSun();

    for (var i = 0; i < planets.length; i++) {
      var p = planets[i];
      var r = p.radius * unit;

      /* orbit ring */
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      /* planet position */
      var a  = p.angle + p.speed * t;
      var px = cx + Math.cos(a) * r;
      var py = cy + Math.sin(a) * r;

      /* glow */
      var glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
      glow.addColorStop(0, p.glow);
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* dot */
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
