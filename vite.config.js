import { defineConfig } from 'vite';
import { copyFileSync, cpSync, mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import react from '@vitejs/plugin-react';
import i18nPlugin from './vite-plugin-i18n.js';
import { marked } from 'marked';
import { escapeHtml, createSlugger, renderHeadingWithAnchor } from './src/markdown.js';
import { parseFrontmatter, formatDate } from './src/utils.js';
import {
  SAFE_LINK_PROTOCOLS as SAFE_MARKDOWN_LINK_PROTOCOLS,
  hasUnsafePathSegments,
  normalizeBlogPermalink,
  sanitizeMarkdownLinkHref as sanitizeBlogMarkdownLinkHref,
  sanitizeMarkdownImageSrc as sanitizeBlogMarkdownImageSrc,
  isExternalHttpHref
} from './src/url-safety.js';

const SPEC_CONTENT_PATH = join('content', 'specification');
const SPEC_CONTENT_LABEL = 'content/specification';
const SPEC_DIST_CONTENT_PATH = join('dist', 'content', 'specification');
const SPEC_PUBLIC_BASE_PATH = '/content/specification';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        blog: 'blog.html',
        'blog-post': 'blog-post.html',
        specification: 'specification.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    middlewareMode: false,
    // Add middleware for blog routing in dev
    proxy: {},
    fs: {
      strict: true
    }
  },
  plugins: [
    // React plugin — scoped to wizard-island.jsx only (React island for sv2-wizard)
    react({ include: ['**/wizard-island.jsx'] }),
    // i18n plugin - generates /zh/ and /ru/ translated versions of index.html
    i18nPlugin({
      locales: ['en', 'zh', 'ru'],
      defaultLocale: 'en',
      localesDir: 'locales',
      inputFiles: ['index.html']
    }),
    {
      name: 'nav-partial',
      transformIndexHtml(html) {
        const nav = loadPartial('nav');
        return html.replace('<!-- NAV_PARTIAL -->', nav);
      }
    },
    {
      name: 'blog-routing',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';

          // Handle /blog/ and /blog routes
          if (url === '/blog' || url === '/blog/') {
            req.url = '/blog.html';
          }
          // Handle blog post routes like /blog/slug/ or /blog/slug
          // But exclude /blog.html itself and other static files
          else if (url.startsWith('/blog/') && !url.includes('.')) {
            req.url = '/blog-post.html';
          }
          next();
        });
      }
    },
    {
      name: 'spec-routing',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';

          // Handle /specification/ and /specification routes
          if (url === '/specification' || url === '/specification/') {
            req.url = '/specification.html';
          }
          // Handle specification routes like /specification/slug/ or /specification/slug
          // But exclude /specification.html itself and other static files
          else if (url.startsWith('/specification/') && !url.includes('.')) {
            req.url = '/specification.html';
          }
          next();
        });
      }
    },
    {
      name: 'copy-content',
      closeBundle() {
        const errors = [];

        // Copy content/ to dist/ for production
        mkdirSync(join('dist', 'content'), { recursive: true });

        // Blog markdown files
        const blogSrc = join('content', 'blog');
        if (existsSync(blogSrc)) {
          try {
            cpSync(blogSrc, join('dist', 'content', 'blog'), {
              recursive: true
            });
          } catch (err) {
            errors.push(`Blog content: ${err.message}`);
          }
        } else {
          errors.push('Blog content directory not found: content/blog');
        }

        // Specification markdown + assets (avoid copying repo metadata like .git/.github/scripts)
        const specSrc = SPEC_CONTENT_PATH;
        if (existsSync(specSrc)) {
          try {
            const specDest = SPEC_DIST_CONTENT_PATH;
            mkdirSync(specDest, { recursive: true });

            let mdFileCount = 0;
            for (const entry of readdirSync(specSrc, { withFileTypes: true })) {
              if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
                if (entry.name.toLowerCase() === 'readme.md') continue;
                copyFileSync(join(specSrc, entry.name), join(specDest, entry.name));
                mdFileCount++;
              }
            }

            if (mdFileCount === 0) {
              errors.push(`No specification markdown files found in ${SPEC_CONTENT_LABEL}`);
            }

            // Copy asset directories
            for (const dirName of ['img', 'extensions', 'License']) {
              const dirPath = join(specSrc, dirName);
              if (existsSync(dirPath)) {
                cpSync(dirPath, join(specDest, dirName), { recursive: true });
              }
            }
          } catch (err) {
            errors.push(`Specification content: ${err.message}`);
          }
        } else {
          errors.push(`Specification content directory not found: ${SPEC_CONTENT_LABEL}`);
        }

        // Report errors
        if (errors.length > 0) {
          console.error('\n⚠️  Content copy errors during build:');
          errors.forEach(err => console.error(`   - ${err}`));
          console.error('\n   The build completed but some content may be missing.\n');

          // Fail the build if critical content is missing
          const criticalErrors = errors.filter(e =>
            e.includes('directory not found') ||
            e.includes('No specification markdown files')
          );
          if (criticalErrors.length > 0) {
            throw new Error(`Build failed: Critical content missing\n${criticalErrors.join('\n')}`);
          }
        }
      }
    },
    {
      name: 'static-content-pages',
      closeBundle() {
        const distDir = join('.', 'dist');

        const templatePaths = {
          blogList: join(distDir, 'blog.html'),
          blogPost: join(distDir, 'blog-post.html'),
          specification: join(distDir, 'specification.html')
        };

        for (const [key, filePath] of Object.entries(templatePaths)) {
          if (!existsSync(filePath)) {
            throw new Error(`Static page generation failed: missing template ${key} (${filePath})`);
          }
        }

        const blogListTemplate = readFileSync(templatePaths.blogList, 'utf-8');
        const blogPostTemplate = readFileSync(templatePaths.blogPost, 'utf-8');
        const specTemplate = readFileSync(templatePaths.specification, 'utf-8');

        generateBlogPages({
          distDir,
          blogListTemplate,
          blogPostTemplate,
          contentDir: join('.', 'content', 'blog')
        });

        generateSpecPages({
          distDir,
          specTemplate,
          contentDir: join('.', SPEC_CONTENT_PATH),
          specRepoUrl: 'https://github.com/stratum-mining/sv2-spec'
        });
      }
    }
  ]
});

function loadPartial(name) {
  const partialPath = join('.', 'src', 'partials', `${name}.html`);
  if (!existsSync(partialPath)) {
    throw new Error(`Missing partial: ${partialPath}`);
  }
  return readFileSync(partialPath, 'utf-8');
}

function stripAssetScripts(html, prefixes) {
  const safePrefixes = prefixes.map(prefix => prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const prefixPattern = safePrefixes.join('|');

  // Remove <script ... src="/assets/<prefix>..."></script>
  html = html.replace(
    new RegExp(`\\s*<script[^>]+src="\\/assets\\/(?:${prefixPattern})[^"]+"[^>]*>\\s*<\\/script>`, 'g'),
    ''
  );

  // Remove modulepreload links for stripped scripts or their chunks.
  html = html.replace(
    new RegExp(`\\s*<link[^>]+rel="modulepreload"[^>]+href="\\/assets\\/(?:${prefixPattern})[^"]+"[^>]*>`, 'g'),
    ''
  );

  return html;
}

function ensureMainScriptTag(html) {
  if (html.includes('/assets/main-') && html.includes('<script') && /<script[^>]+src="\/assets\/main-[^"]+"/.test(html)) {
    return html;
  }

  const match = html.match(/<link[^>]+rel="modulepreload"[^>]+href="(\/assets\/main-[^"]+\.js)"[^>]*>/);
  if (!match) return html;

  const mainHref = match[1];
  html = html.replace(match[0], `<script type="module" crossorigin src="${mainHref}"></script>`);
  return html;
}

function replaceElementInnerHtmlById(html, elementId, innerHtml) {
  const idIndex = html.indexOf(`id="${elementId}"`);
  if (idIndex === -1) throw new Error(`Failed to find element id="${elementId}" in template.`);

  const openStart = html.lastIndexOf('<', idIndex);
  if (openStart === -1) throw new Error(`Failed to locate opening tag for id="${elementId}".`);

  const tagNameMatch = html.slice(openStart + 1).match(/^([a-zA-Z0-9-]+)/);
  if (!tagNameMatch) throw new Error(`Failed to parse tag name for id="${elementId}".`);
  const tagName = tagNameMatch[1];

  const openEnd = html.indexOf('>', idIndex);
  if (openEnd === -1) throw new Error(`Failed to locate end of opening tag for id="${elementId}".`);

  const closeStart = findMatchingCloseTagStart(html, tagName, openEnd + 1);
  const baseIndent = getLineIndent(html, openStart);
  const contentIndent = baseIndent + '  ';
  const indented = indentHtml(innerHtml, contentIndent);

  return `${html.slice(0, openEnd + 1)}\n${indented}\n${baseIndent}${html.slice(closeStart)}`;
}

function findMatchingCloseTagStart(html, tagName, fromIndex) {
  const openToken = `<${tagName}`;
  const closeToken = `</${tagName}`;
  let depth = 1;
  let i = fromIndex;

  while (i < html.length) {
    const nextOpen = html.indexOf(openToken, i);
    const nextClose = html.indexOf(closeToken, i);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      const after = html[nextOpen + openToken.length];
      if (after && !/[\s>\/]/.test(after)) {
        i = nextOpen + openToken.length;
        continue;
      }

      const openTagEnd = html.indexOf('>', nextOpen);
      if (openTagEnd === -1) throw new Error(`Unterminated <${tagName}> tag while parsing HTML.`);

      const selfClosing = html.slice(nextOpen, openTagEnd + 1).endsWith('/>');
      if (!selfClosing) depth += 1;
      i = openTagEnd + 1;
      continue;
    }

    const closeTagEnd = html.indexOf('>', nextClose);
    if (closeTagEnd === -1) throw new Error(`Unterminated </${tagName}> tag while parsing HTML.`);

    depth -= 1;
    if (depth === 0) return nextClose;
    i = closeTagEnd + 1;
  }

  throw new Error(`Failed to find matching </${tagName}> tag.`);
}

function getLineIndent(text, index) {
  const lineStart = text.lastIndexOf('\n', index) + 1;
  const line = text.slice(lineStart, index);
  const match = line.match(/^\s*/);
  return match ? match[0] : '';
}

function indentHtml(html, indent) {
  return String(html)
    .split('\n')
    .map(line => (line.trim().length === 0 ? '' : indent + line))
    .join('\n');
}

function normalizePathToDir(urlPath) {
  const trimmed = String(urlPath || '').trim();
  if (!trimmed) return '';

  const [withoutHash] = trimmed.split('#');
  const [withoutQuery] = withoutHash.split('?');
  const withLeading = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  const normalized = withLeading.replace(/\/{2,}/g, '/');
  if (normalized.startsWith('//')) return '';
  if (hasUnsafePathSegments(normalized)) return '';

  const withoutTrailing = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  const segments = withoutTrailing.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length === 0) return '';
  if (!segments.every(segment => /^[a-z0-9._~-]+$/i.test(segment))) return '';
  return segments.join('/');
}

function updateHtmlHeadMeta(html, { title, description } = {}) {
  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`
    );
  }

  if (description) {
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`
    );
  }

  return html;
}

function generateBlogPages({ distDir, blogListTemplate, blogPostTemplate, contentDir }) {
  if (!existsSync(contentDir)) return;

  const markdownFiles = readdirSync(contentDir)
    .filter(name => name.toLowerCase().endsWith('.md'))
    .sort();

  const posts = markdownFiles.map(fileName => {
    const raw = readFileSync(join(contentDir, fileName), 'utf-8');
    const slug = fileName.replace(/\.md$/i, '');
    const { frontmatter, content } = parseFrontmatter(raw);

    const authors = Array.isArray(frontmatter.authors)
      ? frontmatter.authors
      : [frontmatter.authors].filter(Boolean);
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags].filter(Boolean);

    return {
      slug,
      filename: fileName,
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      date: frontmatter.date || '',
      authors,
      tags,
      permalink: frontmatter.permalink || '',
      markdown: content
    };
  }).filter(post => post.title && post.date);

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const cardsHtml = posts.map(post => {
    const url = normalizeBlogPermalink(post.permalink, post.slug);
    const safeUrl = escapeHtml(url);
    const formattedDate = formatDate(post.date);
    const authorsText = post.authors.length > 0 ? `By ${post.authors.join(', ')}` : '';

    return `
<a href="${safeUrl}" class="blog-card">
  <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
  <p class="blog-card-description">${escapeHtml(post.description)}</p>
  <p class="blog-card-meta">${escapeHtml(authorsText)}${authorsText && formattedDate ? ' • ' : ''}${escapeHtml(formattedDate)}</p>
  ${post.tags.length > 0 ? `
    <div class="blog-tags">
      ${post.tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
    </div>
  ` : ''}
</a>`.trim();
  }).join('\n');

  let blogIndexHtml = blogListTemplate;
  blogIndexHtml = updateHtmlHeadMeta(blogIndexHtml, {
    title: 'Blog - Stratum V2',
    description: 'Latest updates and insights from the Stratum V2 community.'
  });
  blogIndexHtml = replaceElementInnerHtmlById(blogIndexHtml, 'blog-grid', cardsHtml || '<p>No blog posts available.</p>');
  blogIndexHtml = stripAssetScripts(blogIndexHtml, ['blog-', 'highlighting-']);

  const blogIndexPath = join(distDir, 'blog', 'index.html');
  mkdirSync(join(distDir, 'blog'), { recursive: true });
  writeFileSync(blogIndexPath, blogIndexHtml);

  // Generate each blog post page.
  marked.setOptions({ gfm: true, breaks: false });

  for (const post of posts) {
    const titleSlugger = createSlugger();
    const safeTitle = escapeHtml(post.title || '');
    const titleHeading = renderHeadingWithAnchor({
      depth: 1,
      id: titleSlugger.slug(post.title || ''),
      html: safeTitle,
      text: post.title || '',
      className: 'blog-post-title'
    });

    const formattedDate = formatDate(post.date);
    const authorsText = post.authors.length > 0 ? `By ${post.authors.join(', ')}` : '';
    const tagsHtml = post.tags.length > 0
      ? `
<div class="blog-tags">
  ${post.tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
</div>`.trim()
      : '';

    const headerHtml = `
${titleHeading}
<p class="blog-post-meta">${escapeHtml(authorsText)}${authorsText && formattedDate ? ' • ' : ''}${escapeHtml(formattedDate)}</p>
${tagsHtml}`.trim();

    const slugger = createSlugger();
    const renderer = new marked.Renderer();

    renderer.heading = function(token) {
      const id = slugger.slug(token.text);
      const headingHtml = this.parser.parseInline(token.tokens);
      return renderHeadingWithAnchor({ depth: token.depth, id, html: headingHtml, text: token.text });
    };

    renderer.link = function(token) {
      const label = this.parser.parseInline(token.tokens);
      const safeHref = sanitizeBlogMarkdownLinkHref(token.href);
      if (!safeHref) return label;

      let html = `<a href="${escapeHtml(safeHref)}"`;
      if (token.title) html += ` title="${escapeHtml(token.title)}"`;
      if (isExternalHttpHref(safeHref)) html += ' target="_blank" rel="noopener noreferrer"';
      html += `>${label}</a>`;
      return html;
    };

    renderer.image = function(token) {
      const safeSrc = sanitizeBlogMarkdownImageSrc(token.href);
      if (!safeSrc) return '';

      const altText = token.tokens
        ? this.parser.parseInline(token.tokens, this.parser.textRenderer)
        : (token.text || '');

      let html = `<img src="${escapeHtml(safeSrc)}" alt="${escapeHtml(altText)}" loading="lazy" decoding="async"`;
      if (token.title) html += ` title="${escapeHtml(token.title)}"`;
      html += '>';
      return html;
    };
    renderer.html = function() { return ''; };

    let contentHtml = marked.parse(post.markdown, { renderer });
    contentHtml = processYouTubeEmbeds(contentHtml);

    const fullDescription = post.description || `Blog post: ${post.title}`;
    const canonicalUrl = `/blog/${post.slug}/`;
    const customPermalink = normalizeBlogPermalink(post.permalink, post.slug);

    const pageHtmlVariants = new Set([
      customPermalink,
      canonicalUrl
    ]);

    for (const url of pageHtmlVariants) {
      if (!url) continue;
      const dirPath = normalizePathToDir(url);
      if (!dirPath) continue;

      let postHtml = blogPostTemplate;
      postHtml = updateHtmlHeadMeta(postHtml, { title: `${post.title} - Stratum V2`, description: fullDescription });
      postHtml = replaceElementInnerHtmlById(postHtml, 'blog-post-header', headerHtml);
      postHtml = replaceElementInnerHtmlById(postHtml, 'blog-content', contentHtml);
      postHtml = stripAssetScripts(postHtml, ['blog-', 'highlighting-']);

      const outDir = join(distDir, dirPath);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), postHtml);
    }
  }
}

function processYouTubeEmbeds(html) {
  const youtubeRegex = /<a href="https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)"[^>]*>.*?<\/a>/g;
  return String(html).replace(youtubeRegex, (match, videoId) => {
    return `
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/${escapeHtml(videoId)}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>`.trim();
  });
}

function rewriteImageHref(href) {
  if (!href || typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z+.-]*):/);
  if (schemeMatch) {
    const protocol = schemeMatch[1].toLowerCase() + ':';
    if (protocol !== 'http:' && protocol !== 'https:' && !(protocol === 'data:' && /^data:image\//i.test(value))) {
      return null;
    }
    return value;
  }

  if (value.startsWith('/')) {
    if (value.startsWith('//') || hasUnsafePathSegments(value)) return null;
    return value;
  }

  const clean = value.replace(/^\.\//, '');
  if (hasUnsafePathSegments(clean)) return null;
  return `${SPEC_PUBLIC_BASE_PATH}/${clean}`;
}

function rewriteSpecLinkHref(href, specRepoUrl, filenameToSlug) {
  if (!href || typeof href !== 'string') return null;
  const value = href.trim();
  if (!value) return null;

  if (value.startsWith('#')) return { href: value, external: false };
  if (value.startsWith('/')) {
    if (value.startsWith('//') || hasUnsafePathSegments(value)) return null;
    return { href: value, external: false };
  }

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z+.-]*):/);
  if (schemeMatch) {
    const protocol = schemeMatch[1].toLowerCase() + ':';
    if (!SAFE_MARKDOWN_LINK_PROTOCOLS.has(protocol)) return null;
    const external = protocol === 'http:' || protocol === 'https:';
    return { href: value, external };
  }

  const hashIndex = value.indexOf('#');
  const pathPart = hashIndex === -1 ? value : value.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : value.slice(hashIndex);
  const cleanPath = pathPart.replace(/^\.\//, '');
  if (hasUnsafePathSegments(cleanPath)) return null;

  if (cleanPath.toLowerCase().endsWith('.md')) {
    const filename = (cleanPath.split('/').pop() || cleanPath).toLowerCase();
    const slug = filenameToSlug.get(filename);
    if (slug) return { href: `/specification/${slug}/${hash}`, external: false };
  }

  return { href: `${specRepoUrl.replace(/\/+$/, '')}/blob/main/${cleanPath}${hash}`, external: true };
}

function extractToc(markdown) {
  const toc = [];
  const tokens = marked.lexer(markdown);
  const slugger = createSlugger();

  for (const token of tokens) {
    if (token.type !== 'heading') continue;
    const id = slugger.slug(token.text);
    if (token.depth >= 2 && token.depth <= 4) toc.push({ level: token.depth, text: token.text, id });
  }

  return toc;
}

function buildSpecNavHtml(pages, toc, currentSlug) {
  return pages.map(page => {
    const isActive = page.slug === currentSlug;
    let html = `
<div class="spec-nav-item">
  <a href="/specification/${page.slug}/"
     class="spec-page-link ${isActive ? 'active' : ''}">
    ${escapeHtml(page.title)}
  </a>
`.trim();

    if (isActive && toc.length > 0) {
      html += '\n  <div class="spec-toc-container">';
      html += toc.map(item => `
    <a href="#${escapeHtml(item.id)}" class="spec-toc-link spec-toc-level-${item.level}">
      ${escapeHtml(item.text)}
    </a>
`.trimEnd()).join('\n');
      html += '\n  </div>';
    }

    html += '\n</div>';
    return html;
  }).join('\n');
}

function buildSpecSelectOptionsHtml(pages, currentSlug) {
  return pages.map(page => `
<option value="/specification/${page.slug}/" ${page.slug === currentSlug ? 'selected' : ''}>
  ${escapeHtml(page.title)}
</option>
`.trim()).join('\n');
}

function buildSpecPaginationHtml(pages, currentSlug) {
  const index = pages.findIndex(page => page.slug === currentSlug);
  if (index < 0) return '';

  const previous = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;

  const previousHtml = previous
    ? `
<a class="spec-page-jump spec-page-jump-prev" href="/specification/${previous.slug}/" rel="prev">
  <span class="spec-page-jump-label">Previous</span>
  <span class="spec-page-jump-title">${escapeHtml(previous.title)}</span>
</a>
`.trim()
    : '<span class="spec-page-jump spec-page-jump-disabled" aria-hidden="true"></span>';

  const nextHtml = next
    ? `
<a class="spec-page-jump spec-page-jump-next" href="/specification/${next.slug}/" rel="next">
  <span class="spec-page-jump-label">Next</span>
  <span class="spec-page-jump-title">${escapeHtml(next.title)}</span>
</a>
`.trim()
    : '<span class="spec-page-jump spec-page-jump-disabled" aria-hidden="true"></span>';

  return `${previousHtml}\n${nextHtml}`;
}

function updateSpecToolbarLinks(html, page, specRepoUrl) {
  const repo = specRepoUrl.replace(/\/+$/, '');
  const githubBlobUrl = `${repo}/blob/main/${page.filename}`;

  html = html.replace(
    /(<a[^>]+id="spec-view-github"[^>]+href=")[^"]*(")/,
    `$1${escapeHtml(githubBlobUrl)}$2`
  );

  const discussionUrl = new URL(`${repo}/discussions/new`);
  discussionUrl.searchParams.set('category', 'q-a');
  discussionUrl.searchParams.set('title', `Question: ${page.title}`);
  discussionUrl.searchParams.set('body', `Question about the specification:\n\n${githubBlobUrl}\n\n---\n\n`);

  html = html.replace(
    /(<a[^>]+id="spec-ask-question"[^>]+href=")[^"]*(")/,
    `$1${escapeHtml(discussionUrl.toString())}$2`
  );

  return html;
}

function generateSpecPages({ distDir, specTemplate, contentDir, specRepoUrl }) {
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

  if (!existsSync(contentDir)) return;

  const filenameToSlug = new Map(SPEC_PAGES.map(page => [page.filename.toLowerCase(), page.slug]));

  marked.setOptions({ gfm: true, breaks: false });

  const defaultPage = SPEC_PAGES[0];

  for (const page of SPEC_PAGES) {
    const filePath = join(contentDir, page.filename);
    if (!existsSync(filePath)) continue;

    const markdown = readFileSync(filePath, 'utf-8');
    const toc = extractToc(markdown);

    const headingSlugger = createSlugger();
    const renderer = new marked.Renderer();

    renderer.heading = function(token) {
      const id = headingSlugger.slug(token.text);
      const content = this.parser.parseInline(token.tokens);
      return renderHeadingWithAnchor({ depth: token.depth, id, html: content, text: token.text });
    };

    renderer.image = function(token) {
      const resolved = rewriteImageHref(token.href);
      if (!resolved) return '';

      const altText = token.tokens
        ? this.parser.parseInline(token.tokens, this.parser.textRenderer)
        : (token.text || '');

      let html = `<img src="${escapeHtml(resolved)}" alt="${escapeHtml(altText)}" loading="lazy" decoding="async"`;
      if (token.title) html += ` title="${escapeHtml(token.title)}"`;
      html += '>';
      return html;
    };

    renderer.link = function(token) {
      const label = this.parser.parseInline(token.tokens);
      const rewritten = rewriteSpecLinkHref(token.href, specRepoUrl, filenameToSlug);
      if (!rewritten) return label;

      let html = `<a href="${escapeHtml(rewritten.href)}"`;
      if (token.title) html += ` title="${escapeHtml(token.title)}"`;
      if (rewritten.external) html += ' target="_blank" rel="noopener noreferrer"';
      html += `>${label}</a>`;
      return html;
    };
    renderer.html = function() { return ''; };

    const contentHtml = marked.parse(markdown, { renderer });
    const navHtml = buildSpecNavHtml(SPEC_PAGES, toc, page.slug);
    const selectOptionsHtml = buildSpecSelectOptionsHtml(SPEC_PAGES, page.slug);
    const paginationHtml = buildSpecPaginationHtml(SPEC_PAGES, page.slug);

    let pageHtml = specTemplate;
    pageHtml = ensureMainScriptTag(pageHtml);
    pageHtml = updateHtmlHeadMeta(pageHtml, {
      title: `${page.title} - Specification - Stratum V2`,
      description: 'Technical specification for the Stratum V2 mining protocol.'
    });

    pageHtml = updateSpecToolbarLinks(pageHtml, page, specRepoUrl);
    pageHtml = replaceElementInnerHtmlById(pageHtml, 'spec-nav', navHtml);
    if (pageHtml.includes('id="spec-page-select"')) {
      pageHtml = replaceElementInnerHtmlById(pageHtml, 'spec-page-select', selectOptionsHtml);
    }
    pageHtml = replaceElementInnerHtmlById(pageHtml, 'spec-content', contentHtml);
    pageHtml = replaceElementInnerHtmlById(pageHtml, 'spec-pagination', paginationHtml);

    // Static pages don't need client-side rendering/search scripts.
    pageHtml = stripAssetScripts(pageHtml, ['specification-', 'highlighting-', 'marked', 'core-', 'c-']);
    pageHtml = injectSpecTitleFilterScript(pageHtml);

    const outDir = join(distDir, 'specification', page.slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), pageHtml);

    if (page.slug === defaultPage.slug) {
      const indexDir = join(distDir, 'specification');
      mkdirSync(indexDir, { recursive: true });
      writeFileSync(join(indexDir, 'index.html'), pageHtml);
    }
  }
}

function injectSpecTitleFilterScript(html) {
  const scriptTag = '<script src="/assets/js/spec-title-filter.js" defer></script>';

  if (!html.includes('id="spec-page-select"') && (!html.includes('id="spec-search"') || !html.includes('id="spec-nav"'))) return html;
  if (html.includes('/assets/js/spec-title-filter.js')) return html;

  return html.replace(/<\/body>/i, `\n\n  ${scriptTag}\n  </body>`);
}
