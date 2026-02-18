/* ═══════════════════════════════════════════════════════════════
   NARA SAMA — Portfolio Interaction Engine
   Particles · Mode Switching · Transitions · Easter Eggs
   ═══════════════════════════════════════════════════════════════ */

// ── Particle System ──

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.color = { r: 201, g: 168, b: 76 };
    this.targetColor = { r: 201, g: 168, b: 76 };
    this.running = true;

    this.resize();
    this.spawn();
    this.bindEvents();
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn() {
    const count = Math.min(55, Math.floor(
      (this.canvas.width * this.canvas.height) / 22000
    ));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.25 + 0.05,
        type: Math.random() > 0.82 ? 'diamond' : 'circle',
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.spawn();
    });
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  setColor(r, g, b) {
    this.targetColor = { r, g, b };
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Smooth color interpolation
    this.color.r = this.lerp(this.color.r, this.targetColor.r, 0.035);
    this.color.g = this.lerp(this.color.g, this.targetColor.g, 0.035);
    this.color.b = this.lerp(this.color.b, this.targetColor.b, 0.035);

    const r = Math.round(this.color.r);
    const g = Math.round(this.color.g);
    const b = Math.round(this.color.b);

    for (const p of this.particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      // Mouse repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120 * 0.25;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Draw particle
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;

      if (p.type === 'diamond') {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(Math.PI / 4);
        const s = p.size * 1.2;
        this.ctx.fillRect(-s, -s, s * 2, s * 2);
        this.ctx.restore();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Connecting lines between nearby particles
    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.025)`;
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.loop());
  }

  destroy() {
    this.running = false;
  }
}

// ── Mode Colors Map ──

const MODE_COLORS = {
  default:  { r: 201, g: 168, b: 76  },
  research: { r: 0,   g: 212, b: 255 },
  tech:     { r: 0,   g: 255, b: 136 },
  projects: { r: 255, g: 140, b: 0   },
  art:      { r: 192, g: 132, b: 252 },
};

// ── Main Initialization ──

document.addEventListener('DOMContentLoaded', () => {

  // Initialize particle system (homepage only)
  const canvas = document.getElementById('particle-canvas');
  let particles = null;
  if (canvas) {
    particles = new ParticleSystem(canvas);
  }

  // ── Mode Indicator Text ──
  const modeText = document.getElementById('mode-text');

  // ── Nav Node Hover → Mode Switch ──
  const navNodes = document.querySelectorAll('.nav-node');
  const hero = document.querySelector('.hero');
  navNodes.forEach(node => {
    const mode = node.dataset.mode;

    node.addEventListener('mouseenter', () => {
      document.body.dataset.mode = mode;
      if (particles) {
        const c = MODE_COLORS[mode];
        particles.setColor(c.r, c.g, c.b);
      }
      if (modeText) {
        modeText.textContent = '// ' + mode.toUpperCase() + ' MODE';
      }
      // Crossfade to anime character on art hover
      if (mode === 'art' && hero) {
        hero.classList.add('art-preview');
      }
    });

    node.addEventListener('mouseleave', () => {
      document.body.dataset.mode = 'default';
      if (particles) {
        const c = MODE_COLORS.default;
        particles.setColor(c.r, c.g, c.b);
      }
      if (modeText) {
        modeText.textContent = 'SELECT MODE';
      }
      // Revert to real photo
      if (hero) {
        hero.classList.remove('art-preview');
      }
    });

    // ── Click → Warp Transition → Navigate ──
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const href = node.getAttribute('href');
      const rect = node.getBoundingClientRect();
      const warp = document.getElementById('transition-warp');

      if (warp) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        warp.style.setProperty('--warp-x', cx + 'px');
        warp.style.setProperty('--warp-y', cy + 'px');

        // Set the warp color to match the mode
        const c = MODE_COLORS[mode];
        document.documentElement.style.setProperty('--accent-rgb', `${c.r}, ${c.g}, ${c.b}`);

        warp.classList.add('active');

        // Store mode for destination page entrance
        sessionStorage.setItem('transitionMode', mode);

        setTimeout(() => {
          window.location.href = href;
        }, 420);
      } else {
        window.location.href = href;
      }
    });
  });

  // ── Page Entrance Animation (for subpages) ──
  const pageContainer = document.querySelector('.page-container');
  if (pageContainer) {
    const mode = sessionStorage.getItem('transitionMode');
    if (mode) {
      document.body.dataset.mode = mode;
      sessionStorage.removeItem('transitionMode');
    }
    pageContainer.classList.add('page-enter');
  }

  // ── Back Button Transition (subpages) ──
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = backBtn.getAttribute('href');
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  }

  // ── Konami Code Easter Egg ──
  // ↑↑↓↓←→←→BA
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        triggerEasterEgg();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerEasterEgg() {
    document.body.style.transition = 'filter 0.6s ease';
    document.body.style.filter = 'hue-rotate(180deg)';

    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem; font-weight: 700;
      color: #00ff88; letter-spacing: 4px;
      text-shadow: 0 0 30px rgba(0,255,136,0.4);
      z-index: 9999; opacity: 0;
      pointer-events: none;
      white-space: nowrap;
    `;
    msg.textContent = 'DEVELOPER MODE UNLOCKED';
    document.body.appendChild(msg);

    // Animate in
    requestAnimationFrame(() => {
      msg.style.transition = 'opacity 0.4s ease';
      msg.style.opacity = '1';
    });

    setTimeout(() => {
      msg.style.opacity = '0';
      document.body.style.filter = '';
      setTimeout(() => msg.remove(), 500);
    }, 2500);
  }
});
