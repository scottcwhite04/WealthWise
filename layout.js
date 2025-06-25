I need the css to be in the layout.js file below:
// Supabase Init
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://anwwjqupywbnwanuckdf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3dqcXVweXdibndhbnVja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzgxOTksImV4cCI6MjA2NTAxNDE5OX0.ExlSkJTP3mJ9u-7SVws0FYcNvlL9a4MJNsm8ZaK1X48'; // truncated for security in this preview
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Header HTML
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
  <div id="profile-greeting-inject"></div>
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
<header id="ww-header-bar">
  <a href="index.html" class="logo-title">Wealthwise</a>
  <div id="profile-greeting-inject">
    <button id="theme-toggle" type="button" class="theme-toggle-btn" title="Toggle dark/light mode">
<!-- Sun (Light Mode) -->
<svg id="theme-sun" class="d-none" style="width:1.7em;height:1.7em;vertical-align:middle;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="5" stroke="currentColor" fill="none"/>
  <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42"/>
</svg>

<!-- Moon (Dark Mode) -->
<svg id="theme-moon" class="d-none" style="width:1.7em;height:1.7em;vertical-align:middle;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3c.47 0 .94.03 1.41.08a7 7 0 008.3 9.71c.05.47.08.94.08 1.41z"/>
</svg>

    </button>
    <span id="welcome-text" style="white-space: nowrap; font-size: 1rem;"></span>
    <img id="user-avatar" class="avatar-img" src="" alt="User Avatar" />
  </div>
</header>
`;


// Insert header and footer into the DOM
document.getElementById("ww-header").innerHTML = headerHTML;
document.getElementById("ww-footer").innerHTML = footerHTML;

// Theme Functions
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
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('wealthwise-theme', isDark ? 'dark' : 'light');
  updateThemeIcons();
}
function initThemeToggle() {
  let theme = localStorage.getItem('wealthwise-theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setDarkMode(theme === 'dark');
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(!isDark);
    });
  }
}

// Supabase: Load User Profile (Greeting + Avatar)
async function loadUserProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (!profileError && profile) {
    const welcomeText = document.getElementById('welcome-text');
    const avatarImg = document.getElementById('user-avatar');
    if (welcomeText) welcomeText.textContent = `Welcome, ${profile.display_name}`;
    if (avatarImg && profile.avatar_url) avatarImg.src = profile.avatar_url;
  }
}

// Init everything after DOM loads
function initLayout() {
  initThemeToggle();
  loadUserProfile();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayout);
} else {
  initLayout();
}
