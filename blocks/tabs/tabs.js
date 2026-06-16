function toClassName(name) {
  return typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : '';
}

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.setAttribute('tabindex', i === 0 ? '0' : '-1');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => panel.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
        btn.setAttribute('tabindex', '-1');
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
      button.setAttribute('tabindex', '0');
    });
    tablist.append(button);
    tab.remove();
  });

  tablist.addEventListener('keydown', (e) => {
    const allTabs = [...tablist.querySelectorAll('[role="tab"]')];
    const idx = allTabs.indexOf(document.activeElement);
    if (idx === -1) return;
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % allTabs.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + allTabs.length) % allTabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = allTabs.length - 1;
    if (next === -1) return;
    e.preventDefault();
    allTabs[next].focus();
    allTabs[next].click();
  });

  block.prepend(tablist);
}
