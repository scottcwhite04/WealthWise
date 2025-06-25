// layout.js

// Header HTML & CSS
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

// Insert header and footer into the DOM
document.getElementById("ww-header").innerHTML = headerHTML;
document.getElementById("ww-footer").innerHTML = footerHTML;

// Set return link for terms
const termsLink = document.getElementById("footer-terms-link");
if (termsLink) {
  termsLink.href = '/terms-of-service.html?return=' + encodeURIComponent(window.location.href);
}