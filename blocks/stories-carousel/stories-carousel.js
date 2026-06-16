export default function init(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const cards = rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const card = document.createElement('div');
    card.className = 'sc-card';

    // --- Image area ---
    const imgArea = document.createElement('div');
    imgArea.className = 'sc-card-img-area';

    const pic = cells[0]?.querySelector('picture');
    if (pic) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'sc-card-img';
      imgWrap.append(pic);
      imgArea.append(imgWrap);
    }

    // Play button (center overlay)
    const play = document.createElement('div');
    play.className = 'sc-play-btn';
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>';
    imgArea.append(play);

    // Name badge: text paragraphs in the image cell (after the picture)
    const badgeLines = [...(cells[0]?.querySelectorAll('p') ?? [])]
      .map((p) => p.textContent.trim())
      .filter(Boolean);

    if (badgeLines.length) {
      const badge = document.createElement('div');
      badge.className = 'sc-badge';
      const [name, ...rest] = badgeLines;
      const nameLine = document.createElement('p');
      nameLine.className = 'sc-badge-name';
      nameLine.textContent = name;
      badge.append(nameLine);
      rest.forEach((line) => {
        const p = document.createElement('p');
        p.className = 'sc-badge-sub';
        p.textContent = line;
        badge.append(p);
      });
      imgArea.append(badge);
    }

    card.append(imgArea);

    // --- Content cell ---
    const contentCell = cells[1];
    if (!contentCell) return card;

    // Transcript link: right-aligned, sits between image and body
    const transcriptAnchor = [...contentCell.querySelectorAll('a')]
      .find((a) => a.textContent.toLowerCase().includes('transcript'));

    if (transcriptAnchor) {
      const tWrap = document.createElement('p');
      tWrap.className = 'sc-transcript';
      const tLink = document.createElement('a');
      tLink.href = transcriptAnchor.href;
      tLink.textContent = transcriptAnchor.textContent.trim();
      tWrap.append(tLink);
      card.append(tWrap);
    }

    const body = document.createElement('div');
    body.className = 'sc-card-body';

    // Title from <strong>
    const strong = contentCell.querySelector('strong');
    if (strong) {
      const title = document.createElement('p');
      title.className = 'sc-card-title';
      title.textContent = strong.textContent.trim();
      body.append(title);
    }

    for (const p of contentCell.querySelectorAll('p')) {
      if (p.querySelector('strong')) continue;
      const a = p.querySelector('a');
      if (a) {
        if (a.textContent.toLowerCase().includes('transcript')) continue;
        const cta = document.createElement('p');
        cta.className = 'sc-card-cta';
        const link = document.createElement('a');
        link.href = a.href;
        link.innerHTML = `${a.textContent.trim()} <span aria-hidden="true">→</span>`;
        cta.append(link);
        body.append(cta);
      } else {
        const text = p.textContent.trim();
        if (text) {
          const desc = document.createElement('p');
          desc.className = 'sc-card-desc';
          desc.textContent = text;
          body.append(desc);
        }
      }
    }

    card.append(body);
    return card;
  });

  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'sc-wrapper';

  const track = document.createElement('div');
  track.className = 'sc-track';
  cards.forEach((c) => track.append(c));
  wrapper.append(track);
  block.append(wrapper);

  if (cards.length <= 1) return;

  const nav = document.createElement('div');
  nav.className = 'sc-nav';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'sc-btn sc-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'sc-btn sc-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  nav.append(prevBtn, nextBtn);
  block.append(nav);

  let current = 0;

  const update = () => {
    current = Math.max(0, Math.min(current, cards.length - 1));
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = current * (card.getBoundingClientRect().width + gap);
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= cards.length - 1;
  };

  prevBtn.addEventListener('click', () => { current -= 1; update(); });
  nextBtn.addEventListener('click', () => { current += 1; update(); });
  window.addEventListener('resize', update, { passive: true });

  update();
}
