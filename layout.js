// layout.js

// Header HTML & CSS with SVG theme toggle (mirrors your working homepage toggle)
const headerHTML = `
<style>
  #ww-header-bar {
    background: #1a2332;
    color: #f3c96b;
    padding: 1.1rem 0.5rem;
    display: flex;
    align-items: center;
    width: 100vw;
    box-sizing: border-box;
    border-bottom: 1.5px solid #e2e9f3;
    font-family: 'Montserrat', Arial, sans-serif;
  }
  #ww-header-bar .logo-title {
    font-weight: bold;
    font-size: 1.35rem;
    letter-spacing: 0.03em;
    color: #f3c96b;
    text-decoration: none;
    margin-left: 0.5rem;
  }
  #profile-greeting-inject {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    padding-right: 6px;
    max-width: 100vw;
    overflow: visible;
    flex-shrink: 1;
  }
  .theme-toggle-btn {
    margin-left: auto;
    margin-right: 0.5rem;
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
    color: #f3c96b;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .theme-toggle-btn:hover {
    background: #232c3f;
  }
  .d-none { display: none !important; }
  .d-inline { display: inline !important; }
</style>
<header id="ww-header-bar">
  <a href="index.html" class="logo-title" style="font-family:'Montserrat',Arial,sans-serif;">Wealthwise</a>
  <div id="profile-greeting-inject">
    <button id="theme-toggle" type="button" class="theme-toggle-btn" title="Toggle dark/light mode">
      <!-- Sun (Light Mode) -->
      <svg id="theme-sun" class="d-inline" style="width:1.7em;height:1.7em;vertical-align:middle;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" stroke="currentColor" fill="none"/>
        <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42"/>
      </svg>
      <!-- Moon (Dark Mode) -->
      <svg id="theme-moon" class="d-none" style="width:1.7em;height:1.7em;vertical-align:middle;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3c.47 0 .94.03 1.41.08a7 7 0 008.3 9.71c.05.47.08.94.08 1.41z"/>
      </svg>
    </button>
  </div>
</header>
`;

const footerHTML = `
<style>
  #ww-footer-bar {
    text-align: center;
    color: #e5e9f2;
    background: #1a2332;
    border-top: 1.5px solid #e2e9f3;
    padding: 1.1rem 0 0.85rem 0;
    width: 100vw;
    font-size: 0.94em;
    font-family: 'Montserrat', Arial, sans-serif;
    margin-top: auto;
    box-sizing: border-box;
  }
  #ww-footer-bar .footer-links a {
    margin: 0 0.6em;
    color: #FFD600;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.18s;
  }
  #ww-footer-bar .footer-links a:hover {
    color: #FFC300;
  }
  @media (max-width: 500px) {
    #ww-footer-bar {
      font-size: 0.82em;
      padding: 0.7rem 0 0.5rem 0;
    }
    #ww-footer-bar .footer-links {
      margin-bottom: 0.5em;
    }
  }
</style>
<footer id="ww-footer-bar">
  <div class="footer-links">
    <a href="/terms-of-service.html?return=" id="footer-terms-link">Terms of Service</a>
    <a href="/privacy-policy/">Privacy Policy</a>
  </div>
  <div>&copy; 2025 Wealthwise. All rights reserved.</div>
</footer>
`;

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
    if (isDark) {
      sun.classList.add('d-none');
      moon.classList.remove('d-none');
    } else {
      sun.classList.remove('d-none');
      moon.classList.add('d-none');
    }
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
function initThemeToggle() {
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
}

// Wait until DOM is fully loaded so SVGs/icons exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
