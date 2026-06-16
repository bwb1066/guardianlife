function setBackgroundFocus(img) {
  const { title } = img.dataset;
  if (!title?.includes('data-focal')) return;
  delete img.dataset.title;
  const [x, y] = title.split(':')[1].split(',');
  img.style.objectPosition = `${x}% ${y}%`;
}

function decorateBackground(bg) {
  const bgPic = bg.querySelector('picture');
  if (!bgPic) return;

  const img = bgPic.querySelector('img');
  setBackgroundFocus(img);

  const vidLink = bgPic.closest('a[href*=".mp4"]');
  if (!vidLink) return;
  const video = document.createElement('video');
  video.src = vidLink.href;
  video.loop = true;
  video.muted = true;
  video.inert = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'none');
  video.load();
  video.addEventListener('canplay', () => {
    video.play();
    bgPic.remove();
  });
  vidLink.parentElement.append(video, bgPic);
  vidLink.remove();
}

function decorateForeground(fg) {
  const { children } = fg;
  for (const [idx, child] of [...children].entries()) {
    const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
    const text = heading || child.querySelector('p, a, ul');
    if (heading) {
      heading.classList.add('hero-heading');
      const detail = heading.previousElementSibling;
      if (detail) {
        detail.classList.add('hero-detail');
      }
      const afterHeading = heading.nextElementSibling;
      if (afterHeading?.querySelector('picture, img')) {
        afterHeading.classList.add('hero-brush');
      }
    }
    // Determine foreground column types
    if (text) {
      child.classList.add('fg-text');
      if (idx === 0) {
        child.closest('.hero').classList.add('hero-text-start');
      } else {
        child.closest('.hero').classList.add('hero-text-end');
      }
    }
  }
}

function decorateTabs(tabsEl) {
  tabsEl.classList.add('hero-tabs');
  const inner = tabsEl.querySelector(':scope > div') ?? tabsEl;
  const label = inner.querySelector('p:first-child');
  if (label && !label.querySelector('a')) label.classList.add('tabs-label');

  // Mobile toggle button (orange circle with up-arrow)
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'tabs-toggle-btn';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-label', 'Open audience selector');
  toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  inner.append(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    const isOpen = tabsEl.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close audience selector' : 'Open audience selector');
  });
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // Detect audience tabs: last row has links but no image/video
  let tabsRow = null;
  if (rows.length >= 3) {
    const last = rows[rows.length - 1];
    if (last.querySelector('a') && !last.querySelector('picture, video')) {
      tabsRow = rows.pop();
    }
  }

  const fg = rows.pop();
  fg.classList.add('hero-foreground');
  decorateForeground(fg);

  if (rows.length) {
    const bg = rows.pop();
    bg.classList.add('hero-background');
    decorateBackground(bg);
  }

  if (tabsRow) decorateTabs(tabsRow);

  // Full-height and bleed: apply when hero is the page's first block
  const mainEl = document.querySelector('main');
  const sections = mainEl ? [...mainEl.children] : [];
  const isFirst = sections.length > 0 && sections[0].contains(el);
  if (isFirst) {
    const section = sections[0];
    section.classList.add('hero-bleed');
    el.style.setProperty('--min-height', '100vh');

    const headerEl = document.querySelector('header');
    if (headerEl) {
      headerEl.classList.add('over-hero');
      const toggleHeader = () => {
        headerEl.classList.toggle('over-hero', section.getBoundingClientRect().bottom > 0);
      };
      window.addEventListener('scroll', toggleHeader, { passive: true });
    }
  }
}
