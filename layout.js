// layout.js

// Header HTML & CSS with modern toggle switch
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
    order: 0;
    position: relative;
    z-index: 100;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    margin-right: 0.25rem;
    padding: 0;
  }
  .toggle-bg {
    display: inline-block;
    width: 40px;
    height: 22px;
    border-radius: 9999px;
    background: #e2e9f3;
    position: relative;
    vertical-align: middle;
    transition: background 0.16s;
  }
  #toggle-ball {
    width: 18px;
    height: 18px;
    display: block;
    position: absolute;
    top: 2px;
    left: 2px;
    border-radius: 50%;
    background: #2563eb;
    transition: left 0.16s, background 0.16s;
    box-shadow: 0 1px 4px #22304a22;
  }
  #toggle-sun {
    position: absolute;
    left: 7px;
    top: 3px;
    font-size: 12px;
    z-index: 10;
    color: #FFD600;
  }
  #toggle-moon {
    position: absolute;
    right: 7px;
    top: 3px;
    font-size: 12px;
    z-index: 10;
    display: none;
    color: #FFD600;
  }
</style>
<header id="ww-header-bar">
  <a href="index.html" class="logo-title" style="font-family:'Montserrat',Arial,sans-serif;">Wealthwise</a>
  <div id="profile-greeting-inject">
    <button id="theme-toggle" class="theme-toggle-btn" title="Toggle dark/light mode" aria-label="Toggle dark/light mode">
      <span class="sr-only">Toggle dark mode</span>
      <span class="toggle-bg">
        <span id="toggle-ball"></span>
        <span id="toggle-sun">☀️</span>
        <span id="toggle-moon">🌙</span>
      </span>
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

// Modern theme toggle logic
function updateThemeToggleVisual() {
  const isDark = document.documentElement.classList.contains('dark');
  const ball = document.getElementById('toggle-ball');
  const sun = document.getElementById('toggle-sun');
  const moon = document.getElementById('toggle-moon');
  const bg = document.querySelector('.toggle-bg');
  if (!(ball && sun && moon && bg)) return;
  if (isDark) {
    ball.style.left = "20px";
    ball.style.background = "#f3c96b";
    sun.style.display = "none";
    moon.style.display = "block";
    bg.style.background = "#333b4d";
  } else {
    ball.style.left = "2px";
    ball.style.background = "#2563eb";
    sun.style.display = "block";
    moon.style.display = "none";
    bg.style.background = "#e2e9f3";
  }
}

const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  updateThemeToggleVisual();
  themeToggleBtn.addEventListener('click', function() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('wealthwise-theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('wealthwise-theme', 'dark');
    }
    updateThemeToggleVisual();
  });
}
