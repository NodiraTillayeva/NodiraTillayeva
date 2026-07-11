// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// Press carousel
const track = document.querySelector('.press-list');
if (track) {
  const prev = document.querySelector('.press-nav--prev');
  const next = document.querySelector('.press-nav--next');
  const step = () => {
    const card = track.querySelector('.press-item');
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Vertical nav scroll-spy
const vnavLinks = document.querySelectorAll('.vnav a');
if (vnavLinks.length) {
  const linkFor = {};
  vnavLinks.forEach((a) => { linkFor[a.getAttribute('href').slice(1)] = a; });
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          vnavLinks.forEach((a) => a.classList.remove('is-active'));
          linkFor[e.target.id]?.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  ['work', 'experience', 'awards', 'press', 'skills'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(
  '.hero__intro, .card, .timeline__item, .edu-card, .cert-card, .note, .skills-col, .contact__card, .section__head, .japan-card, .japan__lead, .art-tile'
);
revealEls.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));
