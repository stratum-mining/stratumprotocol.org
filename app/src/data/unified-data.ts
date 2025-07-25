import specification from '../data/specification.json';
const specArray = Object.entries(specification).map(([key, section]) => {
  const titleFromKey = key
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return {
    type: 'spec',
    title: titleFromKey,
    description: section.content.substring(0, 150),
    content: section.content,
    slug: section.slug,
  };
});

// Unified list
const unifiedData = [ ...specArray];

export default unifiedData;