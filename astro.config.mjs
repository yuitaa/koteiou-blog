// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeWrap from 'rehype-wrap';
import rehypeExternalLinks from 'rehype-external-links';

import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://koteiou.pages.dev/',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeWrap,
        {
          selector: 'table',
          wrapper: 'div.overflow-x-auto',
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [expressiveCode(), mdx(), icon()],
});
