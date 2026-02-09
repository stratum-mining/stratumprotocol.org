(function () {
  const input = document.getElementById('spec-search');
  const nav = document.getElementById('spec-nav');
  const pageSelect = document.getElementById('spec-page-select');
  const navToggle = document.getElementById('spec-mobile-nav-toggle');
  const navClose = document.getElementById('spec-mobile-nav-close');
  const navBackdrop = document.getElementById('spec-mobile-backdrop');

  const setNavOpen = function (open) {
    document.body.classList.toggle('spec-nav-open', !!open);
  };

  if (navToggle) navToggle.addEventListener('click', function () { setNavOpen(true); });
  if (navClose) navClose.addEventListener('click', function () { setNavOpen(false); });
  if (navBackdrop) navBackdrop.addEventListener('click', function () { setNavOpen(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNavOpen(false);
  });

  if (pageSelect) {
    pageSelect.addEventListener('change', function () {
      if (!this.value) return;
      window.location.href = this.value;
    });
  }

  if (!input || !nav) return;

  const items = Array.from(nav.querySelectorAll('.spec-nav-item'));
  const entries = items.map(item => ({
    item,
    text: (item.querySelector('.spec-page-link')?.textContent || '').toLowerCase()
  }));

  function applyFilter() {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    for (const entry of entries) {
      const show = !q || entry.text.includes(q);
      entry.item.style.display = show ? '' : 'none';
      if (show) visible += 1;
    }

    nav.dataset.empty = visible === 0 ? '1' : '';
  }

  nav.addEventListener('click', function (e) {
    const link = e.target.closest('a.spec-toc-link[href^="#"]');
    if (link) setNavOpen(false);
  });

  input.addEventListener('input', applyFilter, { passive: true });
  input.addEventListener('search', applyFilter, { passive: true });
})();
