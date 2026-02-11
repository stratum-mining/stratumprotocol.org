let highlighterPromise = null;

async function loadHighlighter() {
  if (highlighterPromise) return highlighterPromise;

  highlighterPromise = (async () => {
    const [{ default: hljs }, { default: c }] = await Promise.all([
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/c')
    ]);

    hljs.registerLanguage('c', c);
    return hljs;
  })();

  return highlighterPromise;
}

function getRegisteredLanguage(codeElement) {
  const classAttr = String(codeElement.className || '');
  const match = classAttr.match(/\blanguage-([a-z0-9_-]+)\b/i);
  return match ? match[1].toLowerCase() : null;
}

export async function highlightCodeBlocks(container = document) {
  const blocks = Array.from(container.querySelectorAll('pre code'));
  if (blocks.length === 0) return;

  // Avoid loading the highlighter unless there are explicit language fences.
  const hasExplicitLanguage = blocks.some(block => getRegisteredLanguage(block));
  if (!hasExplicitLanguage) return;

  const hljs = await loadHighlighter();

  blocks.forEach(block => {
    const language = getRegisteredLanguage(block);
    if (!language) return;
    if (!hljs.getLanguage(language)) return;
    hljs.highlightElement(block);
  });
}
