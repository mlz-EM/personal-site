const markdownCache = new Map();

const loadMarkdown = async (importer, options = {}) => {
  const { signal } = options;
  const module = await importer();
  const markdownUrl = module.default;

  if (markdownCache.has(markdownUrl)) {
    return markdownCache.get(markdownUrl);
  }

  const response = await fetch(markdownUrl, { signal });
  if (!response.ok) {
    throw new Error(`Failed to load markdown from ${markdownUrl}`);
  }

  const text = await response.text();
  markdownCache.set(markdownUrl, text);
  return text;
};

export const clearMarkdownCache = () => {
  markdownCache.clear();
};

export default loadMarkdown;
