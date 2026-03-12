const merchants = [
  {
    name: 'Atelier Aurore',
    category: 'Boulangerie artisanale',
    description: 'Fournil du matin, pains speciaux et douceurs dorees prepares chaque jour.',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Jardin Velours',
    category: 'Fleurs et plantes',
    description: 'Bouquets saisonniers, plantes graphiques et compositions colorees en boutique.',
    image:
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Maison Rivage',
    category: 'Epicerie de quartier',
    description: 'Comptoir gourmand avec epices, conserves fines et idees cadeaux locales.',
    image:
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Pignon Clair',
    category: 'Atelier velo',
    description: 'Revisions express, location urbaine et accessoires pratiques pour la balade.',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Le Comptoir des Pages',
    category: 'Librairie cafe',
    description: 'Romans, BD et lectures inspirees autour d un espace detente lumineux.',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Cuisine des Lanternes',
    category: 'Table conviviale',
    description: 'Petits plats de saison, carte courte et ambiance chaleureuse a partager.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
  }
];

const galleryItems = [
  {
    title: 'Terrasses animees en fin de matinee',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Rues commercantes et vitrines locales',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Balade douce au coucher de soleil',
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
  }
];

const merchantGrid = document.getElementById('merchantGrid');
const galleryGrid = document.getElementById('galleryGrid');

if (merchantGrid) {
  merchantGrid.innerHTML = merchants
    .map(
      (item) => `
        <article class="merchant-card reveal">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          <div class="merchant-card-content">
            <span class="badge">${item.category}</span>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
        </article>
      `
    )
    .join('');
}

if (galleryGrid) {
  galleryGrid.innerHTML = galleryItems
    .map(
      (item) => `
        <article class="gallery-card reveal">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <p class="gallery-caption">${item.title}</p>
        </article>
      `
    )
    .join('');
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 45, 320)}ms`;
  revealObserver.observe(el);
});

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = entry.target;
      const finalValue = Number(target.dataset.value) || 0;
      const duration = 1100;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = String(Math.round(finalValue * eased));

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(target);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll('.stat-number').forEach((item) => statObserver.observe(item));

const hero = document.querySelector('.hero');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const nav = document.querySelector('.top-nav');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setActiveNav() {
  const trigger = window.scrollY + window.innerHeight * 0.32;
  let current = '';

  sections.forEach((section) => {
    if (trigger >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', isActive);
  });
}

setActiveNav();
let ticking = false;

function updateOnScroll() {
  const scrollTop = window.scrollY || window.pageYOffset;
  const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  }

  if (nav) {
    nav.style.background = scrollTop > 40 ? 'rgba(18, 46, 55, 0.72)' : 'rgba(18, 46, 55, 0.5)';
    nav.style.boxShadow = scrollTop > 40 ? '0 10px 24px rgba(0, 0, 0, 0.22)' : 'none';
  }

  if (hero && !prefersReducedMotion) {
    const offset = Math.min(scrollTop * 0.18, 64);
    hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  }

  setActiveNav();
}

function onScroll() {
  if (ticking) {
    return;
  }

  ticking = true;
  requestAnimationFrame(() => {
    updateOnScroll();
    ticking = false;
  });
}

updateOnScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const canUseTilt =
  !prefersReducedMotion &&
  window.matchMedia('(hover: hover)').matches &&
  window.matchMedia('(pointer: fine)').matches;

if (canUseTilt) {
  const tiltCards = document.querySelectorAll('.merchant-card');
  tiltCards.forEach((card) => {
    let tiltFrame = null;

    card.addEventListener('mousemove', (event) => {
      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
      }

      tiltFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 6;
        const rotateX = (0.5 - y) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

document.querySelectorAll('img').forEach((img) => {
  img.decoding = 'async';
  img.referrerPolicy = 'no-referrer';
  img.addEventListener('error', () => {
    img.style.objectFit = 'cover';
    img.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#dbe4df'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#47665d' font-family='Arial' font-size='24'>Image indisponible</text></svg>"
      );
  });
});
