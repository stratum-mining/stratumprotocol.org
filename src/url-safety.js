export const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function hasUnsafePathSegments(path) {
  return String(path || '').split('/').some(segment => segment === '.' || segment === '..');
}

export function normalizeBlogPermalink(rawPermalink, slug) {
  const fallback = `/blog/${slug}/`;
  if (!rawPermalink) return fallback;

  const trimmed = String(rawPermalink).trim();
  if (!trimmed || !trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;

  const [withoutHash] = trimmed.split('#');
  const [pathname] = withoutHash.split('?');
  if (!pathname.startsWith('/blog/')) return fallback;
  if (hasUnsafePathSegments(pathname)) return fallback;

  const segments = pathname.split('/').filter(Boolean);
  if (!segments.every(segment => /^[a-z0-9._~-]+$/i.test(segment))) return fallback;
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

export function sanitizeMarkdownLinkHref(href) {
  if (!href || typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;

  if (value.startsWith('#')) return value;
  if (value.startsWith('/')) {
    if (value.startsWith('//') || hasUnsafePathSegments(value)) return null;
    return value;
  }

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z+.-]*):/);
  if (schemeMatch) {
    const protocol = `${schemeMatch[1].toLowerCase()}:`;
    return SAFE_LINK_PROTOCOLS.has(protocol) ? value : null;
  }

  return hasUnsafePathSegments(value) ? null : value.replace(/^\.\//, '');
}

export function sanitizeMarkdownImageSrc(href) {
  if (!href || typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;

  if (value.startsWith('/')) {
    if (value.startsWith('//') || hasUnsafePathSegments(value)) return null;
    return value;
  }

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z+.-]*):/);
  if (schemeMatch) {
    const protocol = `${schemeMatch[1].toLowerCase()}:`;
    if (protocol === 'http:' || protocol === 'https:') return value;
    if (protocol === 'data:' && /^data:image\//i.test(value)) return value;
    return null;
  }

  return hasUnsafePathSegments(value) ? null : value.replace(/^\.\//, '');
}

export function isExternalHttpHref(href) {
  return /^https?:\/\//i.test(String(href || ''));
}
