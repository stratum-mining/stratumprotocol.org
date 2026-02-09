// Runs before styles are applied to avoid theme flash.
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    // Ignore storage/matchMedia failures.
  }
})();
