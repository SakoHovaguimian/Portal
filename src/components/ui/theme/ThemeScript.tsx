export function ThemeScript() {
  const script = `
    (function() {
      try {
        const raw = localStorage.getItem('semantic-web-theme');
        const value = raw ? JSON.parse(raw) : { mode: 'light', accent: 'aqua' };
        var root = document.documentElement;
        root.classList.toggle('dark-mode', value.mode === 'dark');
        root.dataset.theme = value.mode || 'light';
        root.dataset.accent = value.accent || 'aqua';
      } catch (error) {
        var root = document.documentElement;
        root.classList.remove('dark-mode');
        root.dataset.theme = 'light';
        root.dataset.accent = 'aqua';
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
