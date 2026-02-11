import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Parse a simple translation file (key = value format)
 */
function parseTranslationFile(filePath) {
  if (!existsSync(filePath)) return {};

  const content = readFileSync(filePath, 'utf-8');
  const translations = {};

  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) return;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      translations[key] = value;
    }
  });

  return translations;
}

/**
 * Load all translations for a locale
 */
function loadLocale(locale, localesDir) {
  const filePath = join(localesDir, `${locale}.txt`);
  return parseTranslationFile(filePath);
}

/**
 * Replace data-i18n attributes with translated content
 */
function translateHtml(html, translations, locale, rtlLocales = new Set()) {
  const dir = rtlLocales.has(locale) ? 'rtl' : 'ltr';

  // Update lang/dir attributes on <html>
  html = html.replace(/<html\b[^>]*>/, `<html lang="${locale}" dir="${dir}">`);

  // Replace content of elements with data-i18n attribute
  // Pattern: <tag data-i18n="key">content</tag>
  html = html.replace(
    /(<[^>]+data-i18n="([^"]+)"[^>]*>)([^<]*)(<\/[^>]+>)/g,
    (match, openTag, key, content, closeTag) => {
      const translated = translations[key];
      if (translated !== undefined) {
        return openTag + escapeHtml(translated) + closeTag;
      }
      return match;
    }
  );

  // Also handle self-closing tags with data-i18n-placeholder for inputs
  html = html.replace(
    /(<input[^>]+)data-i18n-placeholder="([^"]+)"([^>]*placeholder=")([^"]*)("[^>]*>)/g,
    (match, before, key, mid, placeholder, after) => {
      const translated = translations[key];
      if (translated !== undefined) {
        return before + `data-i18n-placeholder="${key}"` + mid + escapeHtml(translated) + after;
      }
      return match;
    }
  );

  // Handle data-i18n-aria-label
  html = html.replace(
    /(<[^>]+)data-i18n-aria-label="([^"]+)"([^>]*aria-label=")([^"]*)("[^>]*>)/g,
    (match, before, key, mid, label, after) => {
      const translated = translations[key];
      if (translated !== undefined) {
        return before + `data-i18n-aria-label="${key}"` + mid + escapeHtml(translated) + after;
      }
      return match;
    }
  );

  return html;
}

/**
 * Add hreflang links for SEO
 */
function addHreflangLinks(html, locales) {
  const hreflangLinks = locales.map(locale => {
    const href = locale === 'en' ? '/' : `/${locale}/`;
    return `<link rel="alternate" hreflang="${locale}" href="${href}" />`;
  }).join('\n    ');

  // Add x-default for English
  const defaultLink = `<link rel="alternate" hreflang="x-default" href="/" />`;

  // Insert before </head>
  html = html.replace(
    '</head>',
    `    ${hreflangLinks}\n    ${defaultLink}\n  </head>`
  );

  return html;
}

/**
 * Vite plugin for i18n
 */
export default function i18nPlugin(options = {}) {
  const {
    locales = ['en', 'es', 'zh', 'ru', 'ar'],
    rtlLocales = ['ar'],
    defaultLocale = 'en',
    localesDir = 'locales',
    inputFiles = ['index.html'] // Only translate these files
  } = options;

  let projectRoot = '';
  const translationsCache = new Map();
  const rtlLocaleSet = new Set(rtlLocales.map(locale => String(locale).toLowerCase()));

  return {
    name: 'vite-plugin-i18n',

    configResolved(config) {
      projectRoot = config.root;

      // Pre-load all translations
      for (const locale of locales) {
        const translations = loadLocale(locale, join(projectRoot, localesDir));
        translationsCache.set(locale, translations);
      }
    },

    // During dev, serve the default locale
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Handle language-specific routes in dev mode
        for (const locale of locales) {
          if (locale === defaultLocale) continue;

          if (url === `/${locale}` || url === `/${locale}/`) {
            req.url = '/index.html';
            // We'll handle translation client-side in dev mode
            break;
          }
        }

        next();
      });
    },

    // Generate translated versions during build
    closeBundle() {
      const outDir = join(projectRoot, 'dist');

      for (const locale of locales) {
        if (locale === defaultLocale) continue; // Default locale already built

        const translations = translationsCache.get(locale);
        if (!translations || Object.keys(translations).length === 0) {
          console.warn(`No translations found for locale: ${locale}`);
          continue;
        }

        for (const inputFile of inputFiles) {
          const sourcePath = join(outDir, inputFile);
          if (!existsSync(sourcePath)) {
            console.warn(`Source file not found: ${sourcePath}`);
            continue;
          }

          let html = readFileSync(sourcePath, 'utf-8');

          // Translate the HTML
          html = translateHtml(html, translations, locale, rtlLocaleSet);

          // Add hreflang links
          html = addHreflangLinks(html, locales);

          // Fix asset paths for subdirectory
          html = html.replace(/href="\//g, 'href="../');
          html = html.replace(/src="\//g, 'src="../');

          // But keep external links unchanged
          html = html.replace(/href="\.\.\/\//g, 'href="//');
          html = html.replace(/src="\.\.\/\//g, 'src="//');

          // Keep anchor links
          html = html.replace(/href="\.\.\/\#/g, 'href="#');

          // Write to locale subdirectory
          const localeDir = join(outDir, locale);
          mkdirSync(localeDir, { recursive: true });

          const destPath = join(localeDir, inputFile);
          writeFileSync(destPath, html);
          console.log(`Generated: ${locale}/${inputFile}`);
        }
      }

      // Also add hreflang to the default locale file
      for (const inputFile of inputFiles) {
        const sourcePath = join(outDir, inputFile);
        if (!existsSync(sourcePath)) continue;

        let html = readFileSync(sourcePath, 'utf-8');
        html = addHreflangLinks(html, locales);
        writeFileSync(sourcePath, html);
      }
    }
  };
}
