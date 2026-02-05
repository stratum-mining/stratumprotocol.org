import { defineConfig } from 'vite';
import { copyFileSync, cpSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import i18nPlugin from './vite-plugin-i18n.js';

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
      strict: false
    }
  },
  plugins: [
    // i18n plugin - generates /zh/ and /ru/ translated versions of index.html
    i18nPlugin({
      locales: ['en', 'zh', 'ru'],
      defaultLocale: 'en',
      localesDir: 'locales',
      inputFiles: ['index.html']
    }),
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
        const specSrc = join('content', 'specification');
        if (existsSync(specSrc)) {
          try {
            const specDest = join('dist', 'content', 'specification');
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
              errors.push('No specification markdown files found in content/specification');
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
          errors.push('Specification content directory not found: content/specification');
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
    }
  ]
});
