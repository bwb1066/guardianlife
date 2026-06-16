import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';
import { setColorScheme } from '../section-metadata/section-metadata.js';

const { locale } = getConfig();

const HEADER_PATH = '/fragments/nav/header';
const HEADER_ACTIONS = [
  '/tools/widgets/scheme',
  '/tools/widgets/language',
  '/tools/widgets/toggle',
];

function closeAllMenus() {
  const openMenus = document.body.querySelectorAll('header .is-open');
  for (const openMenu of openMenus) {
    openMenu.classList.remove('is-open');
  }
}

function docClose(e) {
  if (e.target.closest('header')) return;
  closeAllMenus();
}

function toggleMenu(menu) {
  const isOpen = menu.classList.contains('is-open');
  closeAllMenus();
  if (isOpen) {
    document.removeEventListener('click', docClose);
    return;
  }

  // Setup the global close event
  document.addEventListener('click', docClose);
  menu.classList.add('is-open');
}

function decorateLanguage(btn) {
  const section = btn.closest('.section');
  btn.addEventListener('click', async () => {
    let menu = section.querySelector('.language.menu');
    if (!menu) {
      const content = document.createElement('div');
      content.classList.add('block-content');
      const fragment = await loadFragment(`${locale.prefix}${HEADER_PATH}/languages`);
      menu = document.createElement('div');
      menu.className = 'language menu';
      menu.append(fragment);
      content.append(menu);
      section.append(content);
    }
    toggleMenu(section);
  });
}

function decorateScheme(btn) {
  btn.addEventListener('click', async () => {
    const { body } = document;

    let currPref = localStorage.getItem('color-scheme');
    if (!currPref) {
      currPref = matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark-scheme' : 'light-scheme';
    }

    const theme = currPref === 'dark-scheme'
      ? { add: 'light-scheme', remove: 'dark-scheme' }
      : { add: 'dark-scheme', remove: 'light-scheme' };

    body.classList.remove(theme.remove);
    body.classList.add(theme.add);
    localStorage.setItem('color-scheme', theme.add);
    // Re-calculatie section schemes
    const sections = document.querySelectorAll('.section');
    for (const section of sections) {
      setColorScheme(section);
    }
  });
}

function searchSVG() {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
}

function decorateSearch(actionsSection) {
  const wrapper = document.createElement('div');
  wrapper.className = 'action-wrapper search';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open search');
  btn.innerHTML = `<span class="icon">${searchSVG()}</span><span class="text">Search</span>`;
  wrapper.append(btn);
  const content = actionsSection.querySelector('.default-content');
  if (content) content.prepend(wrapper);

  const popup = document.createElement('div');
  popup.className = 'search-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', 'Search');
  popup.setAttribute('aria-hidden', 'true');
  popup.innerHTML = `<div class="search-popup-inner">
    <button class="search-popup-close" aria-label="Close search">&times;</button>
    <p class="search-popup-title" id="search-popup-title">Search Guardianlife.com</p>
    <div class="search-popup-row">
      <span class="search-popup-icon">${searchSVG()}</span>
      <input type="search" placeholder="Search" aria-label="Search Guardianlife.com" aria-labelledby="search-popup-title">
    </div>
  </div>`;
  document.body.append(popup);

  const openPopup = () => {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    popup.querySelector('input').focus();
  };
  const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
  };

  btn.addEventListener('click', () => {
    popup.classList.contains('is-open') ? closePopup() : openPopup();
  });
  popup.querySelector('.search-popup-close').addEventListener('click', closePopup);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });
  document.addEventListener('click', (e) => {
    if (popup.classList.contains('is-open') && !popup.contains(e.target) && !wrapper.contains(e.target)) closePopup();
  });
}

function decorateMobilePanel(section) {
  const panel = document.createElement('div');
  panel.className = 'mobile-nav-panel';
  panel.innerHTML = `
    <div class="mnp-search">
      <p class="mnp-search-title">Search Guardianlife.com</p>
      <div class="mnp-search-row">
        <span class="mnp-search-icon" aria-hidden="true">${searchSVG()}</span>
        <input type="search" placeholder="Search" aria-label="Search Guardianlife.com">
      </div>
    </div>
    <div class="mnp-quicklinks">
      <p class="mnp-ql-title">What are you looking for?</p>
      <ul>
        <li><a href="/find-a-dentist">Find a dentist</a></li>
        <li><a href="/find-a-vision-provider">Find a vision provider</a></li>
        <li><a href="/find-a-financial-professional">Find a financial professional</a></li>
        <li><a href="/forms-and-claims">Forms and claims</a></li>
        <li><a href="/contact-us">Contact us</a></li>
      </ul>
    </div>
    <div class="mnp-phone">
      <p>Need help? Call us:</p>
      <a href="tel:+18884827342">(888) 482-7342</a>
    </div>
  `;
  section.append(panel);
}

function decorateNavToggle(btn) {
  btn.addEventListener('click', () => {
    const header = document.body.querySelector('header');
    if (header) header.classList.toggle('is-mobile-open');
  });
}

async function decorateAction(header, pattern) {
  const link = header.querySelector(`[href*="${pattern}"]`);
  if (!link) return;

  const icon = link.querySelector('.icon');
  const text = link.textContent;
  const btn = document.createElement('button');
  if (icon) btn.append(icon);
  if (text) {
    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;
    btn.append(textSpan);
  }
  const wrapper = document.createElement('div');
  wrapper.className = `action-wrapper ${icon.classList[1].replace('icon-', '')}`;
  wrapper.append(btn);
  link.parentElement.parentElement.replaceChild(wrapper, link.parentElement);

  if (pattern === '/tools/widgets/language') decorateLanguage(btn);
  if (pattern === '/tools/widgets/scheme') decorateScheme(btn);
  if (pattern === '/tools/widgets/toggle') decorateNavToggle(btn);
}

function cleanEmptyParas(section) {
  for (const p of [...section.querySelectorAll('.default-content > p')]) {
    if (!p.textContent.trim()) p.remove();
  }
}

function decorateMenu(li) {
  const section = li.querySelector(':scope > .section');
  if (!section) return null;
  cleanEmptyParas(section);
  const wrapper = document.createElement('div');
  wrapper.className = 'menu';
  wrapper.append(section);
  li.append(wrapper);
  return wrapper;
}

function decorateMegaMenu(li) {
  const menu = li.querySelector('.fragment-content');
  if (!menu) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'mega-menu';
  const sections = [...menu.querySelectorAll(':scope > .section')];
  for (const s of sections) {
    cleanEmptyParas(s);
    // Mobile: first paragraph in each section becomes a collapsible sub-category toggle
    const label = s.querySelector('.default-content > p:first-child');
    if (label) {
      label.classList.add('sub-nav-label');
      label.setAttribute('role', 'button');
      label.tabIndex = 0;
      label.addEventListener('click', () => s.classList.toggle('is-sub-open'));
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.classList.toggle('is-sub-open'); }
      });
    }
  }
  let cols = sections.length || 1;

  // First section with > 8 links gets 2 CSS columns and spans 2 grid tracks
  const first = sections[0];
  if (first && first.querySelectorAll('li').length > 8) {
    first.classList.add('double-col');
    cols += 1;
  }

  wrapper.style.setProperty('--mega-columns', cols);
  wrapper.append(menu);
  li.append(wrapper);
  return wrapper;
}

function decorateNavItem(li) {
  li.classList.add('main-nav-item');
  const link = li.querySelector(':scope > p > a');
  if (link) link.classList.add('main-nav-link');
  const menu = decorateMegaMenu(li) || decorateMenu(li);
  if (!(menu || link)) return;
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu(li);
    });
  } else {
    const label = li.querySelector(':scope > p');
    if (label) {
      label.classList.add('main-nav-link');
      label.setAttribute('role', 'button');
      label.tabIndex = 0;
      label.addEventListener('click', () => toggleMenu(li));
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(li); }
      });
    }
  }
}

function decorateBrandSection(section) {
  section.classList.add('brand-section');
  const brandLink = section.querySelector('a');
  if (!brandLink) return;

  // Light logo: picture already inside the link
  const lightPic = brandLink.querySelector('picture');
  if (lightPic) lightPic.classList.add('logo-light');

  // Wrap text node (brand name) before appending dark logo so childNodes stay stable
  const [, textNode] = brandLink.childNodes;
  if (textNode?.nodeType === Node.TEXT_NODE) {
    const span = document.createElement('span');
    span.className = 'brand-text';
    span.append(textNode);
    brandLink.append(span);
  }

  // Dark logo: picture sibling outside the link (DA puts it after a <br>)
  const para = brandLink.closest('p') || brandLink.parentElement;
  if (para) {
    const darkPic = [...para.querySelectorAll('picture')].find((p) => !brandLink.contains(p));
    if (darkPic) {
      darkPic.classList.add('logo-dark');
      brandLink.append(darkPic);
      para.querySelectorAll('br').forEach((br) => br.remove());
    }
  }

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'hamburger-btn';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = '<svg viewBox="0 0 24 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="2" rx="1"/><rect y="8" width="24" height="2" rx="1"/><rect y="16" width="24" height="2" rx="1"/></svg>';
  hamburger.addEventListener('click', () => {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('is-mobile-open');
  });
  section.querySelector('.default-content')?.append(hamburger);
}

function decorateNavSection(section) {
  section.classList.add('main-nav-section');
  const navContent = section.querySelector('.default-content');
  const navList = section.querySelector('ul');
  if (!navList) return;
  navList.classList.add('main-nav-list');

  const nav = document.createElement('nav');
  nav.append(navList);
  navContent.append(nav);

  const mainNavItems = section.querySelectorAll('nav > ul > li');
  for (const navItem of mainNavItems) {
    decorateNavItem(navItem);
  }

  decorateMobilePanel(section);
}

function decorateLogin(section) {
  const link = document.createElement('a');
  link.href = '/login';
  link.className = 'login-btn';
  link.textContent = 'Log in';
  const content = section.querySelector('.default-content');
  if (content) content.append(link);
}

function decorateConcierge(section) {
  const url = getMetadata('concierge-url');
  const key = getMetadata('concierge-key');
  const site = getMetadata('concierge-site');
  if (!url || !key || !site) return;

  const WIDGET_URL = 'https://bwb1066.github.io/brand-chat-config-ui/widget/brand-concierge.js';
  const WIDGET_BASE = WIDGET_URL.replace(/[^/]+$/, '');
  let chatModule = null;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'concierge-btn';
  btn.setAttribute('aria-label', 'Ask the AI Concierge');
  btn.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"'
    + ' width="22" height="22" fill="none" stroke="currentColor"'
    + ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962'
    + 'L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0'
    + 'L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964'
    + 'L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
    + '<path d="M20 3v4"/><path d="M22 5h-4"/>'
    + '<path d="M4 17v2"/><path d="M5 18H3"/></svg>';

  btn.addEventListener('click', async () => {
    if (!chatModule) {
      chatModule = await import(WIDGET_URL);
      chatModule.init({
        supabaseUrl: url,
        anonKey: key,
        siteKey: site,
        showTrigger: false,
        widgetBase: WIDGET_BASE,
      });
    }
    chatModule.default();
  });

  const content = section.querySelector('.default-content');
  if (content) content.prepend(btn);
}

async function decorateActionSection(section) {
  section.classList.add('actions-section');
  decorateConcierge(section);
  decorateSearch(section);
  decorateLogin(section);
}

async function decorateHeader(fragment) {
  const sections = fragment.querySelectorAll(':scope > .section');
  if (sections[0]) decorateBrandSection(sections[0]);
  if (sections[1]) decorateNavSection(sections[1]);
  if (sections[2]) decorateActionSection(sections[2]);

  for (const pattern of HEADER_ACTIONS) {
    decorateAction(fragment, pattern);
  }
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  // Skip-to-content link — must be first focusable element on page
  const skip = document.createElement('a');
  skip.href = '#main-content';
  skip.className = 'skip-to-content';
  skip.textContent = 'Skip to main content';
  el.before(skip);
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main-content';

  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    fragment.classList.add('header-content');
    await decorateHeader(fragment);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }

  const updateScrolled = () => {
    document.body.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();
}
