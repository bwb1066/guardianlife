export default function init(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const headerCell = rows[0]?.querySelector(':scope > div') ?? rows[0];
  const bodyCell = rows[1]?.querySelector(':scope > div') ?? rows[1];

  // Title row: heading may contain <br> separating title from reference number
  const titleEl = headerCell?.querySelector('h1, h2, h3, h4, h5, h6');
  let titleText = 'Disclaimer';
  let subtitleText = null;

  if (titleEl) {
    const brIdx = [...titleEl.childNodes].findIndex((n) => n.nodeName === 'BR');
    if (brIdx > -1) {
      const nodes = [...titleEl.childNodes];
      titleText = nodes.slice(0, brIdx).map((n) => n.textContent).join('').trim() || 'Disclaimer';
      subtitleText = nodes.slice(brIdx + 1).map((n) => n.textContent).join('').trim() || null;
    } else {
      titleText = titleEl.textContent.trim() || 'Disclaimer';
      subtitleText = headerCell.querySelector('p')?.textContent.trim() ?? null;
    }
  } else {
    subtitleText = headerCell?.querySelector('p')?.textContent.trim() ?? null;
  }

  // Clone body paragraphs before wiping
  const bodyParas = bodyCell
    ? [...bodyCell.querySelectorAll('p')].map((p) => {
        const clone = document.createElement('p');
        clone.textContent = p.textContent.trim();
        return clone;
      })
    : [];

  block.innerHTML = '';

  // Header (always visible, acts as toggle)
  const header = document.createElement('div');
  header.className = 'disc-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.tabIndex = 0;

  const titleWrap = document.createElement('div');
  titleWrap.className = 'disc-title';

  const titleP = document.createElement('p');
  titleP.className = 'disc-title-main';
  titleP.textContent = titleText;
  titleWrap.append(titleP);

  if (subtitleText) {
    const sub = document.createElement('p');
    sub.className = 'disc-title-sub';
    sub.textContent = subtitleText;
    titleWrap.append(sub);
  }

  const chevron = document.createElement('span');
  chevron.className = 'disc-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  header.append(titleWrap, chevron);

  // Body (hidden by default — collapsed)
  const body = document.createElement('div');
  body.className = 'disc-body';
  body.hidden = true;
  body.append(...bodyParas);

  block.append(header, body);

  // Toggle
  function toggle() {
    const isOpen = !body.hidden;
    body.hidden = isOpen;
    header.setAttribute('aria-expanded', String(!isOpen));
    chevron.classList.toggle('is-open', !isOpen);
  }

  header.addEventListener('click', toggle);
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
}
