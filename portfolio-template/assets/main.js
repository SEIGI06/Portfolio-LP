/**
 * PORTFOLIO TEMPLATE — Main JavaScript
 * Gère : Scroll reveal, Header scroll, Parallax hero, Theme toggle, Mobile nav, Loader, Contact form
 * Aucune dépendance externe requise.
 */

document.addEventListener('DOMContentLoaded', () => {

  // === PAGE LOADER ===
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('loaded');
    });
    // Fallback: hide after 2s max
    setTimeout(() => loader.classList.add('loaded'), 2000);
  }

  // === SCROLL REVEAL (Intersection Observer) ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // === HEADER SCROLL EFFECT ===
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // === HERO PARALLAX ===
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
      }
    }, { passive: true });
  }

  // === SMOOTH SCROLL (for anchor links) ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // === THEME TOGGLE (Dark/Light) ===
  const themeToggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'portfolio-theme';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'
      );
    }
  }

  // Init theme from storage or system preference
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // === MOBILE NAVIGATION ===
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  const navOverlay = document.getElementById('nav-overlay');

  function closeMobileMenu() {
    if (navList) navList.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen.toString());
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // === ACTIVE NAV LINK ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));
  }

  // === CONTACT FORM HANDLING ===
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showFormFeedback('Veuillez remplir tous les champs.', 'error');
        return;
      }

      // Email basic validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormFeedback('Veuillez entrer un email valide.', 'error');
        return;
      }

      // Simulate sending (replace with Formspree or your backend)
      const submitBtn = form.querySelector('.form__submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showFormFeedback('Message envoyé avec succès ! ✨', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  function showFormFeedback(msg, type) {
    let feedback = document.getElementById('form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'form-feedback';
      feedback.style.cssText = `
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-weight: 500;
        text-align: center;
        transition: opacity 0.3s ease;
      `;
      form.appendChild(feedback);
    }

    feedback.textContent = msg;
    feedback.style.background = type === 'success'
      ? 'rgba(16, 185, 129, 0.15)'
      : 'rgba(239, 68, 68, 0.15)';
    feedback.style.color = type === 'success' ? '#10b981' : '#ef4444';
    feedback.style.border = type === 'success'
      ? '1px solid rgba(16, 185, 129, 0.3)'
      : '1px solid rgba(239, 68, 68, 0.3)';
    feedback.style.opacity = '1';

    setTimeout(() => {
      feedback.style.opacity = '0';
    }, 4000);
  }

  // === COPYRIGHT YEAR ===
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
