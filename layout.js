// Supabase Init
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://anwwjqupywbnwanuckdf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // truncated for security in this preview
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
  .logo-title {
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
    gap: 0.75rem;
    padding-right: 10px;
  }
  .theme-toggle-btn {
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
  .avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f3c96b;
  }
  .d-none { display: none !important; }
  .d-inline { display: inline !important; }
</style>
<header id="ww-header-bar">
  <a href="index.html" class="logo-title">Wealthwise</a>
  <div id="profile-greeting-inject">
    <button id="theme-toggle" type="button" class="theme-toggle-btn" title="Toggle dark/light mode">
      <!-- Sun Icon -->
      <svg id="theme-sun" class="d-none" style="width:1.7em;height:1.7em;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" stroke="currentColor" fill="none"/>
        <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42"/>
      </svg>
      <!-- Moon Icon -->
      <svg id="theme-moon" class="d-none" style="width:1.7em;height:1.7em;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3c.47 0 .94.03 1.41.08a7 7 0 008.3 9.71c.05.47.08.94.08 1.41z"/>
      </svg>
    </button>
    <span id="welcome-text" style="white-space: nowrap; font-size: 1rem;"></span>
    <img id="user-avatar" class="avatar-img" src="" alt="User Avatar" />
  </div>
</header>
`;

// Footer HTML remains unchanged
const footerHTML = `...`; // (your existing footer code)

// Insert header and footer into the DOM
document.getElementById("ww-header").innerHTML = headerHTML;
document.getElementById("ww-footer").innerHTML = footerHTML;

// Terms link return logic
const termsLink = document.getElementById("footer-terms-link");
if (termsLink) {
  termsLink.href = '/terms-of-service.html?return=' + encodeURIComponent(window.location.href);
}

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
