import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const basename = process.env.VITE_BASENAME || '';

// https://vite.dev/config/
export default defineConfig({
  base: basename,
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './app/src'),
  //   },
  // },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'app/src/'),
      },
      // {
      //   find: '@components',
      //   replacement: path.resolve(__dirname, './app/src/components'),
      // },
    ],
  },
});
