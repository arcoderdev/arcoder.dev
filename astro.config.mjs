// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://arcoder-dev-git-website-oficial-adrianhdez2s-projects.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [preact(), sitemap()],
});