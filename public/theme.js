// Apply the saved appearance before the stylesheet loads to avoid a bright flash.
(() => {
  let saved;
  try { saved = localStorage.getItem('safebelt-theme'); } catch {}
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();
