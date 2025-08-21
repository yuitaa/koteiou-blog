// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeWrap from 'rehype-wrap';

import mdx from '@astrojs/mdx';

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
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});
