// Insert header and footer into the DOM
document.getElementById("ww-header").innerHTML = headerHTML;
document.getElementById("ww-footer").innerHTML = footerHTML;

// Set return link for terms
const termsLink = document.getElementById("footer-terms-link");
if (termsLink) {
  termsLink.href = '/terms-of-service.html?return=' + encodeURIComponent(window.location.href);
}

// Theme toggle logic (mirrors your working example)
function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const sun = document.getElementById('theme-sun');
  const moon = document.getElementById('theme-moon');
  if (sun && moon) {
    sun.classList.toggle('d-none', isDark);
    moon.classList.toggle('d-none', !isDark);
  }
}
function setDarkMode(isDark) {
  const html = document.documentElement;
  const body = document.body;
  if (isDark) {
    html.classList.add('dark');
    body.classList.add('dark');
    localStorage.setItem('wealthwise-theme', 'dark');
  } else {
    html.classList.remove('dark');
    body.classList.remove('dark');
    localStorage.setItem('wealthwise-theme', 'light');
  }
  updateThemeIcons();
}

// Ensure toggle is set up after DOM and header are ready
document.addEventListener('DOMContentLoaded', function() {
  // Set initial icon state and class
  let theme = localStorage.getItem('wealthwise-theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setDarkMode(theme === 'dark');

  // Attach event listener (after DOM is ready!)
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(!isDark);
    });
  }
});
