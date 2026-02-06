import { escapeHtml } from './markdown.js';

// Parse YAML frontmatter from markdown
export function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = String(markdown).match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: String(markdown) };
  }

  const frontmatterText = match[1];
  const content = match[2];

  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  let currentArray = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('- ')) {
      if (currentArray) currentArray.push(trimmed.substring(2).trim());
      return;
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex <= 0) return;

    const key = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();

    if (value) {
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
      currentArray = null;
      return;
    }

    currentArray = [];
    frontmatter[key] = currentArray;
  });

  return { frontmatter, content };
}

// Format date string to locale display
export function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return escapeHtml(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
