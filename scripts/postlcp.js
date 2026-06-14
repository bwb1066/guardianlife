import { loadBlock } from './ak.js';
import loadUtilNav from './utils/util-nav.js';

export default async function loadPostLCP() {
  const header = document.querySelector('header');
  await Promise.all([
    loadUtilNav(),
    header ? loadBlock(header) : Promise.resolve(),
  ]);
}
