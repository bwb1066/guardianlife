export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // Build card elements from rows
  const cards = rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const card = document.createElement('div');
    card.className = 'ac-card';

    const pic = cells[0]?.querySelector('picture');
    if (pic) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'ac-card-img';
      imgWrap.append(pic);
      card.append(imgWrap);
    }

    if (cells[1]) {
      const body = document.createElement('div');
      body.className = 'ac-card-body';

      const titleEl = cells[1].querySelector('strong');
      if (titleEl) {
        const title = document.createElement('p');
        title.className = 'ac-card-title';
        title.textContent = titleEl.textContent.trim();
        body.append(title);
      }

      // Collect description: text nodes and non-strong/non-br elements after the strong
      const descParts = [];
      for (const node of cells[1].childNodes) {
        if (node === titleEl) continue;
        if (node.nodeName === 'BR') continue;
        const text = node.textContent?.trim();
        if (text) descParts.push(text);
      }
      if (descParts.length) {
        const desc = document.createElement('p');
        desc.className = 'ac-card-desc';
        desc.textContent = descParts.join(' ');
        body.append(desc);
      }

      card.append(body);
    }

    return card;
  });

  el.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'ac-wrapper';

  const track = document.createElement('div');
  track.className = 'ac-track';
  cards.forEach((card) => track.append(card));
  wrapper.append(track);
  el.append(wrapper);

  if (cards.length <= 1) return;

  // Navigation
  const nav = document.createElement('div');
  nav.className = 'ac-nav';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'ac-btn ac-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'ac-btn ac-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  nav.append(prevBtn, nextBtn);
  el.append(nav);

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
