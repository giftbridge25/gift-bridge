(function () {
  try {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileClose = document.getElementById('mobile-close');
    const menuOverlay = document.getElementById('menu-overlay');

    function openMenu() {
      if (!hamburger || !mobileNav) return;
      hamburger.classList.add('open');
      mobileNav.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      if (menuOverlay) {
        menuOverlay.classList.add('open');
        menuOverlay.setAttribute('aria-hidden', 'false');
      }
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      if (!hamburger || !mobileNav) return;
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      if (menuOverlay) {
        menuOverlay.classList.remove('open');
        menuOverlay.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('menu-open');
      hamburger.focus();
    }

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) closeMenu();
        else openMenu();
      });
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);

    if (mobileNav) {
      mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) closeMenu();
      });
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) closeMenu();
    });
  } catch (err) {
    // fail silently in older browsers
    console.error('menu.js error', err);
  }
})();