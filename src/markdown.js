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

/**
 * Sanitize raw HTML from markdown, allowing only safe tags used in spec
 * footnotes and references (e.g. <sup>, <a id="..." href="...">).
 * Everything else is stripped.
 */
export function sanitizeSpecHtml(raw) {
  if (!raw || typeof raw !== 'string') return '';

  // Allow <sup> and </sup>
  // Allow <a> with only id and href attributes (for reference anchors)
  // Strip everything else
  return raw.replace(/<\/?[^>]*>/g, (tag) => {
    // Allow </sup>, </a>
    if (/^<\/(?:sup|a)>$/i.test(tag)) return tag;
    // Allow <sup>
    if (/^<sup>$/i.test(tag)) return tag;
    // Allow <a> with safe attributes (id, href) only
    const aMatch = tag.match(/^<a(\s[^>]*)>$/i);
    if (aMatch) {
      const attrs = aMatch[1];
      const parts = [];
      // Extract id attribute
      const idMatch = attrs.match(/\bid\s*=\s*"([^"]+)"/i);
      if (idMatch) parts.push(`id="${escapeHtml(idMatch[1])}"`);
      // Extract href attribute - only allow safe protocols and anchors
      const hrefMatch = attrs.match(/\bhref\s*=\s*"([^"]+)"/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (href.startsWith('#') || href.startsWith('https://') || href.startsWith('http://')) {
          parts.push(`href="${escapeHtml(href)}"`);
        }
      }
      if (parts.length > 0) return `<a ${parts.join(' ')}>`;
      return '';
    }
    // Strip all other tags
    return '';
  });
}

export function renderHeadingWithAnchor({ depth, id, html, text, className = '' }) {
  const safeId = escapeHtml(id);
  const label = text ? `Copy link to "${text}"` : 'Copy link to this section';
  const classAttr = className ? ` class="${escapeHtml(className)}"` : '';

  return `<h${depth} id="${safeId}"${classAttr}>${html} <a class="heading-anchor" href="#${safeId}" aria-label="${escapeHtml(label)}" title="Copy link">${HEADING_ANCHOR_ICON}</a></h${depth}>\n`;
}
