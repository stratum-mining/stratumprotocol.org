import { createSlugger, escapeHtml, renderHeadingWithAnchor } from './markdown.js';
import { highlightCodeBlocks } from './highlighting.js';
import { parseFrontmatter, formatDate } from './utils.js';

// Permalink mapping for custom URLs
const PERMALINK_MAP = {
  '/blog/case-study/hashlabs/': 'hashlabs'
};

// Get slug from URL
function getSlugFromURL() {
  const path = window.location.pathname;

  // Check if current path is a custom permalink
  if (PERMALINK_MAP[path]) {
    return PERMALINK_MAP[path];
  }

  // Extract slug from /blog/<slug>/ or /blog/<slug>
  const match = path.match(/\/blog\/([^\/]+)/);
  return match ? match[1] : null;
}

// Blog post registry
// To add a new post: add the slug to this array and drop the .md file in content/blog/
const BLOG_POSTS = [
  'sri-roadmap-2026',
  'hashlabs',
  'sri-roadmap-2025',
  'sri-roadmap-2023',
  'sri-1.0.0',
  'stratumv2-jn-announcement'
];

// Fetch all blog posts with better error reporting
async function fetchAllPosts() {
  const posts = [];
  const errors = [];

  for (const slug of BLOG_POSTS) {
    try {
      const response = await fetch(`/content/blog/${slug}.md`);
      if (!response.ok) {
        errors.push({ slug, error: `HTTP ${response.status}` });
        continue;
      }

      const markdown = await response.text();
      const { frontmatter } = parseFrontmatter(markdown);

      if (frontmatter.title && frontmatter.date) {
        posts.push({
          slug,
          title: frontmatter.title,
          description: frontmatter.description || '',
          date: frontmatter.date,
          authors: Array.isArray(frontmatter.authors) ? frontmatter.authors : [frontmatter.authors].filter(Boolean),
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          permalink: frontmatter.permalink
        });
      } else {
        errors.push({ slug, error: 'Missing title or date in frontmatter' });
      }
    } catch (err) {
      errors.push({ slug, error: err.message });
    }
  }

  // Log errors for debugging but don't fail completely
  if (errors.length > 0) {
    console.warn('Some blog posts failed to load:', errors);
  }

  return { posts, errors };
}

// Render blog list
async function initBlogList() {
  const container = document.getElementById('blog-grid');
  if (!container) {
    console.error('Blog grid container not found');
    return;
  }

  try {
    const { posts, errors } = await fetchAllPosts();

    if (posts.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
          <p>No blog posts available at the moment.</p>
          ${errors.length > 0 ? '<p style="color: hsl(var(--muted-foreground)); font-size: 0.875rem;">Some posts failed to load. Please try again later.</p>' : ''}
        </div>
      `;
      return;
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.map(post => {
      const url = post.permalink || `/blog/${post.slug}/`;
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
        </a>
      `;
    }).join('');
  } catch (err) {
    console.error('Error initializing blog list:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
        <p>Error loading blog posts. Please try again later.</p>
      </div>
    `;
  }
}

// Render single blog post
async function initBlogPost() {
  try {
    const { marked } = await import('marked');
    marked.setOptions({
      gfm: true,
      breaks: false
    });

    const slug = getSlugFromURL();

    if (!slug) {
      showError('Invalid blog post URL');
      return;
    }

    // Fetch markdown file
    const response = await fetch(`/content/blog/${slug}.md`);
    if (!response.ok) {
      throw new Error('Post not found');
    }

    const markdown = await response.text();
    const { frontmatter, content } = parseFrontmatter(markdown);

    // Update page title
    document.title = `${frontmatter.title} - Stratum V2`;

    // Inject post header
    const headerContainer = document.getElementById('blog-post-header');
    if (headerContainer) {
      const formattedDate = formatDate(frontmatter.date);
      const authors = Array.isArray(frontmatter.authors) ? frontmatter.authors : [frontmatter.authors].filter(Boolean);
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
      const authorsText = authors.length > 0 ? `By ${authors.join(', ')}` : '';
      const titleSlugger = createSlugger();
      const safeTitle = escapeHtml(frontmatter.title || '');
      const titleHeading = renderHeadingWithAnchor({
        depth: 1,
        id: titleSlugger.slug(frontmatter.title || ''),
        html: safeTitle,
        text: frontmatter.title || '',
        className: 'blog-post-title'
      });

      headerContainer.innerHTML = `
        ${titleHeading}
        <p class="blog-post-meta">${escapeHtml(authorsText)}${authorsText && formattedDate ? ' • ' : ''}${escapeHtml(formattedDate)}</p>
        ${tags.length > 0 ? `
          <div class="blog-tags">
            ${tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      `;
    }

    const slugger = createSlugger();
    const renderer = new marked.Renderer();

    renderer.heading = function(token) {
      const id = slugger.slug(token.text);
      const headingHtml = this.parser.parseInline(token.tokens);
      return renderHeadingWithAnchor({ depth: token.depth, id, html: headingHtml, text: token.text });
    };

    // Render markdown content
    let html = marked.parse(content, { renderer });

    // Post-process: Convert YouTube links to embeds
    html = processYouTubeEmbeds(html);

    // Inject content
    const contentContainer = document.getElementById('blog-content');
    if (contentContainer) {
      contentContainer.innerHTML = html;

      await highlightCodeBlocks(contentContainer);

      // Add lazy loading to images
      contentContainer.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      });
    }
  } catch (err) {
    console.error('Error loading blog post:', err);
    showError('Blog post not found');
  }
}

// Process YouTube embeds
function processYouTubeEmbeds(html) {
  // Match YouTube links in markdown images: [![...](thumbnail)](youtube-url)
  const youtubeRegex = /<a href="https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)"[^>]*>.*?<\/a>/g;

  return html.replace(youtubeRegex, (match, videoId) => {
    return `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${escapeHtml(videoId)}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;
  });
}

// Show error message
function showError(message) {
  const contentContainer = document.getElementById('blog-content');
  if (contentContainer) {
    contentContainer.innerHTML = `
      <div style="text-align: center; padding: 4rem 0;">
        <h2>Error</h2>
        <p>${escapeHtml(message)}</p>
        <a href="/blog/" class="blog-back-link" style="margin-top: 2rem;">Back to Blog</a>
      </div>
    `;
  }
}

// Initialize based on page type
function init() {
  if (window.location.pathname.includes('/blog/') && window.location.pathname !== '/blog/') {
    // Blog post page
    initBlogPost();
  } else if (window.location.pathname === '/blog/' || window.location.pathname === '/blog') {
    // Blog list page
    initBlogList();
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
