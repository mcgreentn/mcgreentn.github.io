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
    hoveredIndex = -1;
    chargeIndex  = -1;
    resetPageContent();
    var count = Math.floor(rand(6, 15));
    /* spread orbits evenly with jitter so they don't overlap */
    var step = 0.58 / count;
    for (var i = 0; i < count; i++) {
      var color = pick(PALETTE);
      var speed = rand(0.00003, 0.00022) * (Math.random() < 0.5 ? 1 : -1);
      planets.push({
        radius:    0.14 + step * i + rand(-step * 0.15, step * 0.15),
        size:      rand(2, 6),
        color:     color,
        glow:      hexToGlow(color, rand(0.12, 0.3)),
        speed:     speed,
        prevSpeed: speed,
        angle:     rand(0, Math.PI * 2),
        trail:     [],
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
  var hoveredIndex = -1;

  /* ── hover: freeze planet and show glow hint ── */
  var HIT_PADDING = 12; /* extra px around the dot for easier clicking */

  function findPlanetAt(mx, my) {
    for (var i = planets.length - 1; i >= 0; i--) {
      var p  = planets[i];
      var r  = p.radius * unit;
      var a  = p.angle + p.speed * lastTime;
      var px = cx + Math.cos(a) * r;
      var py = cy + Math.sin(a) * r;
      var dx = mx - px;
      var dy = my - py;
      if (dx * dx + dy * dy <= (p.size + HIT_PADDING) * (p.size + HIT_PADDING)) return i;
    }
    return -1;
  }

  function freezePlanet(p) {
    p.prevSpeed = p.speed;
    p.angle = p.angle + p.speed * lastTime;
    p.speed = 0;
  }

  function unfreezePlanet(p) {
    p.speed = p.prevSpeed;
    p.angle = p.angle - p.speed * lastTime;
  }

  document.addEventListener('mousemove', function (e) {
    if (bhPhase) return;
    var idx = findPlanetAt(e.clientX, e.clientY);
    if (idx !== hoveredIndex) {
      if (hoveredIndex !== -1) unfreezePlanet(planets[hoveredIndex]);
      hoveredIndex = idx;
      if (idx !== -1) freezePlanet(planets[idx]);
    }
    document.body.style.cursor = idx !== -1 ? 'pointer' : '';
  });

  document.addEventListener('mouseleave', function () {
    if (hoveredIndex !== -1) {
      unfreezePlanet(planets[hoveredIndex]);
      hoveredIndex = -1;
    }
    document.body.style.cursor = '';
  });

  /* ── charge-up: hold to set speed, tap for slow ── */
  var CHARGE_MAX_MS = 2000;
  var chargeIndex   = -1;
  var chargeStart   = 0;

  function applyCharge() {
    if (chargeIndex === -1) return;
    var p      = planets[chargeIndex];
    var held   = performance.now() - chargeStart;
    var charge = Math.min(held / CHARGE_MAX_MS, 1);
    var newSpeed = (0.00003 + charge * 0.0047) * (Math.random() < 0.5 ? 1 : -1);
    var newColor = pick(PALETTE);
    p.color     = newColor;
    p.glow      = hexToGlow(newColor, rand(0.12, 0.3));
    p.prevSpeed = newSpeed;
    p.speed     = newSpeed;
    p.angle     = p.angle - p.speed * lastTime;
    triggerRipple(charge, '#ffe8a0');
    chargeIndex = -1;
  }

  document.addEventListener('mousedown', function (e) {
    if (bhPhase || !planets.length || !unit) return;
    var idx = findPlanetAt(e.clientX, e.clientY);
    if (idx === -1) return;
    chargeIndex = idx;
    chargeStart = performance.now();
  });

  document.addEventListener('mouseup', applyCharge);

  /* ── touch support ── */
  document.addEventListener('touchstart', function (e) {
    if (bhPhase || !planets.length || !unit) return;
    var t   = e.touches[0];
    var idx = findPlanetAt(t.clientX, t.clientY);
    if (idx === -1) return;
    e.preventDefault();
    chargeIndex  = idx;
    chargeStart  = performance.now();
    hoveredIndex = idx;
    freezePlanet(planets[idx]);
  }, {passive: false});

  document.addEventListener('touchend', function (e) {
    if (chargeIndex !== -1) e.preventDefault();
    hoveredIndex = -1;
    if (chargeIndex !== -1 && planets[chargeIndex]) {
      unfreezePlanet(planets[chargeIndex]);
    }
    applyCharge();
  }, {passive: false});

  /* ── trail constants ── */
  var TRAIL_THRESHOLD = 0.0005; /* min speed before trail appears */
  var TRAIL_MAX       = 22;     /* max stored positions */

  /* ── electric spark ── */
  function drawSpark(x, y, angle, length, alpha) {
    var pts = [{x: x, y: y}];
    var segments = 3;
    var perp = angle + Math.PI / 2;
    for (var s = 1; s <= segments; s++) {
      var frac   = s / segments;
      var bx     = x + Math.cos(angle) * length * frac;
      var by     = y + Math.sin(angle) * length * frac;
      var offset = (Math.random() - 0.5) * length * 0.5;
      pts.push({x: bx + Math.cos(perp) * offset, y: by + Math.sin(perp) * offset});
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.strokeStyle = 'rgba(180,220,255,' + alpha + ')';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
  }

  /* ── solar ripples ── */
  var ripples = [];

  function triggerRipple(charge, color) {
    /* low charge → 1 ring; mid → 2; high → 3, staggered */
    var count = charge < 0.35 ? 1 : charge < 0.7 ? 2 : 3;
    for (var ri = 0; ri < count; ri++) {
      ripples.push({
        startTime:  performance.now() + ri * 130,
        duration:   550 + charge * 900,
        maxRadius:  unit * (0.06 + charge * 0.52),
        startAlpha: 0.18 + charge * 0.62,
        lineWidth:  0.6 + charge * 4.5,
        color:      color,
        charge:     charge,
      });
    }
  }

  /* ── black hole easter egg ── */
  var FAST_THRESHOLD = 0.003;
  var BH_COOLDOWN_MS = 20000;
  var bhLastAt       = -Infinity;
  var bhPhase        = null; /* null | 'warning' | 'collapse' | 'suck' | 'flash' */
  var bhStart        = 0;
  var bhPlops        = [];
  var bhPlopText     = null; /* {time} shown when last planet falls in */

  var BH_WARNING_MS  = 1100;
  var BH_COLLAPSE_MS = 750;
  var BH_TRAVEL_MS   = 1600;
  var BH_FLASH_MS    = 600;

  var PAGE_TARGETS = 'nav.site-nav, main, footer, #orrery-regen';

  function suckPageContent() {
    var els = document.querySelectorAll(PAGE_TARGETS);
    for (var i = 0; i < els.length; i++) {
      var el   = els[i];
      var rect = el.getBoundingClientRect();
      var dx   = cx - (rect.left + rect.width  / 2);
      var dy   = cy - (rect.top  + rect.height / 2);
      var delay = i * 80;
      el.style.transition = 'transform 1.5s ' + delay + 'ms cubic-bezier(0.4,0,1,1), opacity 1.2s ' + delay + 'ms ease-in';
      el.style.transform  = 'translate(' + dx + 'px,' + dy + 'px) scale(0.02) rotate(600deg)';
      el.style.opacity    = '0';
    }
  }

  function resetPageContent() {
    var els = document.querySelectorAll(PAGE_TARGETS);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      /* snap back instantly (hidden under the white flash) */
      el.style.transition = 'none';
      el.style.transform  = '';
      el.style.opacity    = '0';
      /* force reflow so the snap registers before we add the fade-in */
      void el.offsetHeight;
      /* fade in as the flash clears */
      el.style.transition = 'opacity ' + BH_FLASH_MS + 'ms ease-out';
      el.style.opacity    = '';
    }
  }

  function initBlackHole() {
    bhPhase = 'warning';
    bhStart = performance.now();
    bhPlops = [];
    for (var i = 0; i < planets.length; i++) {
      var p  = planets[i];
      var a  = p.angle + p.speed * lastTime;
      var or = p.radius * unit;
      p.bhX       = cx + Math.cos(a) * or;
      p.bhY       = cy + Math.sin(a) * or;
      p.bhDelay   = rand(0, BH_TRAVEL_MS * 0.45);
      p.bhPlopped = false;
      p.angle     = a;
      p.speed     = 0;
    }
  }

  function drawWarningSun(progress) {
    var pulse = Math.sin(performance.now() * 0.018) * 0.5 + 0.5;
    var size  = 14 * (1 + pulse * progress * 0.7);
    var grad  = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2.8);
    grad.addColorStop(0,   'rgba(255,220,120,0.95)');
    grad.addColorStop(0.3, 'rgba(255,' + Math.floor(160 - pulse * progress * 110) + ',30,' + (0.35 + pulse * progress * 0.45) + ')');
    grad.addColorStop(1,   'rgba(200,40,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, size * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe8a0';
    ctx.fill();
  }

  function drawCollapsingSun(progress) {
    var sunR = 14 * (1 - progress);
    var bhR  = progress * 20;
    if (bhR > 1) {
      var diskR    = bhR * 4;
      var diskEdge = bhR * 1.15 / diskR;
      var disk     = ctx.createRadialGradient(cx, cy, 0, cx, cy, diskR);
      disk.addColorStop(0,          'rgba(0,0,0,0)');
      disk.addColorStop(diskEdge,   'rgba(255,160,20,' + (progress * 0.95) + ')');
      disk.addColorStop(0.45,       'rgba(255,60,0,'   + (progress * 0.6)  + ')');
      disk.addColorStop(1,          'rgba(80,0,180,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, diskR, 0, Math.PI * 2);
      ctx.fillStyle = disk;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, bhR, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
    }
    if (sunR > 0.5) {
      var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR);
      sg.addColorStop(0, 'rgba(255,220,120,' + (1 - progress) + ')');
      sg.addColorStop(1, 'rgba(255,200,80,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
    }
  }

  function drawActiveBlackHole() {
    var bhR   = 20;
    var diskR = bhR * 4.5;
    var rot   = performance.now() * 0.0009;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    var diskEdge = bhR * 1.15 / diskR;
    var disk = ctx.createRadialGradient(0, 0, 0, 0, 0, diskR);
    disk.addColorStop(0,          'rgba(0,0,0,0)');
    disk.addColorStop(diskEdge,   'rgba(255,160,20,1)');
    disk.addColorStop(0.3,        'rgba(255,60,0,0.7)');
    disk.addColorStop(0.65,       'rgba(100,0,220,0.35)');
    disk.addColorStop(1,          'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(0, 0, diskR, 0, Math.PI * 2);
    ctx.fillStyle = disk;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, bhR, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    var halo = ctx.createRadialGradient(cx, cy, bhR - 1, cx, cy, bhR + 7);
    halo.addColorStop(0, 'rgba(255,160,20,0.95)');
    halo.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, bhR + 7, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();
  }

  /* ── animation loop ── */
  function draw(t) {
    lastTime = t;
    var now  = performance.now();

    /* screen shake during collapse */
    var shakeX = 0, shakeY = 0;
    if (bhPhase === 'collapse') {
      var shakeAmt = ((now - bhStart) / BH_COLLAPSE_MS) * 5;
      shakeX = (Math.random() - 0.5) * shakeAmt;
      shakeY = (Math.random() - 0.5) * shakeAmt;
    }
    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.clearRect(-10, -10, window.innerWidth + 20, window.innerHeight + 20);

    /* ── black hole trigger ── */
    if (!bhPhase) {
      var fastCount = 0;
      for (var ji = 0; ji < planets.length; ji++) {
        if (Math.abs(planets[ji].speed) >= FAST_THRESHOLD) fastCount++;
      }
      if (fastCount >= 3 && now - bhLastAt > BH_COOLDOWN_MS) initBlackHole();
    }

    /* ── phase transitions ── */
    var bhElapsed = bhPhase ? now - bhStart : 0;
    if (bhPhase === 'warning'  && bhElapsed > BH_WARNING_MS)  { bhPhase = 'collapse'; bhStart = now; bhElapsed = 0; }
    if (bhPhase === 'collapse' && bhElapsed > BH_COLLAPSE_MS) { bhPhase = 'suck'; bhStart = now; bhElapsed = 0; suckPageContent(); }

    /* ── sun / black hole ── */
    if      (!bhPhase)              drawSun();
    else if (bhPhase === 'warning') drawWarningSun(bhElapsed / BH_WARNING_MS);
    else if (bhPhase === 'collapse') drawCollapsingSun(bhElapsed / BH_COLLAPSE_MS);
    else if (bhPhase === 'suck' || bhPhase === 'flash') drawActiveBlackHole();

    /* ── ripples ── */
    for (var ri = ripples.length - 1; ri >= 0; ri--) {
      var rip      = ripples[ri];
      var rp       = (now - rip.startTime) / rip.duration;
      if (rp < 0) continue;
      if (rp >= 1) { ripples.splice(ri, 1); continue; }
      var reased  = 1 - Math.pow(1 - rp, 2);
      var rradius = rip.maxRadius * reased;
      var ralpha  = rip.startAlpha * (1 - rp);
      ctx.beginPath();
      ctx.arc(cx, cy, rradius, 0, Math.PI * 2);
      ctx.strokeStyle = hexToGlow(rip.color, ralpha);
      ctx.lineWidth   = rip.lineWidth * (1 - rp * 0.6);
      ctx.stroke();
      var numCrackles = Math.floor(1 + rip.charge * 3);
      var crackleLen  = 6 + rip.charge * 14;
      for (var ci = 0; ci < numCrackles; ci++) {
        var ca  = Math.random() * Math.PI * 2;
        var cpx = cx + Math.cos(ca) * rradius;
        var cpy = cy + Math.sin(ca) * rradius;
        drawSpark(cpx, cpy, ca + (Math.random() - 0.5) * 0.7, crackleLen, ralpha * 0.9);
      }
    }

    /* ── plop flashes ── */
    for (var pi = bhPlops.length - 1; pi >= 0; pi--) {
      var plop = bhPlops[pi];
      var pp   = (now - plop.time) / 350;
      if (pp >= 1) { bhPlops.splice(pi, 1); continue; }
      ctx.beginPath();
      ctx.arc(cx, cy, 30 * pp, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - pp) * 0.9) + ')';
      ctx.lineWidth   = 3 * (1 - pp);
      ctx.stroke();
    }

    /* ── planets ── */
    if (bhPhase === 'flash') {
      var fp = (now - bhStart) / BH_FLASH_MS;
      if (fp >= 1) {
        bhPhase  = null;
        bhLastAt = now;
      }
      ctx.fillStyle = 'rgba(255,255,255,' + (1 - fp) + ')';
      ctx.fillRect(-10, -10, window.innerWidth + 20, window.innerHeight + 20);

    } else if (bhPhase === 'suck') {
      var suckElapsed = now - bhStart;
      var allPlopped  = true;

      for (var i = 0; i < planets.length; i++) {
        var p = planets[i];
        if (p.bhPlopped) continue;
        allPlopped = false;
        var pElapsed  = suckElapsed - p.bhDelay;
        var progress  = Math.max(0, Math.min(pElapsed / BH_TRAVEL_MS, 1));
        var eased     = progress * progress * progress; /* ease-in: accelerates into BH */
        var startAngle = Math.atan2(p.bhY - cy, p.bhX - cx);
        var startDist  = Math.sqrt((p.bhX - cx) * (p.bhX - cx) + (p.bhY - cy) * (p.bhY - cy));
        var angle      = startAngle + eased * Math.PI * 3.5;
        var dist       = startDist * (1 - eased);
        var px         = cx + Math.cos(angle) * dist;
        var py         = cy + Math.sin(angle) * dist;

        if (progress >= 1) {
          p.bhPlopped = true;
          bhPlops.push({time: now});
          /* check if this was the last planet */
          var anyLeft = false;
          for (var li = 0; li < planets.length; li++) {
            if (!planets[li].bhPlopped) { anyLeft = true; break; }
          }
          if (!anyLeft) bhPlopText = {time: now};
          continue;
        }

        /* stretched tether toward center */
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(cx + Math.cos(angle) * dist * 0.4, cy + Math.sin(angle) * dist * 0.4);
        ctx.strokeStyle = hexToGlow(p.color, eased * 0.55);
        ctx.lineWidth   = p.size * (1 - eased * 0.8);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, Math.max(p.size * (1 - eased * 0.85), 0.3), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      if (allPlopped && bhPlops.length === 0) {
        bhPhase = 'flash';
        bhStart = now;
        generate();
      }

    } else {
      /* ── normal planet drawing ── */
      for (var i = 0; i < planets.length; i++) {
        var p = planets[i];
        var r = p.radius * unit;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth   = 0.5;
        ctx.stroke();

        var a  = p.angle + p.speed * t;
        var px = cx + Math.cos(a) * r;
        var py = cy + Math.sin(a) * r;

        /* trail */
        var speedMag = Math.abs(p.speed);
        var trailLen = speedMag <= TRAIL_THRESHOLD ? 0
                     : Math.min(Math.floor((speedMag - TRAIL_THRESHOLD) / TRAIL_THRESHOLD * 5), TRAIL_MAX);
        if (speedMag > TRAIL_THRESHOLD) p.trail.push({x: px, y: py});
        while (p.trail.length > trailLen) p.trail.shift();
        for (var ti = 0; ti < p.trail.length; ti++) {
          var tf = ti / p.trail.length;
          ctx.beginPath();
          ctx.arc(p.trail[ti].x, p.trail[ti].y, p.size * tf * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = hexToGlow(p.color, tf * 0.45);
          ctx.fill();
        }

        /* glow */
        var isHovered  = (i === hoveredIndex);
        var isCharging = (i === chargeIndex);
        var charge     = isCharging ? Math.min((now - chargeStart) / CHARGE_MAX_MS, 1) : 0;
        var glowRadius = isCharging ? p.size * (7 + charge * 13)
                       : isHovered  ? p.size * 7
                       : p.size * 3;
        var glowAlpha  = isCharging ? 0.55 + charge * 0.35 : isHovered ? 0.55 : null;
        var glowColor  = glowAlpha !== null ? hexToGlow(p.color, glowAlpha) : p.glow;
        var glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
        glow.addColorStop(0, glowColor);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        /* sparks during charge */
        if (isCharging && charge > 0) {
          var numSparks  = Math.floor(1 + charge * 2);
          var sparkLen   = p.size * (4 + charge * 10);
          var sparkAlpha = 0.25 + charge * 0.65;
          for (var si = 0; si < numSparks; si++) {
            drawSpark(px, py, Math.random() * Math.PI * 2, sparkLen, sparkAlpha);
          }
        }
      }
    }

    /* ── PLOP! text ── */
    if (bhPlopText) {
      var tp       = (now - bhPlopText.time) / 900;
      if (tp >= 1) {
        bhPlopText = null;
      } else {
        /* pop in fast, fade out slow */
        var scale  = tp < 0.2 ? tp / 0.2 : 1;
        var talpha = tp < 0.3 ? 1 : 1 - (tp - 0.3) / 0.7;
        var size   = Math.round(scale * 96);
        ctx.save();
        ctx.globalAlpha  = talpha;
        ctx.font         = 'bold ' + size + 'px "JetBrains Mono", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        /* dark outline so it reads on the white flash */
        ctx.lineJoin     = 'round';
        ctx.lineWidth    = size * 0.12;
        ctx.strokeStyle  = '#0c1017';
        ctx.strokeText('PLOP!', cx, cy);
        /* bright orange fill so it reads on the dark background */
        ctx.fillStyle    = '#ffa020';
        ctx.fillText('PLOP!', cx, cy);
        ctx.restore();
      }
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
