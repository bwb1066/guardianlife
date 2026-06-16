const ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 3.5L21.5 20H2.5L12 3.5Z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="12" y1="10" x2="12" y2="14.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
  <circle cx="12" cy="17" r="0.875" fill="currentColor"/>
</svg>`;

export default function init(block) {
  // All content is authored inside the block's single cell:
  // paragraph (eyebrow) → heading → paragraph (desc) → paragraph with link (CTA)
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  let eyebrowText = null;
  let headingText = null;
  const descTexts = [];
  let ctaHref = null;
  let ctaText = null;
  let headingFound = false;

  for (const el of cell.children) {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent.trim();
    if (!text) continue;

    if (/^h[1-6]$/.test(tag)) {
      if (!headingFound) {
        headingFound = true;
        headingText = text;
      }
    } else if (tag === 'p') {
      const a = el.querySelector('a');
      if (!headingFound) {
        eyebrowText = text; // paragraph before heading = eyebrow
      } else if (a) {
        if (!ctaHref) { ctaHref = a.href; ctaText = a.textContent.trim(); }
      } else {
        descTexts.push(text);
      }
    }
  }

  // Rebuild block contents
  block.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'w-card';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'w-eyebrow';
    eyebrow.textContent = eyebrowText;
    card.append(eyebrow);
  }

  const main = document.createElement('div');
  main.className = 'w-main';

  const iconEl = document.createElement('div');
  iconEl.className = 'w-icon';
  iconEl.innerHTML = ICON_SVG;
  main.append(iconEl);

  const body = document.createElement('div');
  body.className = 'w-body';

  if (headingText) {
    const h = document.createElement('p');
    h.className = 'w-heading';
    h.textContent = headingText;
    body.append(h);
  }

  for (const text of descTexts) {
    const p = document.createElement('p');
    p.className = 'w-desc';
    p.textContent = text;
    body.append(p);
  }

  main.append(body);

  if (ctaHref) {
    const cta = document.createElement('div');
    cta.className = 'w-cta';
    const btn = document.createElement('a');
    btn.href = ctaHref;
    btn.className = 'w-btn';
    btn.innerHTML = `${ctaText} <span aria-hidden="true">→</span>`;
    cta.append(btn);
    main.append(cta);
  }

  card.append(main);
  block.append(card);
}
