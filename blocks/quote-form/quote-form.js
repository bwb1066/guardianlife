export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  let photoEl = null;
  let eyebrowText = '';
  let headingText = '';
  let descEl = null;
  const tabItems = [];
  const fields = [];
  let submitLabel = 'Get a quote';

  for (const row of rows) {
    const cells = [...row.querySelectorAll(':scope > div')];
    const type = cells[0]?.textContent?.trim() ?? '';

    if (cells[0]?.querySelector('picture')) {
      photoEl = cells[0].querySelector('picture');
      eyebrowText = cells[1]?.textContent?.trim() ?? '';
    } else if (type === '') {
      const raw = cells[1]?.textContent?.trim() ?? '';
      if (raw.startsWith('## ')) {
        headingText = raw.slice(3);
      } else if (raw) {
        descEl = cells[1];
      }
    } else if (type === 'tabs') {
      for (let i = 1; i < cells.length; i++) {
        const label = cells[i]?.textContent?.trim();
        if (label) tabItems.push(label);
      }
    } else if (type === 'select') {
      fields.push({
        kind: 'select',
        label: cells[1]?.textContent?.trim() ?? '',
        placeholder: cells[2]?.textContent?.trim() ?? 'Select',
        options: (cells[3]?.textContent?.trim() ?? '').split('|').map((o) => o.trim()).filter(Boolean),
      });
    } else if (type === 'text') {
      fields.push({
        kind: 'text',
        label: cells[1]?.textContent?.trim() ?? '',
        placeholder: cells[2]?.textContent?.trim() ?? '',
        prefix: cells[3]?.textContent?.trim() ?? '',
      });
    } else if (type === 'submit') {
      submitLabel = cells[1]?.textContent?.trim() ?? 'Get a quote';
    }
  }

  el.innerHTML = '';

  // Left photo panel
  const photoPanel = document.createElement('div');
  photoPanel.className = 'qf-photo';
  if (photoEl) photoPanel.append(photoEl);
  el.append(photoPanel);

  // Right form panel
  const panel = document.createElement('div');
  panel.className = 'qf-panel';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'qf-eyebrow';
    eyebrow.textContent = eyebrowText;
    panel.append(eyebrow);
  }

  if (headingText) {
    const h2 = document.createElement('h2');
    h2.className = 'qf-heading';
    h2.textContent = headingText;
    panel.append(h2);
  }

  if (descEl) {
    const desc = document.createElement('p');
    desc.className = 'qf-desc';
    desc.innerHTML = descEl.innerHTML;
    panel.append(desc);
  }

  // Tabs
  if (tabItems.length) {
    const tabsWrap = document.createElement('div');
    tabsWrap.className = 'qf-tabs';

    const tabsLabel = document.createElement('p');
    tabsLabel.className = 'qf-tabs-label';
    tabsLabel.textContent = 'Select one';
    tabsWrap.append(tabsLabel);

    const tabsList = document.createElement('div');
    tabsList.className = 'qf-tabs-list';
    tabItems.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qf-tab';
      if (i === 0) btn.classList.add('is-active');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        tabsList.querySelectorAll('.qf-tab').forEach((t) => t.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
      tabsList.append(btn);
    });
    tabsWrap.append(tabsList);
    panel.append(tabsWrap);
  }

  // Required note
  const note = document.createElement('p');
  note.className = 'qf-note';
  note.textContent = 'All fields are required unless marked optional.';
  panel.append(note);

  // Form
  const form = document.createElement('form');
  form.className = 'qf-form';
  form.addEventListener('submit', (e) => e.preventDefault());

  fields.forEach((field, i) => {
    const fieldEl = document.createElement('div');
    fieldEl.className = 'qf-field';

    const fieldId = `qf-${i}-${field.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', fieldId);
    labelEl.textContent = field.label;
    fieldEl.append(labelEl);

    if (field.kind === 'select') {
      const wrap = document.createElement('div');
      wrap.className = 'qf-select-wrap';
      const select = document.createElement('select');
      select.id = fieldId;
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.disabled = true;
      defaultOpt.selected = true;
      defaultOpt.textContent = field.placeholder;
      select.append(defaultOpt);
      field.options.forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.toLowerCase().replace(/\s+/g, '-');
        option.textContent = opt;
        select.append(option);
      });
      wrap.append(select);
      fieldEl.append(wrap);
    } else if (field.kind === 'text') {
      if (field.prefix) {
        const wrap = document.createElement('div');
        wrap.className = 'qf-input-wrap';
        const prefix = document.createElement('span');
        prefix.className = 'qf-prefix';
        prefix.textContent = field.prefix;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = fieldId;
        input.placeholder = field.placeholder;
        wrap.append(prefix, input);
        fieldEl.append(wrap);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = fieldId;
        input.placeholder = field.placeholder;
        fieldEl.append(input);
      }
    }

    form.append(fieldEl);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'qf-submit';
  submitBtn.innerHTML = `${submitLabel} <span aria-hidden="true">→</span>`;
  form.append(submitBtn);

  panel.append(form);
  el.append(panel);
}
