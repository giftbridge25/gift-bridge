(function () {
  try {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileClose = document.getElementById('mobile-close');
    const menuOverlay = document.getElementById('menu-overlay');

    let lastFocusedElement = null;
    let trapKeyHandler = null;

    // Ensure ARIA role for dialog behavior
    if (mobileNav) {
      mobileNav.setAttribute('role', 'dialog');
      mobileNav.setAttribute('aria-modal', 'true');
    }

    function getFocusableElements(container) {
      if (!container) return [];
      return Array.from(
        container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    function openMenu() {
      if (!hamburger || !mobileNav) return;
      lastFocusedElement = document.activeElement;

      hamburger.classList.add('open');
      mobileNav.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      if (menuOverlay) {
        menuOverlay.classList.add('open');
        menuOverlay.setAttribute('aria-hidden', 'false');
      }

      const focusables = getFocusableElements(mobileNav);
      const firstLink = focusables[0] || mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();

      // Add focus trap
      trapKeyHandler = function (e) {
        if (e.key === 'Escape') return closeMenu();
        if (e.key !== 'Tab') return;
        const focusableEls = getFocusableElements(mobileNav);
        if (focusableEls.length === 0) {
          e.preventDefault();
          return;
        }
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      };

      document.addEventListener('keydown', trapKeyHandler);
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

      if (trapKeyHandler) {
        document.removeEventListener('keydown', trapKeyHandler);
        trapKeyHandler = null;
      }

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      } else if (hamburger) {
        hamburger.focus();
      }
      lastFocusedElement = null;
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

    // Keep a fallback Escape handler if trap isn't added for some reason
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) closeMenu();
    });
  } catch (err) {
    // fail silently in older browsers
    console.error('menu.js error', err);
  }
})();