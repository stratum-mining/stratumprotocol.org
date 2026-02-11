# Stratum V2 Website

Static site built with Vite. Content is authored in Markdown and rendered as static HTML during build, with client-side enhancements for search/interactions.

## Develop

1. `npm install`
2. `npm run dev` (Vite dev server)

## Build

- `npm run build` produces `dist/`
- `vite.config.js` copies `content/blog/` and the required parts of `content/specification/` into `dist/content/`
- `dist/assets/*` filenames are hashed by Vite for caching; edit source in `src/`

## Localization

- Translation files live in `locales/*.txt`
- File format is `key = value` (lines starting with `#` are comments)
- Reference file (source of truth for keys): `locales/en.txt`

### Add a new language

1. Copy `locales/en.txt` to a new file named `locales/<locale>.txt` (example: `locales/fr.txt`).
2. Translate only the values (right side of `=`), and keep all keys identical to `locales/en.txt`.
3. Register the locale in `vite.config.js` inside `i18nPlugin({ locales: [...] })`.
4. Register the locale in `src/main.js`:
   - Add it to `I18N_SUPPORTED_LOCALES`
   - If the language is RTL, add it to `I18N_RTL_LOCALES`
   - Add an alias in `I18N_LOCALE_ALIASES` only if needed
5. Add the locale to the language switcher dropdown in `src/partials/nav.html`.
6. Run `npm run build` and confirm `dist/<locale>/index.html` is generated.
7. Run `npm run dev` and verify `/<locale>/` loads translated content.

## Content

### Blog posts

- Source: `content/blog/*.md`
- Rendered by: `vite.config.js` static generation (fallback runtime logic lives in `src/blog.js`)
- Routing:
  - `/blog/` → list (`blog.html`)
  - `/blog/<slug>/` → post (`blog-post.html`)

### Specification

- Source: `content/specification/` (git submodule)
- Rendered by: `vite.config.js` static generation (fallback runtime logic lives in `src/specification.js`)
