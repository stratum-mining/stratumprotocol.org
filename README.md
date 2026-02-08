# Stratum V2 Website

Static site built with Vite. Content is authored in Markdown and rendered client-side.

## Develop

1. `npm install`
2. `npm run dev` (Vite dev server)

## Build

- `npm run build` produces `dist/`
- `vite.config.js` copies `content/blog/` and the required parts of `content/specification/` into `dist/content/`
- `dist/assets/*` filenames are hashed by Vite for caching; edit source in `src/`

## Content

### Blog posts

- Source: `content/blog/*.md`
- Rendered by: `src/blog.js`
- Routing:
  - `/blog/` → list (`blog.html`)
  - `/blog/<slug>/` → post (`blog-post.html`)

### Specification

- Source: `content/specification/` (git submodule)
- Rendered by: `src/specification.js`
