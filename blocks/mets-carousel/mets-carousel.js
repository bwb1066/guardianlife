export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const cards = rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const card = document.createElement('div');
    card.className = 'mc-card';

    // Image
    const pic = cells[0]?.querySelector('picture');
    if (pic) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'mc-card-img';
      imgWrap.append(pic);
      card.append(imgWrap);
    }

    // Body: title, desc, cta
    const body = document.createElement('div');
    body.className = 'mc-card-body';

    const textCell = cells[1];
    if (textCell) {
      const strong = textCell.querySelector('strong');
      if (strong) {
        const title = document.createElement('p');
        title.className = 'mc-card-title';
        title.textContent = strong.textContent.trim();
        body.append(title);
      }

      // Description: text nodes / non-CTA paragraphs
      const paras = [...textCell.querySelectorAll('p')];
      for (const p of paras) {
        if (p.querySelector('a') && !p.querySelector('strong')) {
          // CTA paragraph
          const cta = document.createElement('p');
          cta.className = 'mc-card-cta';
          const a = p.querySelector('a');
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent.trim();
          link.innerHTML += ' <span aria-hidden="true">→</span>';
          cta.append(link);
          body.append(cta);
        } else {
          // Description: strip strong and br, get plain text
          const descParts = [];
          for (const node of p.childNodes) {
            if (node.nodeName === 'STRONG') continue;
            if (node.nodeName === 'BR') continue;
            const text = node.textContent?.trim();
            if (text) descParts.push(text);
          }
          if (descParts.length) {
            const desc = document.createElement('p');
            desc.className = 'mc-card-desc';
            desc.textContent = descParts.join(' ');
            body.append(desc);
          }
        }
      }
    }

    card.append(body);
    return card;
  });

  el.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'mc-wrapper';

  const track = document.createElement('div');
  track.className = 'mc-track';
  cards.forEach((card) => track.append(card));
  wrapper.append(track);
  el.append(wrapper);

  if (cards.length <= 1) return;

  const nav = document.createElement('div');
  nav.className = 'mc-nav';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'mc-btn mc-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'mc-btn mc-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  nav.append(prevBtn, nextBtn);
  el.append(nav);

  let current = 0;

  const update = () => {
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = current * (card.getBoundingClientRect().width + gap);
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= cards.length - 1;
  };

  prevBtn.addEventListener('click', () => { current -= 1; update(); });
  nextBtn.addEventListener('click', () => { current += 1; update(); });
  window.addEventListener('resize', () => { current = 0; update(); }, { passive: true });

  update();
}
