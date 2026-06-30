/* ============================================================
   APP.JS — The SEEP | First India Foundation
   Vanilla JS: Navbar, Scroll Animations, Count-Up, Form
   Validation, Promo Video, YouTube Modal
   ============================================================ */

(function () {
  'use strict';

  /* ─── Navbar: Scroll + Mobile Menu ─────────────────────── */
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const iconMenu = mobileMenuBtn.querySelector('.icon-menu');
  const iconClose = mobileMenuBtn.querySelector('.icon-close');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  mobileMenuBtn.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    iconMenu.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      iconMenu.style.display = 'block';
      iconClose.style.display = 'none';
    });
  });

  /* ─── Scroll Animations (IntersectionObserver) ─────────── */
  const animateEls = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  animateEls.forEach(function (el) {
    scrollObserver.observe(el);
  });

  /* ─── Count-Up Animation ───────────────────────────────── */
  const countEls = document.querySelectorAll('.count-up');

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2500;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  countEls.forEach(function (el) {
    countObserver.observe(el);
  });

  /* ─── Promo Video Play Button ──────────────────────────── */
  const promoVideo = document.getElementById('promoVideo');
  const promoOverlay = document.getElementById('promoOverlay');
  const promoPlayBtn = document.getElementById('promoPlayBtn');

  if (promoPlayBtn && promoVideo && promoOverlay) {
    promoPlayBtn.addEventListener('click', function () {
      promoVideo.controls = true;
      promoVideo.play();
      promoOverlay.classList.add('hidden');
    });

    promoVideo.addEventListener('pause', function () {
      promoOverlay.classList.remove('hidden');
    });

    promoVideo.addEventListener('play', function () {
      promoOverlay.classList.add('hidden');
    });
  }

  /* ─── YouTube Video Modal ──────────────────────────────── */
  const videoModal = document.getElementById('videoModal');
  const videoModalIframe = document.getElementById('videoModalIframe');
  const videoModalClose = document.getElementById('videoModalClose');

  function openVideoModal(videoId) {
    videoModalIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&playsinline=1&modestbranding=1';
    videoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal.style.display = 'none';
    videoModalIframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const videoId = card.getAttribute('data-video-id');
      if (videoId) openVideoModal(videoId);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const videoId = card.getAttribute('data-video-id');
        if (videoId) openVideoModal(videoId);
      }
    });
  });

  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (videoModal && videoModal.style.display !== 'none') closeVideoModal();
      if (thankYouModal && thankYouModal.style.display !== 'none') closeThankYou();
    }
  });

  /* ─── Hero Form Validation & Thank You Modal ───────────── */
  const heroForm = document.getElementById('heroForm');
  const thankYouModal = document.getElementById('thankYouModal');
  const thankYouClose = document.getElementById('thankYouClose');
  const thankYouEmail = document.getElementById('thankYouEmail');

  function showError(inputId, errId, message) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) input.classList.add('error');
    if (err) err.textContent = message;
  }

  function clearError(inputId, errId) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) input.classList.remove('error');
    if (err) err.textContent = '';
  }

  // Live validation on blur
  ['heroName', 'heroEmail', 'heroPhone', 'heroProgram'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      el.classList.remove('error');
    });
  });

  function openThankYou(email) {
    if (thankYouEmail) thankYouEmail.textContent = email;
    if (thankYouModal) {
      thankYouModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeThankYou() {
    if (thankYouModal) {
      thankYouModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (thankYouClose) {
    thankYouClose.addEventListener('click', closeThankYou);
  }
  if (thankYouModal) {
    thankYouModal.addEventListener('click', function (e) {
      if (e.target === thankYouModal) closeThankYou();
    });
  }

  if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('heroName').value.trim();
      const email = document.getElementById('heroEmail').value.trim();
      const phone = document.getElementById('heroPhone').value.trim();
      const program = document.getElementById('heroProgram').value;

      let valid = true;

      // Clear previous errors
      clearError('heroName', 'heroNameErr');
      clearError('heroEmail', 'heroEmailErr');
      clearError('heroPhone', 'heroPhoneErr');
      clearError('heroProgram', 'heroProgramErr');

      if (!name || name.length < 2) {
        showError('heroName', 'heroNameErr', 'Please enter your full name.');
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('heroEmail', 'heroEmailErr', 'Please enter a valid email address.');
        valid = false;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        showError('heroPhone', 'heroPhoneErr', 'Please enter a valid 10-digit phone number.');
        valid = false;
      }

      if (!program) {
        showError('heroProgram', 'heroProgramErr', 'Please select a program.');
        valid = false;
      }

      if (!valid) return;

      // Submit button loading state
      const submitBtn = heroForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting…';
      submitBtn.disabled = true;

      // Simulate API call (replace with real fetch if needed)
      setTimeout(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        heroForm.reset();
        openThankYou(email);
      }, 800);
    });
  }

  /* ─── Smooth Scroll for Nav Links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Company logo img error fallback ──────────────────── */
  document.querySelectorAll('.company-logo').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
      const fallback = img.nextElementSibling;
      if (fallback && fallback.classList.contains('company-name-fallback')) {
        fallback.style.display = 'block';
      }
    });
  });

})();
