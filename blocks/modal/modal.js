import { getConfig, loadStyle } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

export async function createModal(contentNodes) {
  const { codeBase } = getConfig();
  await loadStyle(`${codeBase}/blocks/modal/modal.css`);

  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);
  dialog.append(dialogContent);

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.prepend(closeButton);

  const wrapper = document.createElement('div');
  wrapper.className = 'modal block';
  document.body.append(wrapper);

  dialog.addEventListener('click', (e) => {
    const {
      left, right, top, bottom,
    } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    wrapper.remove();
  });

  wrapper.append(dialog);

  return {
    block: wrapper,
    showModal: () => {
      dialog.showModal();
      setTimeout(() => { dialogContent.scrollTop = 0; }, 0);
      document.body.classList.add('modal-open');
    },
  };
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;
  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes);
  showModal();
}
