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

  switchers.forEach((switcher) => {
    const toggle = switcher.querySelector('.lang-toggle');
    const dropdown = switcher.querySelector('.lang-dropdown');
    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('active');
      dropdown.classList.toggle('active');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
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

  // Listen for system theme changes (only when no manual preference is saved)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      html.classList.toggle('dark', e.matches);
    }
  });

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
  const tabs = document.querySelectorAll('.feature-tab');
  const textPanels = document.querySelectorAll('.feature-text');
  const vizPanels = document.querySelectorAll('.visualization-panel');

  if (tabs.length === 0) return;

  // Cache panel lookups by feature index
  const textPanelMap = new Map();
  const vizPanelMap = new Map();

  textPanels.forEach(panel => {
    textPanelMap.set(panel.dataset.featureContent, panel);
  });
  vizPanels.forEach(panel => {
    vizPanelMap.set(panel.dataset.viz, panel);
  });

  let activeTab = null;
  let activeTextPanel = null;
  let activeVizPanel = null;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const featureIndex = tab.dataset.feature;

      // Update active tab
      if (activeTab) activeTab.classList.remove('active');
      tab.classList.add('active');
      activeTab = tab;

      // Update text content
      if (activeTextPanel) activeTextPanel.classList.add('hidden');
      const newTextPanel = textPanelMap.get(featureIndex);
      if (newTextPanel) {
        newTextPanel.classList.remove('hidden');
        activeTextPanel = newTextPanel;
      }

      // Update visualization
      if (activeVizPanel) activeVizPanel.classList.add('hidden');
      const newVizPanel = vizPanelMap.get(featureIndex);
      if (newVizPanel) {
        newVizPanel.classList.remove('hidden');
        activeVizPanel = newVizPanel;
      }
    });
  });

  // Initialize active state
  const initialActive = document.querySelector('.feature-tab.active');
  if (initialActive) {
    activeTab = initialActive;
    activeTextPanel = textPanelMap.get(initialActive.dataset.feature);
    activeVizPanel = vizPanelMap.get(initialActive.dataset.feature);
  }
}

// ====================================
// GENERIC CAROUSEL FACTORY
// ====================================
function initCarousel(selector) {
  const carousel = document.querySelector(selector);
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let current = 0;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;

    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
}

// ====================================
// COMPARISON SLIDERS
// ====================================
function initComparisonSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  if (sliders.length === 0) return;

  let activeSlider = null;
  const resizeObservers = [];

  // Single global mouseup listener (prevents memory leak)
  document.addEventListener('mouseup', () => {
    activeSlider = null;
  });

  sliders.forEach(slider => {
    const v1Layer = slider.querySelector('.comparison-v1');
    const handle = slider.querySelector('.slider-handle');
    let containerWidth = slider.offsetWidth;

    // Update container width on resize and set CSS variable
    function updateContainerWidth() {
      containerWidth = slider.offsetWidth;
      // Set the CSS variable for the V1 content fixed width
      slider.style.setProperty('--slider-container-width', `${containerWidth}px`);
    }

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });
    resizeObserver.observe(slider);
    resizeObservers.push({ observer: resizeObserver, element: slider });

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

  // Cleanup function (for future use if needed)
  return () => {
    resizeObservers.forEach(({ observer, element }) => {
      observer.unobserve(element);
      observer.disconnect();
    });
  };
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
    { name: "Auradine", logo: "/assets/logos/auradine.svg", website: "https://auradine.com/", categories: ["workingGroup"] },
    { name: "Bitmex", logo: "/assets/logos/bitmex-logo.svg", website: "https://www.bitmex.com/", categories: [] },
    { name: "Braiins", logo: "/assets/logos/braiins-logo.svg", website: "https://braiins.com/", categories: ["workingGroup"] },
    { name: "Btrust", logo: "/assets/logos/btrust.svg", website: "https://www.btrust.tech/", categories: ["funder"] },
    { name: "DMND", logo: "/assets/logos/demand-logo.svg", website: "https://www.dmnd.work/", categories: ["workingGroup"] },
    { name: "Foundry", logo: "/assets/logos/foundry-logo.svg", website: "https://foundrydigital.com/", categories: ["workingGroup"] },
    { name: "Galaxy", logo: "/assets/logos/galaxy-logo.svg", website: "https://www.galaxy.com/", categories: [] },
    { name: "HRF", logo: "/assets/logos/hrf-logo.svg", website: "https://hrf.org/", categories: ["funder"] },
    { name: "Hut8", logo: "/assets/logos/hut-logo.svg", website: "https://www.hut8.com/", categories: [] },
    { name: "OpenSats", logo: "/assets/logos/opensats-logo.svg", website: "https://opensats.org/", categories: ["funder"] },
    { name: "Spiral", logo: "/assets/logos/spiral-logo.svg", website: "https://spiral.xyz/", categories: ["funder", "workingGroup"] },
    { name: "Summer of Bitcoin", logo: "/assets/logos/summer-of-bitcoin.svg", website: "https://www.summerofbitcoin.org/", categories: [] },
    { name: "Vinteum", logo: "/assets/logos/vinteum-logo.png", website: "https://vinteum.org/", categories: ["funder"] },
  ].sort((a, b) => a.name.localeCompare(b.name));

  function getFilteredSupporters(tabId) {
    if (tabId === 'all') {
      return supporters;
    }
    return supporters.filter(s => s.categories.includes(tabId));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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
let previousBodyOverflow = null;

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
    document.body.style.overflow = 'hidden';
  }

  lightboxOverlay.classList.add('active');
}

function closeLightbox() {
  if (!lightboxOverlay) return;

  lightboxOverlay.classList.remove('active');
  document.body.style.overflow = previousBodyOverflow ?? '';
  previousBodyOverflow = null;

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
    lightboxOverlay.innerHTML = `
      <div class="lightbox-close" aria-label="Close lightbox"></div>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="" />
        <div class="lightbox-caption" aria-live="polite"></div>
      </div>
    `;
    document.body.appendChild(lightboxOverlay);
  }

  lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
  lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
  const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

  // Close lightbox on close button click
  lightboxClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Close on overlay click
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });
}

// ====================================
// MOBILE MENU
// ====================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    menu.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

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

  // Close menu when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && menu.classList.contains('active')) {
      closeMenu();
    }
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
    setTimeout(callback, 200);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initDevTranslations();
  initLanguageSwitcher();
  initThemeToggle();
  initMobileMenu();
  initNavAnchors();
  initActiveNavLink();
  initGlobalClickHandler();
  initGlobalKeyboardHandler();

  runWhenIdle(() => {
    initFeatureTabs();
    initCarousel('.profit-carousel');
    initCarousel('.autonomy-carousel');
    initComparisonSliders();
    initSupporterTabs();
    initCurrentYear();
    initImageLightbox();
  });
});
