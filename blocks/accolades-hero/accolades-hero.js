export default function init(block) {
  // Find the content cell — the one that doesn't contain the image
  const rows = [...block.querySelectorAll(':scope > div')];
  const contentRow = rows.find((r) => !r.querySelector('picture')) ?? rows[1];
  if (!contentRow) return;

  const cell = contentRow.querySelector(':scope > div') ?? contentRow;

  // Decorate headings by position (any level works)
  const headings = [...cell.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const mainHeading = headings[headings.length - 1] ?? null;

  if (headings.length >= 2) headings[0].className = 'ah-eyebrow-h';
  if (mainHeading) mainHeading.className = 'ah-heading';

  // Paragraph before the first heading = eyebrow label
  const firstHeading = headings[0];
  if (firstHeading) {
    let sib = firstHeading.previousElementSibling;
    while (sib) {
      if (sib.tagName === 'P') { sib.className = 'ah-eyebrow'; break; }
      sib = sib.previousElementSibling;
    }
  }

  // Paragraphs after the main heading → desc or CTA
  if (mainHeading) {
    let el = mainHeading.nextElementSibling;
    while (el) {
      if (el.tagName === 'P') {
        const a = el.querySelector('a');
        el.className = a ? 'ah-cta' : 'ah-desc';
        if (a) {
          const arrow = document.createElement('span');
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = ' →';
          a.append(arrow);
        }
      }
      el = el.nextElementSibling;
    }
  }
}
