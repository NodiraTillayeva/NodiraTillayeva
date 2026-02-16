document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu-item');
  const allImages = document.querySelectorAll('.character-img');
  const allPlaceholders = document.querySelectorAll('.character-placeholder');

  // Track which real images loaded successfully
  allImages.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });

  function showCharacter(target) {
    const hasRealImage = document.querySelector(`.character-img.loaded[data-character="${target}"]`);

    if (hasRealImage) {
      allImages.forEach(img => {
        const isTarget = img.dataset.character === target;
        img.classList.toggle('active', isTarget);
        // Apply glow class matching the category
        img.classList.remove('glow-tech', 'glow-art', 'glow-research', 'glow-projects');
        if (isTarget && target !== 'default') {
          img.classList.add(`glow-${target}`);
        }
      });
      allPlaceholders.forEach(ph => ph.classList.remove('active'));
    } else {
      allPlaceholders.forEach(ph => ph.classList.toggle('active', ph.dataset.character === target));
      allImages.forEach(img => {
        img.classList.remove('active', 'glow-tech', 'glow-art', 'glow-research', 'glow-projects');
      });
    }
  }

  menuItems.forEach(item => {
    const target = item.dataset.target;

    item.addEventListener('mouseenter', () => {
      showCharacter(target);
    });

    item.addEventListener('mouseleave', () => {
      showCharacter('default');
    });
  });
});
