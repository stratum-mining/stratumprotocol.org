const HEADING_ANCHOR_ICON = `
  <svg class="octicon octicon-link" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
  </svg>
`;

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugifyBase(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function createSlugger() {
  const seen = new Map();
  return {
    slug(text) {
      let base = slugifyBase(text);
      if (!base) base = 'section';

      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return count === 0 ? base : `${base}-${count}`;
    }
  };
}

export function renderHeadingWithAnchor({ depth, id, html, text, className = '' }) {
  const safeId = escapeHtml(id);
  const label = text ? `Copy link to "${text}"` : 'Copy link to this section';
  const classAttr = className ? ` class="${escapeHtml(className)}"` : '';

  return `<h${depth} id="${safeId}"${classAttr}>${html} <a class="heading-anchor" href="#${safeId}" aria-label="${escapeHtml(label)}" title="Copy link">${HEADING_ANCHOR_ICON}</a></h${depth}>\n`;
}
