/* ====================================
   STRATUM V2 - SITE JAVASCRIPT
   ==================================== */

// ====================================
// DEV I18N (VITE)
// ====================================
const I18N_SUPPORTED_LOCALES = new Set(['en', 'zh', 'ru']);
const I18N_LOCALE_ALIASES = {
  cn: 'zh'
};

function getLocaleFromPathname(pathname) {
  const firstSegment = String(pathname || '/')
    .split('/')
    .filter(Boolean)[0];

  if (!firstSegment) return 'en';

  const normalized = firstSegment.toLowerCase();
  const resolved = I18N_LOCALE_ALIASES[normalized] ?? normalized;
  return I18N_SUPPORTED_LOCALES.has(resolved) ? resolved : 'en';
}

function parseTranslationText(text) {
  const translations = {};

  String(text)
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex <= 0) return;

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      translations[key] = value;
    });

  return translations;
}

async function initDevTranslations() {
  if (!import.meta.env?.DEV) return;

  const locale = getLocaleFromPathname(window.location.pathname);
  document.documentElement.lang = locale;
  if (locale === 'en') return;

  try {
    const res = await fetch(`/locales/${locale}.txt`, { cache: 'no-store' });
    if (!res.ok) {
      console.warn(`i18n: failed to load /locales/${locale}.txt (${res.status})`);
      return;
    }

    const translations = parseTranslationText(await res.text());

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const translated = translations[key];
      if (translated !== undefined) el.textContent = translated;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      const translated = translations[key];
      if (translated !== undefined) el.setAttribute('placeholder', translated);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (!key) return;
      const translated = translations[key];
      if (translated !== undefined) el.setAttribute('aria-label', translated);
    });
  } catch (err) {
    console.warn('i18n: failed to apply translations', err);
  }
}

// ====================================
// LANGUAGE SWITCHER
// ====================================
function initLanguageSwitcher() {
  const switchers = document.querySelectorAll('.lang-switcher');
  if (switchers.length === 0) return;

  const controls = [];

  switchers.forEach((switcher) => {
    const toggle = switcher.querySelector('.lang-toggle');
    const dropdown = switcher.querySelector('.lang-dropdown');
    if (!toggle || !dropdown) return;

    controls.push({ switcher, toggle, dropdown });
  });

  if (controls.length === 0) return;

  const closeAll = () => {
    controls.forEach(({ toggle, dropdown }) => {
      dropdown.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  };

  controls.forEach(({ toggle, dropdown }) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('active');
      closeAll();
      if (!isOpen) dropdown.classList.add('active');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', (e) => {
    if (!controls.some(({ switcher }) => switcher.contains(e.target))) {
      closeAll();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

// ====================================
// THEME TOGGLE
// ====================================
function initThemeToggle() {
  const toggles = document.querySelectorAll('.theme-toggle');
  if (toggles.length === 0) return;

  const html = document.documentElement;

  // Theme is already set by inline script in <head> to prevent flash
  // This function only handles the toggle button and system preference changes

  // Listen for system theme changes (only when no manual preference is saved).
  // Safari versions that lack addEventListener on MediaQueryList still support addListener.
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e) => {
    if (!localStorage.getItem('theme')) {
      html.classList.toggle('dark', e.matches);
    }
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleSystemThemeChange);
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      html.classList.toggle('dark');
      const isDark = html.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
}

// ====================================
// FEATURE TABS
// ====================================
function initFeatureTabs() {
  const tabList = document.querySelector('.feature-tabs');
  const tabs = Array.from(document.querySelectorAll('.feature-tab'));
  const textPanels = Array.from(document.querySelectorAll('.feature-text'));
  const vizPanels = Array.from(document.querySelectorAll('.visualization-panel'));

  if (!tabList || tabs.length === 0) return;
  tabList.setAttribute('role', 'tablist');

  // Cache panel lookups by feature index
  const textPanelMap = new Map();
  const vizPanelMap = new Map();

  textPanels.forEach(panel => {
    textPanelMap.set(panel.dataset.featureContent, panel);
  });
  vizPanels.forEach(panel => {
    vizPanelMap.set(panel.dataset.viz, panel);
  });

  tabs.forEach((tab, index) => {
    const featureIndex = tab.dataset.feature || String(index);
    tab.dataset.feature = featureIndex;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
    if (!tab.id) tab.id = `feature-tab-${featureIndex}`;

    const textPanel = textPanelMap.get(featureIndex);
    if (textPanel) {
      if (!textPanel.id) textPanel.id = `feature-panel-${featureIndex}`;
      textPanel.setAttribute('role', 'tabpanel');
      textPanel.setAttribute('aria-labelledby', tab.id);
      tab.setAttribute('aria-controls', textPanel.id);
    }
  });

  function setActiveFeature(featureIndex, { focus = false } = {}) {
    tabs.forEach(tab => {
      const isActive = tab.dataset.feature === featureIndex;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && focus) tab.focus();
    });

    textPanels.forEach(panel => {
      const isActive = panel.dataset.featureContent === featureIndex;
      panel.classList.toggle('hidden', !isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    vizPanels.forEach(panel => {
      const isActive = panel.dataset.viz === featureIndex;
      panel.classList.toggle('hidden', !isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      setActiveFeature(tab.dataset.feature);
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        setActiveFeature(next.dataset.feature, { focus: true });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const previous = tabs[(idx - 1 + tabs.length) % tabs.length];
        setActiveFeature(previous.dataset.feature, { focus: true });
      } else if (e.key === 'Home') {
        e.preventDefault();
        const first = tabs[0];
        setActiveFeature(first.dataset.feature, { focus: true });
      } else if (e.key === 'End') {
        e.preventDefault();
        const last = tabs[tabs.length - 1];
        setActiveFeature(last.dataset.feature, { focus: true });
      }
    });
  });

  const initialActive = tabs.find(tab => tab.classList.contains('active')) || tabs[0];
  setActiveFeature(initialActive.dataset.feature);
}

// ====================================
// GENERIC CAROUSEL FACTORY
// ====================================
function initCarousel(selector) {
  const carousel = document.querySelector(selector);
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  if (slides.length === 0 || dots.length === 0) return;

  const carouselId = carousel.id || `carousel-${selector.replace(/[^a-z0-9_-]/gi, '')}`;
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let current = 0;

  slides.forEach((slide, index) => {
    if (!slide.id) slide.id = `${carouselId}-slide-${index}`;
  });

  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-controls', slides[index]?.id || '');
    dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goTo(index + 1, { focusDot: true });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(index - 1, { focusDot: true });
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0, { focusDot: true });
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(slides.length - 1, { focusDot: true });
      }
    });
  });

  function goTo(index, { focusDot = false } = {}) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;

    slides.forEach((s, i) => {
      const isActive = i === index;
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-hidden', String(!isActive));
      if (!isActive) s.setAttribute('tabindex', '-1');
      else s.removeAttribute('tabindex');
    });
    dots.forEach((d, i) => {
      const isActive = i === index;
      d.classList.toggle('active', isActive);
      d.setAttribute('aria-selected', String(isActive));
      d.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && focusDot) d.focus();
    });
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  goTo(0);
}

// ====================================
// COMPARISON SLIDERS
// ====================================
function initComparisonSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  if (sliders.length === 0) return;

  let activeSlider = null;

  // Single global mouseup listener (prevents memory leak)
  document.addEventListener('mouseup', () => {
    activeSlider = null;
  });

  sliders.forEach(slider => {
    const v1Layer = slider.querySelector('.comparison-v1');
    const handle = slider.querySelector('.slider-handle');

    // Update container width on resize and set CSS variable
    function updateContainerWidth() {
      // Set the CSS variable for the V1 content fixed width
      slider.style.setProperty('--slider-container-width', `${slider.offsetWidth}px`);
    }

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });
    resizeObserver.observe(slider);

    // Initial setup
    updateContainerWidth();
    updateSliderPosition(50);

    function updateSliderPosition(percent) {
      v1Layer.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    }

    function handleMove(clientX) {
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percent = (x / rect.width) * 100;
      updateSliderPosition(percent);
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      activeSlider = slider;
      handleMove(e.clientX);
    });

    slider.addEventListener('mousemove', (e) => {
      if (activeSlider === slider) {
        handleMove(e.clientX);
      }
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      activeSlider = slider;
      handleMove(e.touches[0].clientX);
    });

    slider.addEventListener('touchmove', (e) => {
      if (activeSlider === slider) {
        handleMove(e.touches[0].clientX);
      }
    });

    slider.addEventListener('touchend', () => {
      activeSlider = null;
    });
  });
}

// ====================================
// SUPPORTER TABS & LOGOS
// ====================================
function initSupporterTabs() {
  const tabs = document.querySelectorAll('.supporter-tab');
  const grid = document.getElementById('supporters-grid');
  const workingGroupInfo = document.getElementById('working-group-info');

  // Exit early if elements don't exist (e.g., on blog pages)
  if (!grid || tabs.length === 0) return;

  // Supporter data with categories
  // Categories: "funder" = financial supporters, "workingGroup" = WG members
  // Supporters without these categories still appear in "All"
  const supporters = [
    { name: "Auradine", logo: "/assets/logos/auradine.png", width: 256, height: 92, website: "https://auradine.com/", categories: ["workingGroup"] },
    { name: "Bitmex", logo: "/assets/logos/bitmex-logo.svg", width: 231, height: 98, website: "https://www.bitmex.com/", categories: [] },
    { name: "Braiins", logo: "/assets/logos/braiins-logo.svg", width: 240, height: 87, website: "https://braiins.com/", categories: ["workingGroup"] },
    { name: "Btrust", logo: "/assets/logos/btrust.svg", width: 753, height: 319, website: "https://www.btrust.tech/", categories: ["funder"] },
    { name: "DMND", logo: "/assets/logos/demand-logo.svg", width: 612, height: 258, website: "https://www.dmnd.work/", categories: ["workingGroup"] },
    { name: "Foundry", logo: "/assets/logos/foundry-logo.svg", width: 231, height: 74, website: "https://foundrydigital.com/", categories: ["workingGroup"] },
    { name: "Galaxy", logo: "/assets/logos/galaxy-logo.svg", width: 231, height: 111, website: "https://www.galaxy.com/", categories: [] },
    { name: "HRF", logo: "/assets/logos/hrf-logo.svg", width: 269, height: 75, website: "https://hrf.org/", categories: ["funder"] },
    { name: "Hut8", logo: "/assets/logos/hut-logo.svg", width: 208, height: 94, website: "https://www.hut8.com/", categories: [] },
    { name: "OpenSats", logo: "/assets/logos/opensats-logo.svg", width: 269, height: 39, website: "https://opensats.org/", categories: ["funder"] },
    { name: "Spiral", logo: "/assets/logos/spiral-logo.svg", width: 122, height: 120, website: "https://spiral.xyz/", categories: ["funder", "workingGroup"] },
    { name: "Summer of Bitcoin", logo: "/assets/logos/summer-of-bitcoin.svg", width: 231, height: 74, website: "https://www.summerofbitcoin.org/", categories: [] },
    { name: "Vinteum", logo: "/assets/logos/vinteum-logo.png", width: 629, height: 171, website: "https://vinteum.org/", categories: ["funder"] },
  ].sort((a, b) => a.name.localeCompare(b.name));

  function getFilteredSupporters(tabId) {
    if (tabId === 'all') {
      return supporters;
    }
    return supporters.filter(s => s.categories.includes(tabId));
  }

  function handleImageError(img, supporterName) {
    img.style.display = 'none';
    const span = document.createElement('span');
    span.className = 'text-logo';
    span.textContent = supporterName;
    img.parentElement.appendChild(span);
  }

  function renderSupporters(tabId) {
    const filtered = getFilteredSupporters(tabId);
    const isWorkingGroup = tabId === 'workingGroup';

    // Clear existing content
    grid.innerHTML = '';

    // Create elements using DOM API instead of innerHTML with inline handlers
    filtered.forEach(supporter => {
      const link = document.createElement('a');
      link.href = supporter.website;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'supporter-logo';
      link.setAttribute('aria-label', `Visit ${supporter.name} website`);

      if (supporter.logo) {
        const img = document.createElement('img');
        img.src = supporter.logo;
        img.alt = supporter.name;
        img.loading = 'lazy';
        if (supporter.width) img.width = supporter.width;
        if (supporter.height) img.height = supporter.height;
        img.addEventListener('error', () => handleImageError(img, supporter.name));
        link.appendChild(img);
      } else {
        const span = document.createElement('span');
        span.className = 'text-logo';
        span.textContent = supporter.name;
        link.appendChild(span);
      }

      grid.appendChild(link);
    });

    // Show/hide working group info
    workingGroupInfo.classList.toggle('hidden', !isWorkingGroup);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.supporterTab;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Render supporters
      renderSupporters(tabId);
    });
  });

  // Initial render
  renderSupporters('all');
}

function initSupporterTabsWhenVisible() {
  const section = document.getElementById('supporters');
  if (!section || !('IntersectionObserver' in window)) {
    initSupporterTabs();
    return;
  }

  let initialized = false;
  const observer = new IntersectionObserver((entries) => {
    if (initialized) return;
    if (!entries.some(entry => entry.isIntersecting)) return;
    initialized = true;
    observer.disconnect();
    initSupporterTabs();
  }, {
    rootMargin: '300px 0px'
  });

  observer.observe(section);
}

// ====================================
// CURRENT YEAR
// ====================================
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ====================================
// CLIPBOARD UTILITY
// ====================================
async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Modern browsers all support navigator.clipboard
  // If we reach here, clipboard access is likely blocked by permissions
  throw new Error('Clipboard API not available');
}

// ====================================
// UNIFIED CLICK HANDLER
// ====================================
function initGlobalClickHandler() {
  document.addEventListener('click', async (e) => {
    // Skip if already handled
    if (e.defaultPrevented) return;

    // Handle heading anchor copy
    const headingAnchor = e.target?.closest?.('a.heading-anchor[href^="#"]');
    if (headingAnchor && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      e.stopPropagation();

      const hash = headingAnchor.getAttribute('href');
      if (hash) {
        const url = new URL(window.location.href);
        url.hash = hash;

        try {
          await copyToClipboard(url.toString());
          headingAnchor.classList.add('copied');
          setTimeout(() => headingAnchor.classList.remove('copied'), 1200);
        } catch (err) {
          console.warn('Failed to copy link:', err);
        }

        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
      }
      return;
    }

    // Handle smooth scroll for anchor links (excluding heading anchors)
    const anchor = e.target?.closest?.('a[href]');
    if (anchor && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      if (anchor.classList.contains('heading-anchor')) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      let hash = null;
      if (href.startsWith('#')) {
        hash = href;
      } else if (href.startsWith('/#')) {
        const targetUrl = new URL(href, window.location.origin);
        if (targetUrl.pathname === window.location.pathname) {
          hash = targetUrl.hash;
        }
      }

      if (!hash) return;

      let targetElement = null;
      try {
        targetElement = document.querySelector(hash);
      } catch {
        // Invalid selector
        return;
      }

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      return;
    }

    // Handle lightbox image clicks
    const img = e.target?.closest?.('img');
    if (img) {
      if (img.closest('.lightbox-overlay')) return;
      if (!img.closest('.blog-content') && !img.closest('.spec-content')) return;

      openLightbox(img.currentSrc || img.src, img.alt);
    }
  });
}

// ====================================
// IMAGE LIGHTBOX (BLOG + SPEC)
// ====================================
let lightboxOverlay = null;
let lightboxImage = null;
let lightboxCaption = null;
let lightboxCloseButton = null;
let previousBodyOverflow = null;
let previousFocusElement = null;

function openLightbox(imgSrc, imgAlt) {
  if (!imgSrc || !lightboxOverlay) return;

  lightboxImage.src = imgSrc;
  lightboxImage.alt = imgAlt || '';

  if (lightboxCaption) {
    const captionText = (imgAlt || '').trim();
    lightboxCaption.textContent = captionText;
    lightboxCaption.style.display = captionText ? 'block' : 'none';
  }

  if (!lightboxOverlay.classList.contains('active')) {
    previousBodyOverflow = document.body.style.overflow;
    previousFocusElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
  }

  lightboxOverlay.classList.add('active');
  lightboxCloseButton?.focus();
}

function closeLightbox() {
  if (!lightboxOverlay) return;

  lightboxOverlay.classList.remove('active');
  document.body.style.overflow = previousBodyOverflow ?? '';
  previousBodyOverflow = null;
  if (previousFocusElement?.isConnected) {
    previousFocusElement.focus();
  }
  previousFocusElement = null;

  // Clear image after transition
  setTimeout(() => {
    if (lightboxOverlay && !lightboxOverlay.classList.contains('active')) {
      lightboxImage.src = '';
    }
  }, 300);
}

function initImageLightbox() {
  // Create lightbox overlay if it doesn't exist
  lightboxOverlay = document.querySelector('.lightbox-overlay');

  if (!lightboxOverlay) {
    lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.setAttribute('role', 'dialog');
    lightboxOverlay.setAttribute('aria-modal', 'true');
    lightboxOverlay.setAttribute('aria-label', 'Image preview');
    lightboxOverlay.tabIndex = -1;
    lightboxOverlay.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close lightbox"></button>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="" />
        <div class="lightbox-caption" aria-live="polite"></div>
      </div>
    `;
    document.body.appendChild(lightboxOverlay);
  }

  lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
  lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
  lightboxCloseButton = lightboxOverlay.querySelector('.lightbox-close');

  // Close lightbox on close button click
  lightboxCloseButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Close on overlay click
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  lightboxOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
      return;
    }
    if (e.key === 'Tab' && lightboxCloseButton) {
      e.preventDefault();
      lightboxCloseButton.focus();
    }
  });
}

// ====================================
// MOBILE MENU
// ====================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const navbar = document.querySelector('.navbar');

  if (!toggle || !menu) return;

  function syncMenuOffset() {
    if (!navbar) return;
    const top = Math.round(navbar.getBoundingClientRect().bottom);
    menu.style.setProperty('--mobile-menu-top', `${top}px`);
  }

  function closeMenu() {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    syncMenuOffset();
    menu.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
  }

  syncMenuOffset();

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Use event delegation for menu links (handles dynamically added links)
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      closeMenu();
    }
  });

  backdrop?.addEventListener('click', closeMenu);

  // Close menu when resizing to desktop
  window.addEventListener('resize', () => {
    syncMenuOffset();
    if (window.innerWidth >= 1200 && menu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ====================================
// WIZARD MODAL
// ====================================
let wizardOverlay = null;
let wizardUnmount = null;
let previousWizardOverflow = null;
let wizardModulePromise = null;

function loadWizardModule() {
  if (wizardModulePromise) return wizardModulePromise;

  wizardModulePromise = import('./wizard-island.jsx')
    .catch((firstErr) => {
      console.warn('Wizard module initial load failed, retrying once...', firstErr);
      return new Promise((resolve) => {
        setTimeout(() => resolve(import('./wizard-island.jsx')), 250);
      });
    });

  return wizardModulePromise;
}

function openWizardModal() {
  if (!wizardOverlay) {
    wizardOverlay = document.createElement('div');
    wizardOverlay.className = 'wizard-overlay';
    wizardOverlay.setAttribute('role', 'dialog');
    wizardOverlay.setAttribute('aria-modal', 'true');
    wizardOverlay.setAttribute('aria-label', 'Start Mining Wizard');
    wizardOverlay.innerHTML = `
      <div class="wizard-modal">
        <div class="wizard-modal-header">
          <button class="wizard-modal-close" aria-label="Close wizard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="wizard-modal-body">
          <div data-wizard-container></div>
        </div>
      </div>
    `;
    document.body.appendChild(wizardOverlay);

    wizardOverlay.addEventListener('click', (e) => {
      if (e.target === wizardOverlay) closeWizardModal();
    });

    wizardOverlay.querySelector('.wizard-modal-close')
      .addEventListener('click', closeWizardModal);
  }

  previousWizardOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  wizardOverlay.classList.add('active');

  const container = wizardOverlay.querySelector('[data-wizard-container]');
  loadWizardModule()
    .then(({ mountWizard, unmountWizard }) => {
      wizardUnmount = unmountWizard;
      mountWizard(container);
    })
    .catch((err) => {
      console.error('Failed to load wizard:', err);
      container.textContent = 'Failed to load the wizard. Please try again.';
    });
}

function closeWizardModal() {
  if (!wizardOverlay) return;

  wizardOverlay.classList.remove('active');
  document.body.style.overflow = previousWizardOverflow ?? '';
  previousWizardOverflow = null;

  setTimeout(() => {
    if (wizardUnmount && wizardOverlay && !wizardOverlay.classList.contains('active')) {
      wizardUnmount();
    }
  }, 300);
}

function initWizardModal() {
  const btn = document.getElementById('start-mining-btn');
  if (!btn) return;
  const warmWizard = () => {
    loadWizardModule().catch(() => {
      // Ignore; openWizardModal handles error display.
    });
  };
  btn.addEventListener('pointerenter', warmWizard, { once: true, passive: true });
  btn.addEventListener('focus', warmWizard, { once: true });
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openWizardModal();
  });
}

// ====================================
// UNIFIED KEYBOARD HANDLER
// ====================================
function initGlobalKeyboardHandler() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('mobile-menu-toggle');

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    // Close wizard modal (highest priority)
    if (wizardOverlay?.classList.contains('active')) {
      closeWizardModal();
      return;
    }

    // Close lightbox
    if (lightboxOverlay?.classList.contains('active')) {
      closeLightbox();
      return;
    }

    // Close mobile menu
    if (menu?.classList.contains('active')) {
      menu.classList.remove('active');
      toggle?.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('mobile-menu-open');
      document.body.style.overflow = '';
    }
  });
}

// ====================================
// ACTIVE NAV LINK
// ====================================
function initActiveNavLink() {
  const path = window.location.pathname;
  let targetHref = null;

  if (path.startsWith('/blog')) {
    targetHref = '/blog/';
  } else if (path.startsWith('/specification')) {
    targetHref = '/specification/00-abstract/';
  }

  if (!targetHref) return;

  document.querySelectorAll('.navbar-links a, .mobile-menu-nav a').forEach((link) => {
    if (link.getAttribute('href') === targetHref) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ====================================
// NAV ANCHOR NORMALIZATION
// ====================================
function initNavAnchors() {
  const path = window.location.pathname;
  const isContentPage = path.startsWith('/blog') || path.startsWith('/specification');

  if (isContentPage) return;

  document.querySelectorAll('.navbar-links a[href^="/#"], .mobile-menu-nav a[href^="/#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    link.setAttribute('href', href.replace('/#', '#'));
  });
}

// ====================================
// INITIALIZE ALL
// ====================================
function runWhenIdle(callback, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => callback(), { timeout });
  } else {
    setTimeout(callback, 1000);
  }
}

function runAfterLoad(callback) {
  if (document.readyState === 'complete') {
    callback();
    return;
  }
  window.addEventListener('load', callback, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initDevTranslations();
  initLanguageSwitcher();
  initNavAnchors();
  initActiveNavLink();
  initMobileMenu();
  initWizardModal();

  runAfterLoad(() => {
    runWhenIdle(() => {
      initThemeToggle();
      initGlobalClickHandler();
      initGlobalKeyboardHandler();
      initFeatureTabs();
      initCarousel('.profit-carousel');
      initCarousel('.autonomy-carousel');
      initComparisonSliders();
      initSupporterTabsWhenVisible();
      initCurrentYear();
      initImageLightbox();
    }, 4000);
  });
});
