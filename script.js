/* ═══════════════════════════════════════════════════════════════
   STELLA'S BIRTHDAY WEBSITE — JAVASCRIPT
   Features: Particles, Countdown, Confetti, Typing, Player, etc.
   ═══════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────
   1. PARTICLE SYSTEM (Stars + Hearts)
   ─────────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['#ffb3d9', '#c9b3ff', '#e080e0', '#ffffff', '#ffd6f0'];
  const SHAPES = ['star', 'heart', 'dot'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      size:  randomBetween(shape === 'heart' ? 4 : 1.5, shape === 'heart' ? 8 : 3.5),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: randomBetween(0.08, 0.55),
      vx:    randomBetween(-0.18, 0.18),
      vy:    randomBetween(-0.25, -0.05),
      twinkleSpeed: randomBetween(0.005, 0.02),
      twinkleDir:   Math.random() > 0.5 ? 1 : -1,
      shape,
      rotation: randomBetween(0, Math.PI * 2),
      rotSpeed: randomBetween(-0.005, 0.005),
    };
  }

  function drawStar(ctx, x, y, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a  = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const ai = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
      else         ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      ctx.lineTo(x + r * 0.4 * Math.cos(ai), y + r * 0.4 * Math.sin(ai));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.4);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.4);
    ctx.bezierCurveTo(x - size, y + size * 0.75, x, y + size * 1.1, x, y + size * 1.3);
    ctx.bezierCurveTo(x, y + size * 1.1, x + size, y + size * 0.75, x + size, y + size * 0.4);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawDot(ctx, x, y, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // Twinkle
      p.alpha += p.twinkleSpeed * p.twinkleDir;
      if (p.alpha >= 0.6 || p.alpha <= 0.04) p.twinkleDir *= -1;
      // Move
      p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed;
      // Wrap
      if (p.y < -20) p.y = H + 10;
      if (p.x < -20) p.x = W + 10;
      if (p.x > W + 20) p.x = -10;
      // Draw
      if (p.shape === 'star')  drawStar(ctx, p.x, p.y, p.size, p.color, p.alpha);
      else if (p.shape === 'heart') drawHeart(ctx, p.x, p.y, p.size * 0.5, p.color, p.alpha);
      else drawDot(ctx, p.x, p.y, p.size * 0.6, p.color, p.alpha);
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  // Create 160 particles
  for (let i = 0; i < 160; i++) particles.push(createParticle());
  animate();
})();

/* ───────────────────────────────────────────────────────────────
   2. NAVIGATION
   ─────────────────────────────────────────────────────────────── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.textContent = open ? '✕' : '☰';
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
})();

/* ───────────────────────────────────────────────────────────────
   3. TYPING ANIMATION (hero subtitle)
   ─────────────────────────────────────────────────────────────── */
(function initTyping() {
  const el       = document.getElementById('typingTarget');
  const message  = 'A special little corner of the internet, made just for you.';
  let   index    = 0;
  let   started  = false;

  function type() {
    if (index < message.length) {
      el.innerHTML = message.slice(0, ++index) + '<span class="cursor"></span>';
      setTimeout(type, 45 + Math.random() * 30);
    } else {
      // Keep blinking cursor for a moment then remove
      setTimeout(() => {
        el.innerHTML = message;
      }, 3000);
    }
  }

  // Start after hero reveal delay
  setTimeout(() => { if (!started) { started = true; type(); } }, 900);
})();

/* ───────────────────────────────────────────────────────────────
   4. CONFETTI EFFECT
   ─────────────────────────────────────────────────────────────── */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#ffb3d9', '#c9b3ff', '#ff80bf', '#e040fb', '#ffffff', '#ffd6f0', '#b39ddb'];
  const pieces = [];

  for (let i = 0; i < 220; i++) {
    pieces.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height - canvas.height,
      w:    Math.random() * 10 + 5,
      h:    Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:   (Math.random() - 0.5) * 3,
      vy:   Math.random() * 3 + 2,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
      alpha: 1,
      fade: 0.006 + Math.random() * 0.005,
    });
  }

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      if (p.alpha <= 0) return;
      alive = true;
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.06; // gravity
      p.rot += p.rotV;
      p.alpha -= p.fade;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (frame) cancelAnimationFrame(frame);
  draw();
}

/* ───────────────────────────────────────────────────────────────
   5. SURPRISE BUTTON
   ─────────────────────────────────────────────────────────────── */
(function initSurprise() {
  const btn = document.getElementById('surpriseBtn');
  btn.addEventListener('click', () => {
    launchConfetti();
    // Scroll to countdown
    document.getElementById('countdown').scrollIntoView({ behavior: 'smooth' });
    // Button transform
    btn.innerHTML = '<span>🎉 Surprise!</span>';
    btn.style.background = 'linear-gradient(135deg, #e040fb, #ff4081)';
  });
})();

/* ───────────────────────────────────────────────────────────────
   6. COUNTDOWN TIMER
   ─────────────────────────────────────────────────────────────── */
(function initCountdown() {
  // 🗓️ SET BIRTHDAY DATE HERE — format: YYYY, Month(0-indexed), Day, Hour, Min, Sec
  const BIRTHDAY = new Date(2026, 4, 29, 0, 0, 0); // May 29, 2026 at midnight

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minsEl    = document.getElementById('minutes');
  const secsEl    = document.getElementById('seconds');
  const grid      = document.getElementById('countdownGrid');
  const message   = document.getElementById('birthdayMessage');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now  = new Date();
    const diff = BIRTHDAY - now;

    if (diff <= 0) {
      // It's her birthday! 🎉
      grid.classList.add('hidden');
      message.classList.remove('hidden');
      launchConfetti();
      return;
    }

    const total   = Math.floor(diff / 1000);
    const secs    = total % 60;
    const mins    = Math.floor(total / 60) % 60;
    const hours   = Math.floor(total / 3600) % 24;
    const days    = Math.floor(total / 86400);

    // Animate digit change
    function setWithFlip(el, val) {
      const padded = pad(val);
      if (el.textContent !== padded) {
        el.style.transform = 'translateY(-8px)';
        el.style.opacity   = '0';
        el.style.transition = 'all 0.25s ease';
        setTimeout(() => {
          el.textContent    = padded;
          el.style.transform = 'translateY(8px)';
          setTimeout(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity   = '1';
          }, 10);
        }, 150);
      }
    }

    setWithFlip(daysEl, days);
    setWithFlip(hoursEl, hours);
    setWithFlip(minsEl, mins);
    setWithFlip(secsEl, secs);
  }

  update();
  setInterval(update, 1000);
})();

/* ───────────────────────────────────────────────────────────────
   7. PHOTO GALLERY + LIGHTBOX
   ─────────────────────────────────────────────────────────────── */
(function initGallery() {
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCap   = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const cards         = document.querySelectorAll('.photo-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img     = card.querySelector('img');
      const caption = card.dataset.caption || '';

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      } else {
        // Placeholder — show a styled empty lightbox
        lightboxImg.src = '';
        lightboxImg.style.display = 'none';
      }

      lightboxCap.textContent = caption;
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    lightboxImg.style.display = 'block';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ───────────────────────────────────────────────────────────────
   8. VIDEO PLAYER
   ─────────────────────────────────────────────────────────────── */
(function initVideoPlayer() {
  const video       = document.getElementById('stellaVideo');
  const screenWrap  = document.getElementById('vScreenWrap');
  const overlay     = document.getElementById('vPlayOverlay');
  const bigBtn      = document.getElementById('vPlayBigBtn');
  const playBtn     = document.getElementById('vPlayBtn');
  const rewindBtn   = document.getElementById('vRewind');
  const fwdBtn      = document.getElementById('vForward');
  const muteBtn     = document.getElementById('vMuteBtn');
  const fullBtn     = document.getElementById('vFullscreen');
  const volSlider   = document.getElementById('vVolSlider');
  const progressWrap= document.getElementById('vProgressTrack').parentElement;
  const fill        = document.getElementById('vFill');
  const buffer      = document.getElementById('vBuffer');
  const thumb       = document.getElementById('vThumb');
  const timeEl      = document.getElementById('vTime');
  const placeholder = document.getElementById('vPlaceholder');

  // Show placeholder if video can't load
  video.addEventListener('error', () => placeholder.classList.add('visible'));

  video.volume = parseFloat(volSlider.value);

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function setPlayState(playing) {
    playBtn.textContent = playing ? '⏸' : '▶';
    playBtn.style.paddingLeft = playing ? '0' : '2px';
  }

  // Big overlay play button
  function startPlay() {
    video.play().then(() => {
      overlay.classList.add('hidden');
      setPlayState(true);
    }).catch(() => {});
  }
  bigBtn.addEventListener('click', e => { e.stopPropagation(); startPlay(); });
  overlay.addEventListener('click', startPlay);

  // Click on video itself = play/pause
  video.addEventListener('click', togglePlay);

  function togglePlay() {
    if (video.paused) { video.play(); setPlayState(true); overlay.classList.add('hidden'); }
    else              { video.pause(); setPlayState(false); }
  }

  playBtn.addEventListener('click', togglePlay);
  rewindBtn.addEventListener('click', () => { video.currentTime = Math.max(0, video.currentTime - 10); });
  fwdBtn.addEventListener('click',    () => { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); });

  // Progress update
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    fill.style.width  = pct + '%';
    thumb.style.left  = pct + '%';
    timeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });

  // Buffered
  video.addEventListener('progress', () => {
    if (video.buffered.length && video.duration) {
      buffer.style.width = (video.buffered.end(video.buffered.length - 1) / video.duration * 100) + '%';
    }
  });

  video.addEventListener('loadedmetadata', () => {
    timeEl.textContent = `0:00 / ${formatTime(video.duration)}`;
  });

  video.addEventListener('ended', () => {
    setPlayState(false);
    overlay.classList.remove('hidden');
  });

  // Seek on click
  progressWrap.addEventListener('click', e => {
    const rect = progressWrap.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pct * (video.duration || 0);
  });

  // Volume
  volSlider.addEventListener('input', () => {
    video.volume = parseFloat(volSlider.value);
    video.muted  = video.volume === 0;
    muteBtn.textContent = video.muted ? '🔇' : '🔊';
  });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? '🔇' : '🔊';
    if (!video.muted) volSlider.value = video.volume || 0.8;
  });

  // Fullscreen
  fullBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      (screenWrap.requestFullscreen || screenWrap.webkitRequestFullscreen).call(screenWrap);
      fullBtn.textContent = '⛶';
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      fullBtn.textContent = '⛶';
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.code === 'Space')       { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowLeft')   video.currentTime = Math.max(0, video.currentTime - 5);
    if (e.code === 'ArrowRight')  video.currentTime = Math.min(video.duration||0, video.currentTime + 5);
    if (e.code === 'KeyM')        muteBtn.click();
    if (e.code === 'KeyF')        fullBtn.click();
  });
})();

/* ───────────────────────────────────────────────────────────────
   10. SCROLL REVEAL
   ─────────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.countdown-section, .countdown-card, .photo-card, ' +
    '.letter-paper, .vplayer-card, .section-header'
  );

  targets.forEach(el => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if it's a grid container
        const children = entry.target.querySelectorAll('.scroll-reveal');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('revealed'), i * 80);
        });
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ───────────────────────────────────────────────────────────────
   11. BACK TO TOP BUTTON
   ─────────────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ───────────────────────────────────────────────────────────────
   12. RESIZE HANDLER (confetti + particle canvas)
   ─────────────────────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  const confetti = document.getElementById('confettiCanvas');
  confetti.width  = window.innerWidth;
  confetti.height = window.innerHeight;
});
