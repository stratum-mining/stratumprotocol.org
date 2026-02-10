import { marked } from 'marked';
import { escapeHtml, createSlugger, renderHeadingWithAnchor } from './markdown.js';
import { highlightCodeBlocks } from './highlighting.js';
import { SAFE_LINK_PROTOCOLS, hasUnsafePathSegments, isLikelyHtmlResponse } from './url-safety.js';

marked.setOptions({
  gfm: true,
  breaks: false
});

// Spec pages registry - maps URL slugs to actual filenames in submodule
const SPEC_PAGES = [
  { slug: '00-abstract', title: 'Abstract', filename: '00-Abstract.md' },
  { slug: '01-motivation', title: 'Motivation', filename: '01-Motivation.md' },
  { slug: '02-design-goals', title: 'Design Goals', filename: '02-Design-Goals.md' },
  { slug: '03-protocol-overview', title: 'Protocol Overview', filename: '03-Protocol-Overview.md' },
  { slug: '04-protocol-security', title: 'Protocol Security', filename: '04-Protocol-Security.md' },
  { slug: '05-mining-protocol', title: 'Mining Protocol', filename: '05-Mining-Protocol.md' },
  { slug: '06-job-declaration-protocol', title: 'Job Declaration Protocol', filename: '06-Job-Declaration-Protocol.md' },
  { slug: '07-template-distribution-protocol', title: 'Template Distribution Protocol', filename: '07-Template-Distribution-Protocol.md' },
  { slug: '08-message-types', title: 'Message Types', filename: '08-Message-Types.md' },
  { slug: '09-extensions', title: 'Extensions', filename: '09-Extensions.md' },
  { slug: '10-discussion', title: 'Discussion', filename: '10-Discussion.md' }
];

const DEFAULT_SPEC_SLUG = SPEC_PAGES[0].slug;
const SPEC_PAGE_BY_FILENAME = new Map(
  SPEC_PAGES.map(page => [page.filename.toLowerCase(), page])
);
const SPEC_CONTENT_BASE_PATH = '/content/specification';

function joinSpecPath(file = '') {
  const cleanFile = String(file).replace(/^\/+/, '');
  return cleanFile ? `${SPEC_CONTENT_BASE_PATH}/${cleanFile}` : SPEC_CONTENT_BASE_PATH;
}

// Get slug from URL
function getSlugFromURL() {
  const path = window.location.pathname;
  const match = path.match(/\/specification\/([^\/]+)/);
  return match ? match[1] : null;
}

function getSpecRepoUrl() {
  const fromDataset = document.body?.dataset?.specRepo;
  const url = fromDataset || 'https://github.com/stratum-mining/sv2-spec';
  return url.replace(/\/+$/, '');
}

const searchTextParser = new marked.Parser({});

function inlineTokensToText(tokens) {
  if (!tokens || tokens.length === 0) return '';
  return searchTextParser.parseInline(tokens, searchTextParser.textRenderer);
}

function toSearchText(value) {
  return String(value || '').toLowerCase();
}

function collectTokenText(token, parts) {
  if (!token) return;

  switch (token.type) {
    case 'space':
    case 'hr':
    case 'def':
      return;

    case 'paragraph':
    case 'text': {
      const text = token.tokens ? inlineTokensToText(token.tokens) : token.text;
      if (text) parts.push(text);
      return;
    }

    case 'code':
      if (token.text) parts.push(token.text);
      return;

    case 'blockquote':
      token.tokens?.forEach(child => collectTokenText(child, parts));
      return;

    case 'list':
      token.items?.forEach(item => {
        if (item.tokens) {
          item.tokens.forEach(child => collectTokenText(child, parts));
        } else if (item.text) {
          parts.push(item.text);
        }
      });
      return;

    case 'table':
      token.header?.forEach(cell => {
        const text = cell.tokens ? inlineTokensToText(cell.tokens) : cell.text;
        if (text) parts.push(text);
      });
      token.rows?.forEach(row => {
        row.forEach(cell => {
          const text = cell.tokens ? inlineTokensToText(cell.tokens) : cell.text;
          if (text) parts.push(text);
        });
      });
      return;

    default:
      // Best-effort: if token has nested block tokens, walk them.
      if (Array.isArray(token.tokens)) {
        token.tokens.forEach(child => collectTokenText(child, parts));
        return;
      }
      if (token.text) parts.push(token.text);
  }
}

function splitPathHash(href) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return { path: href, hash: '' };
  return { path: href.slice(0, hashIndex), hash: href.slice(hashIndex) };
}

function rewriteImageHref(href) {
  if (!href || typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z+.-]*):/);
  if (schemeMatch) {
    const protocol = schemeMatch[1].toLowerCase() + ':';
    if (protocol === 'http:' || protocol === 'https:') return value;
    if (protocol === 'data:' && /^data:image\//i.test(value)) return value;
    return null;
  }

  if (value.startsWith('/')) {
    if (value.startsWith('//') || hasUnsafePathSegments(value)) return null;
    return value;
  }

  const clean = value.replace(/^\.\//, '');
  if (hasUnsafePathSegments(clean)) return null;
  return joinSpecPath(clean);
}

function rewriteLinkHref(href, specRepoUrl) {
  if (!href || typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;

  // Same-page anchor or absolute site link
  if (value.startsWith('#')) return { href: value, external: false };
  if (value.startsWith('/')) {
    if (value.startsWith('//') || hasUnsafePathSegments(value)) return null;
    return { href: value, external: false };
  }

  // Allowed schemes (http:, https:, mailto:, tel:)
  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z+.-]*):/);
  if (schemeMatch) {
    const protocol = schemeMatch[1].toLowerCase() + ':';
    if (!SAFE_LINK_PROTOCOLS.has(protocol)) return null;
    const external = protocol === 'http:' || protocol === 'https:';
    return { href: value, external };
  }

  const { path, hash } = splitPathHash(value);
  const cleanPath = path.replace(/^\.\//, '');
  if (hasUnsafePathSegments(cleanPath)) return null;

  // Rewrite links to our rendered spec pages
  if (cleanPath.toLowerCase().endsWith('.md')) {
    const filename = (cleanPath.split('/').pop() || cleanPath).toLowerCase();
    const page = SPEC_PAGE_BY_FILENAME.get(filename);
    if (page) {
      return { href: `/specification/${page.slug}/${hash}`, external: false };
    }
  }

  // Fallback: route relative links to the GitHub source repo (prevents broken in-page relative links)
  return { href: `${specRepoUrl}/blob/main/${cleanPath}${hash}`, external: true };
}

function createSpecRenderer(specRepoUrl) {
  const slugger = createSlugger();
  const renderer = new marked.Renderer();

  renderer.heading = function(token) {
    const id = slugger.slug(token.text);
    const content = this.parser.parseInline(token.tokens);
    return renderHeadingWithAnchor({ depth: token.depth, id, html: content, text: token.text });
  };

  renderer.image = function(token) {
    const resolved = rewriteImageHref(token.href);
    if (!resolved) return '';

    // Use TextRenderer so alt text stays plain.
    const altText = token.tokens
      ? this.parser.parseInline(token.tokens, this.parser.textRenderer)
      : (token.text || '');

    let html = `<img src="${escapeHtml(resolved)}" alt="${escapeHtml(altText)}"`;
    if (token.title) html += ` title="${escapeHtml(token.title)}"`;
    html += ' loading="lazy" decoding="async">';
    return html;
  };

  renderer.link = function(token) {
    const label = this.parser.parseInline(token.tokens);
    const rewritten = rewriteLinkHref(token.href, specRepoUrl);
    if (!rewritten) return label;

    let html = `<a href="${escapeHtml(rewritten.href)}"`;
    if (token.title) html += ` title="${escapeHtml(token.title)}"`;
    if (rewritten.external) html += ' target="_blank" rel="noopener noreferrer"';
    html += `>${label}</a>`;
    return html;
  };
  renderer.html = function() { return ''; };

  return renderer;
}

// Extract ToC (H2–H4 headings) from markdown using Marked's lexer so we skip code fences, etc.
function extractToc(markdown) {
  const toc = [];
  const tokens = marked.lexer(markdown);
  const slugger = createSlugger();

  for (const token of tokens) {
    if (token.type !== 'heading') continue;
    const id = slugger.slug(token.text);
    if (token.depth >= 2 && token.depth <= 4) {
      toc.push({ level: token.depth, text: token.text, id });
    }
  }

  return toc;
}

function scrollToId(targetId, { behavior = 'smooth' } = {}) {
  const target = document.getElementById(targetId);
  if (!target) return false;
  target.scrollIntoView({ behavior, block: 'start' });
  return true;
}

function getSpecPageHref(slug) {
  return `/specification/${slug}/`;
}

function renderMobilePageSelect(select, toc, currentSlug, query = '') {
  const q = normalizeQuery(query);
  const hasQuery = q.length > 0;
  const currentHash = window.location.hash;
  const pageOptions = SPEC_PAGES
    .map(page => ({
      value: getSpecPageHref(page.slug),
      label: page.slug === currentSlug ? `${page.title} (current page)` : page.title,
      searchText: toSearchText(page.title)
    }))
    .filter(item => !hasQuery || item.searchText.includes(q));
  const sectionOptions = toc
    .map(item => ({
      value: `#${item.id}`,
      label: item.text,
      searchText: toSearchText(item.text)
    }))
    .filter(item => !hasQuery || item.searchText.includes(q));

  let html = `<option value="">${hasQuery ? 'Select a result...' : 'Jump to page or section...'}</option>`;

  if (pageOptions.length > 0) {
    html += '<optgroup label="Pages">';
    html += pageOptions
      .map(item => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`)
      .join('');
    html += '</optgroup>';
  }

  if (sectionOptions.length > 0) {
    html += '<optgroup label="Current page sections">';
    html += sectionOptions
      .map(item => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`)
      .join('');
    html += '</optgroup>';
  }

  if (hasQuery && pageOptions.length === 0 && sectionOptions.length === 0) {
    html += '<option value="" disabled>No matches</option>';
  }

  select.innerHTML = html;

  if (!hasQuery) {
    const hasMatchingHash = sectionOptions.some(item => item.value === currentHash);
    select.value = hasMatchingHash ? currentHash : getSpecPageHref(currentSlug);
  } else {
    select.value = '';
  }
}

function initMobileSectionNavigator(toc, currentSlug, onScrolled) {
  const searchInput = document.getElementById('spec-mobile-search');
  const select = document.getElementById('spec-page-select');
  if (!select) return { refreshFromLocation: () => {} };

  const render = () => {
    renderMobilePageSelect(select, toc, currentSlug, searchInput?.value || '');
  };

  render();

  searchInput?.addEventListener('input', render);

  select.addEventListener('change', () => {
    const value = select.value;
    if (!value) return;

    if (value.startsWith('#')) {
      const targetId = value.slice(1);
      if (scrollToId(targetId)) {
        history.pushState(null, '', value);
        onScrolled?.(targetId);
      }
      if (searchInput) searchInput.value = '';
      render();
      return;
    }

    if (value.startsWith('/')) {
      window.location.assign(value);
    }
  });

  return {
    refreshFromLocation: render
  };
}

function getPageNeighbors(currentSlug) {
  const index = SPEC_PAGES.findIndex(page => page.slug === currentSlug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? SPEC_PAGES[index - 1] : null,
    next: index < SPEC_PAGES.length - 1 ? SPEC_PAGES[index + 1] : null
  };
}

function renderPagination(currentSlug) {
  const pagination = document.getElementById('spec-pagination');
  if (!pagination) return;

  const { previous, next } = getPageNeighbors(currentSlug);
  const previousHtml = previous
    ? `<a class="spec-page-jump spec-page-jump-prev" href="/specification/${previous.slug}/" rel="prev">
        <span class="spec-page-jump-label">Previous</span>
        <span class="spec-page-jump-title">${escapeHtml(previous.title)}</span>
      </a>`
    : '<span class="spec-page-jump spec-page-jump-disabled" aria-hidden="true"></span>';

  const nextHtml = next
    ? `<a class="spec-page-jump spec-page-jump-next" href="/specification/${next.slug}/" rel="next">
        <span class="spec-page-jump-label">Next</span>
        <span class="spec-page-jump-title">${escapeHtml(next.title)}</span>
      </a>`
    : '<span class="spec-page-jump spec-page-jump-disabled" aria-hidden="true"></span>';

  pagination.innerHTML = `${previousHtml}${nextHtml}`;
}

// Render sidebar with all pages and expandable ToC for current page
function renderToc(toc, currentSlug, { mode = 'default', query = '', onScrolled } = {}) {
  const nav = document.getElementById('spec-nav');
  if (!nav) return;

  // Default view: render all pages with ToC expansion for current page only
  if (mode === 'default') {
    nav.innerHTML = SPEC_PAGES.map(page => {
      const isActive = page.slug === currentSlug;
      let pageHtml = `
        <div class="spec-nav-item">
          <a href="/specification/${page.slug}/"
             class="spec-page-link ${isActive ? 'active' : ''}">
            ${escapeHtml(page.title)}
          </a>
      `;

      if (isActive && toc.length > 0) {
        pageHtml += '<div class="spec-toc-container">';
        pageHtml += toc.map(item => `
          <a href="#${escapeHtml(item.id)}" class="spec-toc-link spec-toc-level-${item.level}">
            ${escapeHtml(item.text)}
          </a>
        `).join('');
        pageHtml += '</div>';
      }

      pageHtml += '</div>';
      return pageHtml;
    }).join('');
  } else {
    nav.innerHTML = `
      <div class="spec-search-empty">
        Searching for "${escapeHtml(query)}"…
      </div>
    `;
  }

  wireTocScrollLinks(nav, onScrolled || (() => {}));
}

let tocScrollHandler = null;

function wireTocScrollLinks(container, onScrolled) {
  // Use event delegation: single listener on container instead of per-link
  if (tocScrollHandler) {
    container.removeEventListener('click', tocScrollHandler);
  }
  tocScrollHandler = (e) => {
    const link = e.target.closest('a.spec-toc-link[href^="#"]');
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const targetId = link.getAttribute('href')?.slice(1);
    if (!targetId) return;

    e.preventDefault();
    if (scrollToId(targetId)) {
      history.pushState(null, '', `#${targetId}`);
      onScrolled?.(targetId);
    }
  };
  container.addEventListener('click', tocScrollHandler);
}

const markdownCache = new Map();
let searchIndexPromise = null;
let searchIndexError = false;

async function loadMarkdown(page) {
  if (markdownCache.has(page.filename)) return markdownCache.get(page.filename);
  const path = joinSpecPath(page.filename);

  const response = await fetch(path);
  if (!response.ok) throw new Error('Page not found');

  const markdown = await response.text();

  // If a host returns HTML fallback for missing markdown, do not render it as markdown.
  if (isLikelyHtmlResponse(response, markdown)) {
    throw new Error('Invalid specification source response');
  }

  markdownCache.set(page.filename, markdown);
  return markdown;
}

function normalizeQuery(value) {
  return value.trim().toLowerCase();
}

function buildPageSearchIndex(markdown) {
  const tokens = marked.lexer(markdown);
  const slugger = createSlugger();

  const toc = [];
  const sections = [];
  const pageParts = [];
  let currentSection = null;

  for (const token of tokens) {
    if (token.type === 'heading') {
      const id = slugger.slug(token.text);
      const headingText = token.text || '';
      if (headingText) pageParts.push(headingText);

      if (token.depth >= 2 && token.depth <= 4) {
        currentSection = {
          id,
          level: token.depth,
          text: headingText,
          textLower: toSearchText(headingText),
          parts: []
        };
        toc.push({ level: token.depth, text: headingText, id });
        sections.push(currentSection);
      } else if (currentSection && headingText) {
        // Keep deeper headings searchable under their parent section.
        currentSection.parts.push(headingText);
      }
      continue;
    }

    const parts = [];
    collectTokenText(token, parts);
    if (parts.length === 0) continue;

    const text = parts.join(' ');
    pageParts.push(text);
    currentSection?.parts.push(text);
  }

  const indexedSections = sections.map(section => ({
    id: section.id,
    level: section.level,
    text: section.text,
    textLower: section.textLower,
    searchText: toSearchText(section.parts.join('\n'))
  }));

  return {
    toc,
    sections: indexedSections,
    searchText: toSearchText(pageParts.join('\n'))
  };
}

async function ensureSearchIndex() {
  // If we had an error before, reset and try again
  if (searchIndexError) {
    searchIndexPromise = null;
    searchIndexError = false;
  }

  if (searchIndexPromise) return searchIndexPromise;

  searchIndexPromise = (async () => {
    const results = await Promise.allSettled(
      SPEC_PAGES.map(async (page) => {
        const markdown = await loadMarkdown(page);
        const { toc, sections, searchText } = buildPageSearchIndex(markdown);
        return {
          ...page,
          titleLower: toSearchText(page.title),
          toc,
          sections,
          searchText
        };
      })
    );

    const index = [];
    let hasError = false;
    for (const result of results) {
      if (result.status === 'fulfilled') {
        index.push(result.value);
      } else {
        console.warn('Failed to index spec page:', result.reason);
        hasError = true;
      }
    }

    // If all pages failed, mark as error so we retry next time
    if (index.length === 0 && hasError) {
      searchIndexError = true;
      throw new Error('Failed to build search index');
    }

    return index;
  })();

  try {
    return await searchIndexPromise;
  } catch (err) {
    searchIndexError = true;
    throw err;
  }
}

function renderSearchResults(index, query, currentSlug, onScrolled) {
  const nav = document.getElementById('spec-nav');
  if (!nav) return;

  const q = normalizeQuery(query);
  if (!q) return;

  const results = [];
  for (const page of index) {
    const titleMatch = page.titleLower.includes(q);
    const sectionMatches = (page.sections || [])
      .filter(section => section.textLower.includes(q) || section.searchText.includes(q))
      .slice(0, 25);
    const bodyMatch = page.searchText?.includes(q);

    if (!titleMatch && sectionMatches.length === 0 && !bodyMatch) continue;

    const isActive = page.slug === currentSlug;
    let html = `
      <div class="spec-nav-item">
        <a href="/specification/${page.slug}/"
           class="spec-page-link ${isActive ? 'active' : ''}">
          ${escapeHtml(page.title)}
        </a>
    `;

    if (sectionMatches.length > 0) {
      html += '<div class="spec-toc-container">';
      html += sectionMatches.map(item => {
        const href = isActive ? `#${item.id}` : `/specification/${page.slug}/#${item.id}`;
        return `
          <a href="${escapeHtml(href)}" class="spec-toc-link spec-toc-level-${item.level}">
            ${escapeHtml(item.text)}
          </a>
        `;
      }).join('');
      html += '</div>';
    } else if (bodyMatch) {
      html += '<div class="spec-search-empty">Match in content.</div>';
    }

    html += '</div>';
    results.push(html);
  }

  if (results.length === 0) {
    nav.innerHTML = '<div class="spec-search-empty">No matches.</div>';
    return;
  }

  nav.innerHTML = results.join('');
  wireTocScrollLinks(nav, onScrolled);
}

function updatePageActions(page, specRepoUrl) {
  const viewLink = document.getElementById('spec-view-github');
  const askLink = document.getElementById('spec-ask-question');
  if (!viewLink && !askLink) return;

  const hash = window.location.hash || '';
  const githubBlobUrl = `${specRepoUrl}/blob/main/${page.filename}${hash}`;

  if (viewLink) viewLink.setAttribute('href', githubBlobUrl);
  if (askLink) {
    const url = new URL(`${specRepoUrl}/discussions/new`);
    url.searchParams.set('category', 'q-a');
    url.searchParams.set('title', `Question: ${page.title}${hash ? ` (${hash.slice(1)})` : ''}`);
    url.searchParams.set('body', `Question about the specification:\\n\\n${githubBlobUrl}\\n\\n---\\n\\n`);
    askLink.setAttribute('href', url.toString());
  }
}

// Debounce utility
function debounce(fn, delay) {
  let timeoutId = null;
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Render specification page
async function initSpecPage() {
  const path = window.location.pathname;

  // Validate DEFAULT_SPEC_SLUG exists
  if (!DEFAULT_SPEC_SLUG) {
    showError('Specification configuration error');
    return;
  }

  if (path === '/specification' || path === '/specification/' || path === '/specification.html') {
    window.location.replace(`/specification/${DEFAULT_SPEC_SLUG}/`);
    return;
  }

  const slug = getSlugFromURL();

  if (!slug) {
    showError('Invalid specification URL');
    return;
  }

  const page = SPEC_PAGES.find(p => p.slug === slug);

  if (!page) {
    showError('Specification page not found');
    return;
  }

  const specRepoUrl = getSpecRepoUrl();
  renderPagination(slug);

  try {
    const markdown = await loadMarkdown(page);

    // Extract ToC and parse markdown to HTML with stable heading IDs + link/image rewriting
    const toc = extractToc(markdown);
    const renderer = createSpecRenderer(specRepoUrl);
    const html = marked.parse(markdown, { renderer });
    let mobileSectionNavigator = null;
    const syncAfterNavigation = () => {
      updatePageActions(page, specRepoUrl);
      mobileSectionNavigator?.refreshFromLocation();
    };

    // Update page
    document.title = `${page.title} - Specification - Stratum V2`;
    const contentElement = document.getElementById('spec-content');
    if (contentElement) {
      contentElement.innerHTML = html;

      await highlightCodeBlocks(contentElement);

      // Smooth-scroll same-page hash links via event delegation
      contentElement.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        if (link.classList.contains('heading-anchor')) return;
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const href = link.getAttribute('href');
        if (!href) return;
        const targetId = href.slice(1);
        if (!targetId) return;

        e.preventDefault();
        if (scrollToId(targetId)) {
          history.pushState(null, '', `#${targetId}`);
          syncAfterNavigation();
        }
      });
    }

    // Render ToC in sidebar
    renderToc(toc, slug, { onScrolled: syncAfterNavigation });

    mobileSectionNavigator = initMobileSectionNavigator(toc, slug, syncAfterNavigation);

    syncAfterNavigation();

    // Search (sidebar) with debounce to prevent race conditions
    const searchInput = document.getElementById('spec-search');
    if (searchInput) {
      const handleSearch = debounce(async (query) => {
        const q = normalizeQuery(query);

        if (!q) {
          renderToc(toc, slug, { onScrolled: syncAfterNavigation });
          return;
        }

        renderToc([], slug, { mode: 'search', query });

        try {
          const index = await ensureSearchIndex();
          // Ignore stale queries (user typed again while we were indexing)
          if (normalizeQuery(searchInput.value) !== q) return;
          renderSearchResults(index, query, slug, syncAfterNavigation);
        } catch (err) {
          console.warn('Search index error:', err);
          const nav = document.getElementById('spec-nav');
          if (nav) {
            nav.innerHTML = '<div class="spec-search-empty">Search unavailable. Please try again.</div>';
          }
        }
      }, 150);

      searchInput.addEventListener('input', () => {
        handleSearch(searchInput.value);
      });
    }

    // Keep toolbar links in sync if the hash changes via back/forward navigation.
    window.addEventListener('hashchange', () => {
      syncAfterNavigation();
    });
    window.addEventListener('popstate', () => {
      syncAfterNavigation();
      const id = window.location.hash.slice(1);
      if (id) scrollToId(id, { behavior: 'auto' });
    });

    // Scroll to hash (if present) after content is in DOM
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.slice(1);
        if (id) scrollToId(id, { behavior: 'auto' });
      }, 0);
    }

  } catch (err) {
    console.error('Error loading specification:', err);
    showError('Specification page not found');
  }
}

// Show error message
function showError(message) {
  const content = document.getElementById('spec-content');
  if (content) {
    content.innerHTML = `
      <div style="text-align: center; padding: 4rem 0;">
        <h2>Error</h2>
        <p>${escapeHtml(message)}</p>
        <a href="/" style="margin-top: 2rem; display: inline-block; color: hsl(var(--primary));">Back to Home</a>
      </div>
    `;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpecPage);
} else {
  initSpecPage();
}
