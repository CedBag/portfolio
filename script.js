/* ===================================================
   PORTFOLIO – Cedoque Bagbonon | script.js
   Dark/Light Mode · Typewriter · Scroll Animations · Filters · Nav Active
=================================================== */

'use strict';

/* =============================================
   1. DARK / LIGHT MODE TOGGLE
============================================= */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  // Basculer l'icône Font Awesome moon ↔ sun
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
  localStorage.setItem('theme', theme);
}

// Appliquer la préférence mémorisée ou la préférence système
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* =============================================
   2. HAMBURGER MENU MOBILE
============================================= */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fermer le menu au clic sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =============================================
   3. EFFET TYPEWRITER
============================================= */
const typewriterEl = document.getElementById('typewriter-text');
const words = ['Bagbonon', 'Data Analyst', 'Consultant IA', 'Builder'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterDelay = 120;

function typewriter() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      typewriterDelay = 2000; // Pause avant suppression
    } else {
      typewriterDelay = 120;
    }
  } else {
    typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typewriterDelay = 400;
    } else {
      typewriterDelay = 60;
    }
  }
  setTimeout(typewriter, typewriterDelay);
}

setTimeout(typewriter, 600);

/* =============================================
   4. SCROLL ANIMATIONS (Intersection Observer)
============================================= */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach((el) => {
  const parent = el.parentElement;
  if (parent && (parent.classList.contains('expertise-grid') ||
    parent.classList.contains('certs-grid') ||
    parent.classList.contains('projects-grid'))) {
    el.dataset.delay = 0;
  }
  observer.observe(el);
});

/* =============================================
   4b. BARRE DE PROGRESSION DE LECTURE (#12)
============================================= */
const readingBar = document.getElementById('reading-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  readingBar.style.width = `${Math.min(progress, 100)}%`;
}, { passive: true });

/* =============================================
   5. BARRES DE COMPÉTENCES (animées au scroll)
============================================= */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width + '%';
      // Activer l'affichage du % (#14)
      const skillItem = fill.closest('.skill-item');
      if (skillItem) skillItem.classList.add('animated');
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.2 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* =============================================
   6. FILTRE DES PROJETS
============================================= */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Mettre à jour le bouton actif
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Afficher / masquer les cartes avec animation
    const filter = btn.dataset.filter;
    document.querySelectorAll('.case-study').forEach(card => {
      const cats = card.dataset.category.split(' ');
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

/* =============================================
   7. NAV ACTIVE AU SCROLL + SMOOTH SCROLL
============================================= */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: '-50% 0px -50% 0px'
});

sections.forEach(s => navObs.observe(s));

// Smooth scroll pour tous les liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* =============================================
   8. BOUTON RETOUR EN HAUT
============================================= */
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
