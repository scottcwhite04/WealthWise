// layout.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://anwwjqupywbnwanuckdf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3dqcXVweXdibndhbnVja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzgxOTksImV4cCI6MjA2NTAxNDE5OX0.ExlSkJTP3mJ9u-7SVws0FYcNvlL9a4MJNsm8ZaK1X48';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Header HTML & CSS (now includes theme toggle, greeting, and avatar)
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
    background: #fff;
    color: #3157a1;
    border-radius: 9999px;
    padding: 0.45em 0.85em;
    font-size: 1.1em;
    border: 1px solid #e2e9f3;
    cursor: pointer;
    margin-right: 0.5rem;
    margin-left: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    transition: background 0.18s, color 0.18s;
  }
  .theme-toggle-btn:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
  .greeting-text {
    font-weight: 600;
    font-size: 1rem;
    color: #f3c96b;
    max-width: 120px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ww-avatar-btn {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    flex-shrink: 0;
    margin-left: 0.25rem;
    border-radius: 9999px;
    border: 2px solid #f3c96b;
    background: #fff;
    padding: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border 0.18s;
    box-sizing: border-box;
  }
  .ww-avatar-btn img {
    border-radius: 9999px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    background: #f3f6fa;
    display: block;
  }
  .ww-avatar-btn:focus,
  .ww-avatar-btn:hover {
    border-color: #ffd600;
  }
  @media (max-width: 600px) {
    .greeting-text {
      display: none;
    }
    .ww-avatar-btn {
      margin-left: 0;
    }
  }
</style>
<header id="ww-header-bar">
  <a href="index.html" class="logo-title" style="font-family:'Montserrat',Arial,sans-serif;">Wealthwise</a>
  <div id="profile-greeting-inject">
    <button id="theme-toggle" class="theme-toggle-btn" title="Toggle dark/light mode">
      <span id="theme-toggle-icon-light" style="display:inline;">🌞</span>
      <span id="theme-toggle-icon-dark" style="display:none;">🌙</span>
    </button>
    <span class="greeting-text" id="header-greeting">Hello!</span>
    <button id="header-avatar-btn" class="ww-avatar-btn" title="Profile">
      <img id="header-avatar-img" src="https://ui-avatars.com/api/?name=W+User&background=2563eb&color=fff" alt="User avatar">
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

// Theme toggle functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const iconLight = document.getElementById('theme-toggle-icon-light');
const iconDark = document.getElementById('theme-toggle-icon-dark');
function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    iconLight.style.display = "none";
    iconDark.style.display = "inline";
  } else {
    iconLight.style.display = "inline";
    iconDark.style.display = "none";
  }
}
if (themeToggleBtn) {
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
    updateThemeIcon();
  });
  // Set initial icon
  updateThemeIcon();
}

// User greeting and avatar logic using Supabase
async function setHeaderGreetingAndAvatar() {
  let name = "User";
  let avatarUrl = "https://ui-avatars.com/api/?name=W+User&background=2563eb&color=fff";
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
      if (name && name.includes('@')) name = name.split('@')[0];
      if (user.user_metadata?.avatar_url) {
        avatarUrl = user.user_metadata.avatar_url;
      } else {
        // fallback to initials
        const initials = name.split(/\s+/).map(word => word[0]).join('+').substring(0,2);
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff`;
      }
    }
  } catch (e) {
    // fallback, already set above
  }
  document.getElementById('header-greeting').textContent = `Hello, ${name}!`;
  document.getElementById('header-avatar-img').src = avatarUrl;
}
setHeaderGreetingAndAvatar();
