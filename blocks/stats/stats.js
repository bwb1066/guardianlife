export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  el.innerHTML = '';

  for (const row of rows) {
    const cells = [...row.querySelectorAll(':scope > div')];
    const value = cells[0]?.textContent?.trim() ?? '';
    const desc = cells[1]?.textContent?.trim() ?? '';

    const card = document.createElement('div');
    card.className = 'stat-card';

    const valueEl = document.createElement('p');
    valueEl.className = 'stat-value';
    valueEl.textContent = value;

    const descEl = document.createElement('p');
    descEl.className = 'stat-desc';
    descEl.textContent = desc;

    card.append(valueEl, descEl);
    el.append(card);
  }
}
