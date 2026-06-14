import { getMetadata, loadBlock } from '../ak.js';

export default async function loadUtilNav() {
  const meta = getMetadata('util-nav');
  if (meta === 'off') return;
  const utilNav = document.createElement('div');
  utilNav.className = 'util-nav';
  document.body.prepend(utilNav);
  document.body.classList.add('has-util-nav');
  await loadBlock(utilNav);
}
