export default function init(block) {
  const section = block.closest('.section');
  const defaultContent = section?.querySelector('.default-content');

  // Decorate headings by position (not level) so any heading level works
  if (defaultContent) {
    const headings = [...defaultContent.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    if (headings.length >= 2) {
      headings[0].className = 'lc-eyebrow';
      headings[headings.length - 1].className = 'lc-main-heading';
    } else if (headings.length === 1) {
      headings[0].className = 'lc-main-heading';
    }
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Find CTA: check first no-picture row in block, then fall back to defaultContent
  let ctaLink = null;
  let ctaSourceP = null;
  let cardRows = rows;

  if (!rows[0].querySelector('picture')) {
    const firstCell = rows[0].querySelector(':scope > div');
    ctaLink = firstCell?.querySelector('a') ?? rows[0].querySelector('a');
    if (ctaLink) cardRows = rows.slice(1);
  }
  if (!ctaLink && defaultContent) {
    for (const p of defaultContent.querySelectorAll('p')) {
      const a = p.querySelector('a');
      if (a) { ctaLink = a; ctaSourceP = p; break; }
    }
  }

  const cardData = parseCards(cardRows);

  block.innerHTML = '';

  // Place CTA button (in defaultContent, beside the heading)
  if (ctaLink) {
    ctaLink.className = 'lc-visit-btn';
    const ctaRow = document.createElement('div');
    ctaRow.className = 'lc-cta-row';
    ctaRow.append(ctaLink);
    if (defaultContent) {
      if (ctaSourceP && defaultContent.contains(ctaSourceP)) {
        defaultContent.replaceChild(ctaRow, ctaSourceP);
      } else {
        defaultContent.append(ctaRow);
      }
    } else {
      block.prepend(ctaRow);
    }
  }

  const grid = document.createElement('div');
  grid.className = 'lc-cards';
  cardData.forEach((data, idx) => grid.append(buildCard(data, idx === 0)));
  block.append(grid);
}

// ----- Parsing -----

function parseCards(rows) {
  // Nested format: DA authored as 1 outer row with left cell (featured) + right cell (minis)
  if (rows.length === 1) {
    const cells = [...rows[0].querySelectorAll(':scope > div')];
    if (cells.length >= 2 && cells.some((c) => c.querySelector('picture'))) {
      const [left, right] = cells;
      return [extractCardFromArea(left), ...extractMiniCards(right)];
    }
  }
  // Flat format: each row is a separate card
  return rows.flatMap((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells[0]?.querySelector('picture')) return [];
    const pic = cells[0].querySelector('picture');
    const paras = cells[1] ? [...cells[1].querySelectorAll('p')] : [];
    return [{ pic, ...parseLinks(paras) }];
  });
}

// Extract one card from a container (e.g., left cell of nested layout)
// Only uses paragraphs that appear AFTER the picture (skips any header label above it)
function extractCardFromArea(el) {
  const pic = el.querySelector('picture');
  const allParas = [...el.querySelectorAll('p')];
  const paras = pic
    ? allParas.filter((p) => pic.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)
    : allParas;
  return { pic, ...parseLinks(paras) };
}

// Extract multiple mini cards from the right cell, split by picture boundaries
function extractMiniCards(el) {
  const pics = [...el.querySelectorAll('picture')];
  const allParas = [...el.querySelectorAll('p')];
  return pics.map((pic, i) => {
    const nextPic = pics[i + 1];
    const paras = allParas.filter((p) => {
      const afterThis = pic.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING;
      const beforeNext = !nextPic || (nextPic.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING);
      return afterThis && beforeNext;
    });
    return { pic, ...parseLinks(paras) };
  });
}

// Categorise paragraphs into title / desc / cta regardless of bold/link structure.
// Rules: first non-CTA link text = title, next = desc, "Learn more" / "Read more" = CTA.
function parseLinks(paras) {
  let title = null;
  let desc = null;
  let cta = null;
  for (const p of paras) {
    const pText = p.textContent.trim();
    if (!pText) continue;
    const a = p.querySelector('a');
    if (a) {
      const aText = a.textContent.trim();
      if (/^(learn|read) more$/i.test(aText)) {
        cta = { href: a.href, text: aText };
      } else if (!title) {
        title = aText;
      } else if (!desc) {
        desc = pText;
      }
    } else if (title && !desc) {
      desc = pText;
    }
    // Non-link paragraphs before any title are header labels — ignored
  }
  return { title, desc, cta };
}

// ----- DOM building -----

function buildCard({ pic, title, desc, cta }, isFeatured) {
  const card = document.createElement('div');
  card.className = `lc-card ${isFeatured ? 'lc-featured' : 'lc-mini'}`;

  if (pic) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'lc-card-img';
    imgWrap.append(pic);
    card.append(imgWrap);
  }

  const body = document.createElement('div');
  body.className = 'lc-card-body';

  if (title) {
    const el = document.createElement('p');
    el.className = 'lc-card-title';
    el.textContent = title;
    body.append(el);
  }
  if (desc) {
    const el = document.createElement('p');
    el.className = 'lc-card-desc';
    el.textContent = desc;
    body.append(el);
  }
  if (cta) {
    const el = document.createElement('p');
    el.className = 'lc-card-cta';
    const link = document.createElement('a');
    link.href = cta.href;
    link.innerHTML = `${cta.text} <span aria-hidden="true">→</span>`;
    el.append(link);
    body.append(el);
  }

  card.append(body);
  return card;
}
