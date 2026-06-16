function buildFeaturedCard(content) {
  const link = content.querySelector('a');
  const href = link?.href || '#';
  const pic = content.querySelector('picture');

  const card = document.createElement('a');
  card.href = href;
  card.className = 'product-card product-card-featured';

  if (pic) {
    const thumb = document.createElement('div');
    thumb.className = 'product-card-thumb';
    thumb.append(pic);
    card.append(thumb);
  }

  const body = document.createElement('div');
  body.className = 'product-card-body';

  const titleLink = content.querySelector('strong a');
  if (titleLink) {
    const title = document.createElement('p');
    title.className = 'product-card-title';
    title.textContent = titleLink.textContent.trim();
    body.append(title);
  }

  const allLinks = [...content.querySelectorAll('a')];
  const descLink = allLinks.find((a) => !a.closest('strong'));
  if (descLink) {
    const desc = document.createElement('p');
    desc.className = 'product-card-desc';
    desc.textContent = descLink.textContent.trim();
    body.append(desc);
  }

  const arrow = document.createElement('span');
  arrow.className = 'product-card-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  body.append(arrow);

  card.append(body);
  return card;
}

function buildTextCard(content) {
  const link = content.querySelector('a');
  const href = link?.href || '#';

  const card = document.createElement('a');
  card.href = href;
  card.className = 'product-card product-card-text';

  const title = document.createElement('span');
  title.className = 'product-card-title';
  title.textContent = link?.textContent.trim() || content.textContent.trim();
  card.append(title);

  const arrow = document.createElement('span');
  arrow.className = 'product-card-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  card.append(arrow);

  return card;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  rows.forEach((row, rowIdx) => {
    const tables = [...row.querySelectorAll('table')];
    const grid = document.createElement('div');
    grid.className = `products-row products-row-${rowIdx + 1}`;

    for (const table of tables) {
      const tds = [...table.querySelectorAll('td')];
      if (tds.length < 2) continue;
      const content = tds[1];
      const card = content.querySelector('picture')
        ? buildFeaturedCard(content)
        : buildTextCard(content);
      grid.append(card);
    }

    row.replaceWith(grid);
  });
}
