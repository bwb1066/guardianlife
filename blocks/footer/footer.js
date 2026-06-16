import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/nav/footer';

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/guardianlife/', path: 'M28.571 0C30.43 0 32 1.571 32 3.429V28.57A3.43 3.43 0 0 1 28.571 32h-9.857V21.143h4.143L23.643 16h-4.929v-3.286c0-1.428.715-2.785 2.929-2.785h2.214V5.57s-2-.357-4-.357c-4 0-6.643 2.5-6.643 6.929V16h-4.5v5.143h4.5V32H3.43C1.5 32 0 30.5 0 28.571V3.43A3.43 3.43 0 0 1 3.429 0z' },
  { label: 'Instagram', href: 'https://instagram.com/guardianlife', path: 'M16 12.214c2.071 0 3.786 1.715 3.786 3.786 0 2.143-1.715 3.857-3.786 3.857A3.84 3.84 0 0 1 12.143 16c0-2.071 1.714-3.786 3.857-3.786m8.857-2.928c.643 1.5.5 5.071.5 6.714 0 1.714.143 5.286-.5 6.786-.286.857-1.286 1.785-2.143 2.143-1.5.642-5.071.5-6.714.5-1.714 0-5.286.142-6.786-.5-.857-.358-1.785-1.286-2.143-2.143-.571-1.5-.5-5.072-.5-6.786 0-1.643-.071-5.214.5-6.714.358-.857 1.286-1.857 2.143-2.143 1.5-.643 5.072-.5 6.786-.5 1.643 0 5.214-.143 6.714.5.857.286 1.786 1.286 2.143 2.143M16 21.857c3.214 0 5.857-2.571 5.857-5.786V16c0-3.214-2.643-5.857-5.857-5.857A5.84 5.84 0 0 0 10.143 16c0 3.286 2.571 5.857 5.857 5.857m6.071-10.571a1.356 1.356 0 1 0 0-2.715c-.785 0-1.357.572-1.357 1.358 0 .785.572 1.357 1.357 1.357M28.571 0C30.43 0 32 1.571 32 3.429V28.57A3.43 3.43 0 0 1 28.571 32H3.43C1.5 32 0 30.5 0 28.571V3.43A3.43 3.43 0 0 1 3.429 0zm-1.285 20.714c.143-1.857.143-7.5 0-9.357-.072-1.857-.5-3.5-1.786-4.786-1.357-1.357-3-1.785-4.786-1.857-1.928-.143-7.571-.143-9.428 0-1.857.072-3.5.5-4.786 1.786-1.357 1.357-1.786 3-1.857 4.786-.143 1.928-.143 7.571 0 9.428.071 1.857.5 3.5 1.857 4.786 1.286 1.357 2.929 1.786 4.786 1.857 1.857.143 7.5.143 9.428 0 1.786-.071 3.429-.5 4.786-1.857 1.286-1.286 1.714-2.929 1.786-4.786' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/the-guardian-life-insurance-company-of-america_164085', path: 'M29.714 0C30.93 0 32 1.071 32 2.357v27.357C32 31 30.929 32 29.714 32h-27.5C1 32 0 31 0 29.714V2.357C0 1.071 1 0 2.214 0zM9.643 27.429V12.214H4.929V27.43zM7.286 10.07c1.5 0 2.714-1.214 2.714-2.714S8.786 4.571 7.286 4.571A2.79 2.79 0 0 0 4.5 7.357c0 1.5 1.214 2.714 2.786 2.714M27.429 27.43V19.07c0-4.071-.929-7.285-5.715-7.285-2.285 0-3.857 1.285-4.5 2.5h-.071v-2.072h-4.5V27.43h4.714v-7.5c0-2 .357-3.929 2.857-3.929 2.429 0 2.429 2.286 2.429 4v7.429z' },
  { label: 'X', href: 'https://twitter.com/intent/follow?source=followbutton&variant=1.0&screen_name=guardianlife', path: 'M3 0a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3zm22.793 6-7.414 8.471L27.1 26h-6.829l-5.342-6.993L8.807 26H5.414l7.929-9.064L4.979 6h7l4.835 6.393L22.4 6zm-2.7 17.971L10.957 7.921H8.936l12.271 16.05h1.886' },
  { label: 'YouTube', href: 'https://www.youtube.com/c/guardianlife', path: 'm13.286 12.214 6.857 3.857-6.857 3.858zM32 3.43V28.57A3.43 3.43 0 0 1 28.571 32H3.43C1.5 32 0 30.5 0 28.571V3.43A3.43 3.43 0 0 1 3.429 0H28.57C30.43 0 32 1.571 32 3.429M29 16.07s0-4.285-.571-6.285c-.286-1.143-1.215-2.072-2.286-2.357C24.07 6.857 16 6.857 16 6.857s-8.143 0-10.214.572c-1.072.285-2 1.214-2.286 2.357-.5 2-.5 6.285-.5 6.285s0 4.215.5 6.286c.286 1.143 1.214 2 2.286 2.286 2.071.5 10.214.5 10.214.5s8.071 0 10.143-.5c1.071-.286 2-1.143 2.286-2.286.571-2.071.571-6.286.571-6.286' },
];

function buildSocial() {
  const nav = document.createElement('nav');
  nav.className = 'footer-social';
  nav.setAttribute('aria-label', 'Social media links');
  const ul = document.createElement('ul');
  for (const { label, href, path } of SOCIAL_LINKS) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.setAttribute('aria-label', `${label} (opens in new window)`);
    a.innerHTML = `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;
    li.append(a);
    ul.append(li);
  }
  nav.append(ul);
  return nav;
}

function decorateFooterColumns(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length < 3) return;

  const logoCells = [...rows[0].children];
  const headCells = [...rows[1].children];
  const linkCells = [...rows[2].children];

  const brandCol = document.createElement('div');
  brandCol.className = 'footer-brand';
  if (logoCells[0]) brandCol.append(...[...logoCells[0].childNodes]);
  brandCol.append(buildSocial());

  const navCols = headCells.slice(1).map((hCell, i) => {
    const col = document.createElement('div');
    col.className = 'footer-nav-col';

    const hdg = document.createElement('div');
    hdg.className = 'footer-nav-heading';
    hdg.append(...[...hCell.childNodes]);

    const links = document.createElement('div');
    links.className = 'footer-nav-links';
    if (linkCells[i + 1]) links.append(...[...linkCells[i + 1].childNodes]);

    col.append(hdg, links);
    return col;
  });

  block.innerHTML = '';
  block.append(brandCol, ...navCols);
}

export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    fragment.classList.add('footer-content');

    const sections = [...fragment.querySelectorAll('.section')];

    const copyright = sections.pop();
    copyright.classList.add('section-copyright');

    const legal = sections.pop();
    legal.classList.add('section-legal');

    const columnsBlock = fragment.querySelector('.columns');
    if (columnsBlock) decorateFooterColumns(columnsBlock);

    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
