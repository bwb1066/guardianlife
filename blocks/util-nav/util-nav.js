import { loadFragment } from '../fragment/fragment.js';

const FRAG_PATH = '/fragments/nav/utilities';

export default async function init(el) {
  const fragment = await loadFragment(FRAG_PATH);
  el.append(fragment);
}
